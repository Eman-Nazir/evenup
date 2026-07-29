import Group from '../models/Group.model.js';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';

export const createGroup = async (userId, { name, type, icon, memberEmails = [] }) => {
  const members = [{ user: userId, role: 'admin' }];

  if (memberEmails.length > 0) {
    const users = await User.find({ email: { $in: memberEmails } });
    users.forEach((u) => {
      if (!u._id.equals(userId)) {
        members.push({ user: u._id, role: 'member' });
      }
    });
  }

  const group = await Group.create({ name, type, icon, createdBy: userId, members });
  return group.populate('members.user', 'name email avatar');
};

export const getUserGroups = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [groups, total] = await Promise.all([
    Group.find({ 'members.user': userId })
      .populate('members.user', 'name email avatar')
      .select('name type icon members createdBy createdAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    Group.countDocuments({ 'members.user': userId }),
  ]);

  return {
    groups,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getGroupById = async (userId, groupId) => {
  const group = await Group.findById(groupId).populate(
    'members.user',
    'name email avatar'
  );

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  const isMember = group.members.some((m) => m.user._id.equals(userId));
  if (!isMember) {
    throw new AppError('You are not a member of this group', 403);
  }

  return group;
};

const assertIsGroupAdmin = (group, userId) => {
  const member = group.members.find((m) => m.user.equals(userId) || m.user._id?.equals(userId));
  if (!member || member.role !== 'admin') {
    throw new AppError('Only group admins can perform this action', 403);
  }
};

export const addMember = async (userId, groupId, memberEmail) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);

  assertIsGroupAdmin(group, userId);

  const userToAdd = await User.findOne({ email: memberEmail });
  if (!userToAdd) throw new AppError('No user found with this email', 404);

  const alreadyMember = group.members.some((m) => m.user.equals(userToAdd._id));
  if (alreadyMember) throw new AppError('User is already a member of this group', 409);

  group.members.push({ user: userToAdd._id, role: 'member' });
  await group.save();

  return group.populate('members.user', 'name email avatar');
};

export const removeMember = async (userId, groupId, memberIdToRemove) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);

  const isSelfRemoval = userId.toString() === memberIdToRemove;
  if (!isSelfRemoval) {
    assertIsGroupAdmin(group, userId);
  }

  group.members = group.members.filter((m) => !m.user.equals(memberIdToRemove));
  await group.save();

  return group.populate('members.user', 'name email avatar');
};

export const deleteGroup = async (userId, groupId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);

  assertIsGroupAdmin(group, userId);
  await group.deleteOne();
};