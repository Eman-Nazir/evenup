import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as friendshipService from '../services/friendship.service.js';

export const sendRequest = asyncHandler(async (req, res) => {
  const friendship = await friendshipService.sendFriendRequest(req.user._id, req.body.email);
  successResponse(res, 201, 'Friend request sent successfully', { friendship });
});

export const respondToRequest = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const friendship = await friendshipService.respondToFriendRequest(
    req.user._id,
    req.params.id,
    action
  );
  const message = action === 'accept' ? 'Friend request accepted' : 'Friend request rejected';
  successResponse(res, 200, message, { friendship });
});

export const getFriends = asyncHandler(async (req, res) => {
  const friends = await friendshipService.getFriendsList(req.user._id);
  successResponse(res, 200, 'Friends fetched successfully', { friends });
});

export const getPending = asyncHandler(async (req, res) => {
  const requests = await friendshipService.getPendingRequests(req.user._id);
  successResponse(res, 200, 'Pending requests fetched successfully', { requests });
});

export const deleteFriend = asyncHandler(async (req, res) => {
  await friendshipService.removeFriend(req.user._id, req.params.id);
  successResponse(res, 200, 'Friend removed successfully');
});