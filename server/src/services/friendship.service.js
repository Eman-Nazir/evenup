import Friendship from '../models/Friendship.model.js';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';

export const sendFriendRequest = async (requesterId, recipientEmail) => {
  const recipient = await User.findOne({ email: recipientEmail });
  if (!recipient) {
    throw new AppError('No user found with this email', 404);
  }

  if (recipient._id.equals(requesterId)) {
    throw new AppError('You cannot send a friend request to yourself', 400);
  }

  const existing = await Friendship.findOne({
    $or: [
      { requester: requesterId, recipient: recipient._id },
      { requester: recipient._id, recipient: requesterId },
    ],
  });

  if (existing) {
    if (existing.status === 'accepted') {
      throw new AppError('You are already friends with this user', 409);
    }
    throw new AppError('A friend request already exists between you and this user', 409);
  }

  const friendship = await Friendship.create({
    requester: requesterId,
    recipient: recipient._id,
  });

  return friendship;
};

export const respondToFriendRequest = async (userId, friendshipId, action) => {
  const friendship = await Friendship.findById(friendshipId);
  if (!friendship) {
    throw new AppError('Friend request not found', 404);
  }

  if (!friendship.recipient.equals(userId)) {
    throw new AppError('You are not authorized to respond to this request', 403);
  }

  if (friendship.status !== 'pending') {
    throw new AppError('This friend request has already been responded to', 400);
  }

  if (action === 'accept') {
    friendship.status = 'accepted';
  } else if (action === 'reject') {
    await friendship.deleteOne();
    return null;
  } else {
    throw new AppError('Invalid action, must be accept or reject', 400);
  }

  await friendship.save();
  return friendship;
};

export const getFriendsList = async (userId) => {
  const friendships = await Friendship.find({
    status: 'accepted',
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate('requester', 'name email avatar')
    .populate('recipient', 'name email avatar');

  return friendships
    .filter((f) => f.requester && f.recipient)   
    .map((f) => {
      const friend = f.requester._id.equals(userId) ? f.recipient : f.requester;
      return { friendshipId: f._id, friend, since: f.updatedAt };
    });
};

export const getPendingRequests = async (userId) => {
  return Friendship.find({ recipient: userId, status: 'pending' }).populate(
    'requester',
    'name email avatar'
  );
};

export const removeFriend = async (userId, friendshipId) => {
  const friendship = await Friendship.findById(friendshipId);
  if (!friendship) {
    throw new AppError('Friendship not found', 404);
  }

  const isParty =
    friendship.requester.equals(userId) || friendship.recipient.equals(userId);
  if (!isParty) {
    throw new AppError('You are not authorized to remove this friendship', 403);
  }

  await friendship.deleteOne();
};