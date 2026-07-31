import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as groupService from '../services/group.service.js';
import * as expenseService from '../services/expense.service.js';   
import * as activityService from '../services/activity.service.js';
import { generateGroupLedgerPdf } from '../services/pdfExport.service.js';

export const createGroup = asyncHandler(async (req, res) => {
  const group = await groupService.createGroup(req.user._id, req.body);
  successResponse(res, 201, 'Group created successfully', { group });
});

export const getMyGroups = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const result = await groupService.getUserGroups(req.user._id, { page, limit });
  successResponse(res, 200, 'Groups fetched successfully', result);
});

export const getGroup = asyncHandler(async (req, res) => {
  const group = await groupService.getGroupById(req.user._id, req.params.id);
  successResponse(res, 200, 'Group fetched successfully', { group });
});

export const addMember = asyncHandler(async (req, res) => {
  const group = await groupService.addMember(req.user._id, req.params.id, req.body.email);
  successResponse(res, 200, 'Member added successfully', { group });
});

export const removeMember = asyncHandler(async (req, res) => {
  const group = await groupService.removeMember(req.user._id, req.params.id, req.params.memberId);
  successResponse(res, 200, 'Member removed successfully', { group });
});

export const deleteGroup = asyncHandler(async (req, res) => {
  await groupService.deleteGroup(req.user._id, req.params.id);
  successResponse(res, 200, 'Group deleted successfully');
});


export const getGroupBalances = asyncHandler(async (req, res) => {
  const balances = await expenseService.getGroupBalances(req.user._id, req.params.id);
  successResponse(res, 200, 'Balances fetched successfully', { balances });
});

export const getSimplifiedDebts = asyncHandler(async (req, res) => {
  const result = await expenseService.getSimplifiedDebts(req.user._id, req.params.id);
  successResponse(res, 200, 'Simplified debts fetched successfully', result);
});



export const getGroupActivity = asyncHandler(async (req, res) => {
  const feed = await activityService.getGroupActivity(req.user._id, req.params.id, {
    limit: parseInt(req.query.limit) || 30,
  });
  successResponse(res, 200, 'Activity fetched successfully', { feed });
});

export const getSpendingByCategory = asyncHandler(async (req, res) => {
  const spending = await activityService.getSpendingByCategory(req.user._id, req.params.id);
  successResponse(res, 200, 'Spending breakdown fetched successfully', { spending });
});


export const exportLedger = asyncHandler(async (req, res) => {
  await generateGroupLedgerPdf(req.user._id, req.params.id, res);
});

export const updateGroup = asyncHandler(async (req, res) => {
  const group = await groupService.updateGroupDetails(req.user._id, req.params.id, req.body);
  successResponse(res, 200, 'Group updated successfully', { group });
});