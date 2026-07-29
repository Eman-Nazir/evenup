import Expense from '../models/Expense.model.js';
import Settlement from '../models/Settlement.model.js';
import Group from '../models/Group.model.js';
import AppError from '../utils/AppError.js';

const assertGroupMembership = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);
  const isMember = group.members.some((m) => m.user.equals(userId));
  if (!isMember) throw new AppError('You are not a member of this group', 403);
  return group;
};

export const getGroupActivity = async (userId, groupId, { limit = 30 } = {}) => {
  await assertGroupMembership(groupId, userId);

  const [expenses, settlements] = await Promise.all([
    Expense.find({ group: groupId })
      .populate('createdBy', 'name avatar')
      .populate('paidBy.user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit),
    Settlement.find({ group: groupId })
      .populate('from', 'name avatar')
      .populate('to', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit),
  ]);

  const feed = [
    ...expenses.map((e) => ({
      type: 'expense',
      id: e._id,
      description: e.description,
      amount: e.amount,
      category: e.category,
      actor: e.createdBy,
      paidBy: e.paidBy,
      createdAt: e.createdAt,
    })),
    ...settlements.map((s) => ({
      type: 'settlement',
      id: s._id,
      amount: s.amount,
      from: s.from,
      to: s.to,
      method: s.method,
      createdAt: s.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);

  return feed;
};

export const getSpendingByCategory = async (userId, groupId) => {
  await assertGroupMembership(groupId, userId);

  const results = await Expense.aggregate([
    { $match: { group: new (await import('mongoose')).default.Types.ObjectId(groupId) } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);

  return results.map((r) => ({ category: r._id, total: r.total }));
};