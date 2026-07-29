import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as settlementService from '../services/settlement.service.js';

export const createSettlement = asyncHandler(async (req, res) => {
  const settlement = await settlementService.recordSettlement(
    req.user._id,
    req.params.groupId,
    req.body
  );
  successResponse(res, 201, 'Settlement recorded successfully', { settlement });
});

export const getGroupSettlements = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const result = await settlementService.getGroupSettlements(req.user._id, req.params.groupId, {
    page, limit,
  });
  successResponse(res, 200, 'Settlements fetched successfully', result);
});