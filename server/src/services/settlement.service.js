import Settlement from '../models/Settlement.model.js';
import Group from '../models/Group.model.js';
import AppError from '../utils/AppError.js';
import { notifySettlement } from './notification.service.js';
import User from '../models/User.model.js';

const assertGroupMembership = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);
  const isMember = group.members.some((m) => m.user.equals(userId));
  if (!isMember) throw new AppError('You are not a member of this group', 403);
  return group;
};

export const recordSettlement = async (userId, groupId, { from, to, amount, method }) => {
  const group = await assertGroupMembership(groupId, userId);

  if (from === to) {
    throw new AppError('Cannot settle a debt with yourself', 400);
  }

  const settlement = await Settlement.create({ group: groupId, from, to, amount, method });

  const populatedSettlement = await settlement.populate([
    { path: 'from', select: 'name email avatar' },
    { path: 'to', select: 'name email avatar' },
  ]);

  const [fromUser, toUser] = await Promise.all([
    User.findById(from).select('name'),
    User.findById(to).select('email'),
  ]);
  notifySettlement(toUser.email, { fromName: fromUser.name, amount, groupName: group.name });

  return populatedSettlement;
};

export const getGroupSettlements = async (userId, groupId, { page = 1, limit = 20 } = {}) => {
  await assertGroupMembership(groupId, userId);
  const skip = (page - 1) * limit;

  const [settlements, total] = await Promise.all([
    Settlement.find({ group: groupId })
      .populate('from', 'name email avatar')
      .populate('to', 'name email avatar')
      .sort({ settledAt: -1 })
      .skip(skip)
      .limit(limit),
    Settlement.countDocuments({ group: groupId }),
  ]);

  return { settlements, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};