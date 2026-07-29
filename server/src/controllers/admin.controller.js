import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as adminService from '../services/admin.service.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const result = await adminService.getAllUsers({ page: +page, limit: +limit, search });
  successResponse(res, 200, 'Users fetched successfully', result);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.user._id, req.params.id, req.body.role);
  successResponse(res, 200, 'User role updated successfully', { user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.user._id, req.params.id);
  successResponse(res, 200, 'User deleted successfully');
});

export const getGroups = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await adminService.getAllGroups({ page: +page, limit: +limit });
  successResponse(res, 200, 'Groups fetched successfully', result);
});

export const deleteGroup = asyncHandler(async (req, res) => {
  await adminService.deleteGroupAsAdmin(req.params.id);
  successResponse(res, 200, 'Group deleted successfully');
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getPlatformStats();
  successResponse(res, 200, 'Platform stats fetched successfully', { stats });
});