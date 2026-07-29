import mongoose from 'mongoose';
import Expense from '../models/Expense.model.js';
import Split from '../models/Split.model.js';
import Group from '../models/Group.model.js';
import AppError from '../utils/AppError.js';
import { calculateSplits } from './splitCalculator.service.js';
import { computeNetBalances, simplifyDebts } from './debtSimplifier.service.js';
import { suggestCategory } from './ai.service.js';
import { addInterval } from './recurringExpense.service.js';
import { notifyExpenseAdded } from './notification.service.js';
import User from '../models/User.model.js';
import Settlement from '../models/Settlement.model.js';

const assertGroupMembership = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);

  const isMember = group.members.some((m) => m.user.equals(userId));
  if (!isMember) throw new AppError('You are not a member of this group', 403);

  return group;
};

export const createExpense = async (userId, payload) => {
  const {
    description, amount, group: groupId, category, date,
    splitType = 'equal', paidBy, splitDetails,
    isRecurring = false, recurrence,
  } = payload;

  const group = await assertGroupMembership(groupId, userId);
  const memberIds = group.members.map((m) => m.user);

  const resolvedCategory = category || (await suggestCategory(description));

  const payers = paidBy?.length ? paidBy : [{ user: userId, amount }];

  const totalPaid = payers.reduce((sum, p) => sum + p.amount, 0);
  if (Math.abs(totalPaid - amount) > 0.05) {
    throw new AppError('The amounts paid must add up to the total expense amount', 400);
  }

  const splits = calculateSplits({ splitType, amount, participants: memberIds, splitDetails });

  const recurrenceData = isRecurring
    ? {
        frequency: recurrence.frequency,
        nextRunDate: addInterval(new Date(date || Date.now()), recurrence.frequency),
        endDate: recurrence.endDate || null,
        parentExpense: null,
      }
    : undefined;

  const session = await mongoose.startSession();
  session.startTransaction();

  let createdExpense;

  try {
    const [expense] = await Expense.create(
      [{
        description, amount, category: resolvedCategory, date: date || Date.now(),
        group: groupId, splitType,
        paidBy: payers,
        participants: memberIds,
        createdBy: userId,
        isRecurring,
        recurrence: recurrenceData,
      }],
      { session }
    );

    const splitDocs = splits.map((s) => {
      const paidAmount = payers.find((p) => p.user.toString() === s.user.toString())?.amount || 0;
      return {
        expense: expense._id,
        group: groupId,
        user: s.user,
        amountOwed: Math.round((s.amountOwed - paidAmount) * 100) / 100,
      };
    });

    await Split.insertMany(splitDocs, { session });
    await session.commitTransaction();

    createdExpense = expense;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  createdExpense.$session(null);
  const populatedExpense = await createdExpense.populate([
    { path: 'paidBy.user', select: 'name email avatar' },
    { path: 'participants', select: 'name email avatar' },
  ]);

  const recipientUsers = await User.find({
    _id: { $in: memberIds.filter((id) => !id.equals(userId)) },
  }).select('email');
  const creator = await User.findById(userId).select('name');
  notifyExpenseAdded(
    recipientUsers.map((u) => u.email),
    { groupName: group.name, description, amount, addedBy: creator.name }
  );

  return { expense: populatedExpense, splits }; 
};





export const getGroupExpenses = async (userId, groupId, { page = 1, limit = 20 } = {}) => {
  await assertGroupMembership(groupId, userId);
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    Expense.find({ group: groupId })
      .populate('paidBy.user', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Expense.countDocuments({ group: groupId }),
  ]);

  return { expenses, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getExpenseById = async (userId, expenseId) => {
  const expense = await Expense.findById(expenseId)
    .populate('paidBy.user', 'name email avatar')
    .populate('participants', 'name email avatar')
    .populate('createdBy', 'name email avatar');

  if (!expense) throw new AppError('Expense not found', 404);
  if (expense.group) await assertGroupMembership(expense.group, userId);

  const splits = await Split.find({ expense: expense._id }).populate('user', 'name email avatar');
  return { expense, splits };
};

export const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError('Expense not found', 404);

  const group = await Group.findById(expense.group);
  const member = group.members.find((m) => m.user.equals(userId));
  const isAdmin = member?.role === 'admin';
  const isCreator = expense.createdBy.equals(userId);

  if (!isAdmin && !isCreator) {
    throw new AppError('Only the expense creator or a group admin can delete this expense', 403);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Split.deleteMany({ expense: expenseId }, { session });
    await expense.deleteOne({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};





export const getGroupBalances = async (userId, groupId) => {
  const group = await assertGroupMembership(groupId, userId);

  const [expenses, splits, settlements] = await Promise.all([
    Expense.find({ group: groupId }).select('paidBy'),
    Split.find({ group: groupId }),
    Settlement.find({ group: groupId }),
  ]);

  const netBalances = computeNetBalances(expenses, splits, settlements);

  group.members.forEach((m) => {
    const id = m.user.toString();
    if (!(id in netBalances)) netBalances[id] = 0;
  });

  return netBalances;
};






export const getSimplifiedDebts = async (userId, groupId) => {
  const netBalances = await getGroupBalances(userId, groupId);
  const transactions = simplifyDebts(netBalances);

  return { netBalances, transactions };
};

export const updateExpense = async (userId, expenseId, payload) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError('Expense not found', 404);

  const group = await Group.findById(expense.group);
  const member = group.members.find((m) => m.user.equals(userId));
  const isAdmin = member?.role === 'admin';
  const isCreator = expense.createdBy.equals(userId);

  if (!isAdmin && !isCreator) {
    throw new AppError('Only the expense creator or a group admin can edit this expense', 403);
  }

  const {
    description, amount, category, splitType = 'equal', splitDetails,
  } = payload;

  const memberIds = group.members.map((m) => m.user);
  const splits = calculateSplits({ splitType, amount, participants: memberIds, splitDetails });

  const originalPayerId = (expense.paidBy && expense.paidBy.length > 0)
    ? expense.paidBy[0].user
    : expense.createdBy;

  const originalPayers = [{ user: originalPayerId, amount }];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Split.deleteMany({ expense: expenseId }, { session });

    expense.description = description;
    expense.amount = amount;
    expense.category = category || expense.category;
    expense.splitType = splitType;
    expense.paidBy = originalPayers;
    await expense.save({ session });

    const originalPayerIdStr = originalPayerId.toString();
    const splitDocs = splits.map((s) => {
      const paidAmount = s.user.toString() === originalPayerIdStr ? amount : 0;
      return {
        expense: expense._id,
        group: expense.group,
        user: s.user,
        amountOwed: Math.round((s.amountOwed - paidAmount) * 100) / 100,
      };
    });
    await Split.insertMany(splitDocs, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  expense.$session(null);
  return expense.populate([
    { path: 'paidBy.user', select: 'name email avatar' },
    { path: 'participants', select: 'name email avatar' },
  ]);
};