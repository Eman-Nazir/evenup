import mongoose from 'mongoose';
import Expense from '../models/Expense.model.js';
import Split from '../models/Split.model.js';
import Group from '../models/Group.model.js';
import Settlement from '../models/Settlement.model.js';

export const getDashboardSummary = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);

  const [
    mySplits, mySettlements, groups, recentExpenses, recentSettlements, categoryAgg,
  ] = await Promise.all([
    // Every split belonging to this user, across ALL their groups
    Split.find({ user: uid }),

    // Every settlement this user was part of (either side), across ALL their groups
    Settlement.find({ $or: [{ from: uid }, { to: uid }] }),

    Group.find({ 'members.user': uid })
      .select('name icon type members')
      .sort({ updatedAt: -1 })
      .limit(6),

    Expense.find({ participants: uid })
      .populate('createdBy', 'name')
      .populate('group', 'name icon')
      .sort({ createdAt: -1 })
      .limit(5),

    Settlement.find({ $or: [{ from: uid }, { to: uid }] })
      .populate('from', 'name')
      .populate('to', 'name')
      .populate('group', 'name icon')
      .sort({ createdAt: -1 })
      .limit(5),

    Split.aggregate([
      { $match: { user: uid } },
      { $lookup: { from: 'expenses', localField: 'expense', foreignField: '_id', as: 'expense' } },
      { $unwind: '$expense' },
      { $group: { _id: '$expense.category', total: { $sum: '$expense.amount' } } },
    ]),
  ]);

  // SAME formula used for group-level balances — the single source of truth.
  // balance = -(their raw split share) + settlements applied on top.
  let netBalance = 0;
  mySplits.forEach((split) => {
    netBalance += -split.amountOwed;
  });
  mySettlements.forEach((s) => {
    if (s.from.toString() === userId.toString()) netBalance += s.amount;
    if (s.to.toString() === userId.toString()) netBalance -= s.amount;
  });
  netBalance = Math.round(netBalance * 100) / 100;

  const activity = [
    ...recentExpenses.map((e) => ({
      type: 'expense', id: e._id, description: e.description, amount: e.amount,
      group: e.group, actor: e.createdBy, createdAt: e.createdAt,
    })),
    ...recentSettlements.map((s) => ({
      type: 'settlement', id: s._id, amount: s.amount, from: s.from, to: s.to,
      group: s.group, createdAt: s.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  return {
    netBalance,
    totalGroups: groups.length,
    groups,
    activity,
    spendingByCategory: categoryAgg.map((c) => ({ category: c._id, total: c.total })),
  };
};