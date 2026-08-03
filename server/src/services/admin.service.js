import User from '../models/User.model.js';
import Group from '../models/Group.model.js';
import Expense from '../models/Expense.model.js';
import Settlement from '../models/Settlement.model.js';
import AppError from '../utils/AppError.js';
import Split from '../models/Split.model.js';



export const getAllUsers = async ({ page = 1, limit = 20, search = '' } = {}) => {
  const skip = (page - 1) * limit;
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter).select('-refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const updateUserRole = async (adminId, targetUserId, role) => {
  if (adminId.toString() === targetUserId) {
    throw new AppError('You cannot change your own role', 400);
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new AppError('User not found', 404);

  user.role = role;
  await user.save();
  return user;
};

export const deleteUser = async (adminId, targetUserId) => {
  if (adminId.toString() === targetUserId) {
    throw new AppError('You cannot delete your own account', 400);
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new AppError('User not found', 404);

  await user.deleteOne();
};

export const getAllGroups = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [groups, total] = await Promise.all([
    Group.find()
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Group.countDocuments(),
  ]);

  return { groups, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};


export const deleteGroupAsAdmin = async (groupId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);

  await Promise.all([
    Expense.deleteMany({ group: groupId }),
    Split.deleteMany({ group: groupId }),
    Settlement.deleteMany({ group: groupId }),
  ]);

  await group.deleteOne();
};

export const deleteUser = async (adminId, targetUserId) => {
  if (adminId.toString() === targetUserId) {
    throw new AppError('You cannot delete your own account', 400);
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new AppError('User not found', 404);

  await Group.updateMany(
    { 'members.user': targetUserId },
    { $pull: { members: { user: targetUserId } } }
  );

  await user.deleteOne();
};

export const getAllExpenses = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    Expense.find()
      .populate('group', 'name icon')
      .populate('createdBy', 'name email')
      .populate('paidBy.user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Expense.countDocuments(),
  ]);

  return { expenses, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getAllSettlements = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [settlements, total] = await Promise.all([
    Settlement.find()
      .populate('group', 'name icon')
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Settlement.countDocuments(),
  ]);

  return { settlements, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getPlatformStats = async () => {
  const [
    totalUsers,
    totalGroups,
    totalExpenses,
    totalSettlements,
    expenseVolumeResult,
    recentUsers,
    usersByMonth,
  ] = await Promise.all([
    User.countDocuments(),
    Group.countDocuments(),
    Expense.countDocuments(),
    Settlement.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
    User.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  return {
    totalUsers,
    totalGroups,
    totalExpenses,
    totalSettlements,
    totalExpenseVolume: expenseVolumeResult[0]?.total || 0,
    newUsersThisWeek: recentUsers,
    userGrowth: usersByMonth.map((u) => ({
      month: `${u._id.year}-${String(u._id.month).padStart(2, '0')}`,
      count: u.count,
    })),
  };
};