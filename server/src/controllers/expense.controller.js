import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as expenseService from '../services/expense.service.js';
import { suggestCategory } from '../services/ai.service.js';



export const createExpense = asyncHandler(async (req, res) => {
  const { expense, splits } = await expenseService.createExpense(req.user._id, req.body);
  successResponse(res, 201, 'Expense added successfully', { expense, splits });
});

export const getGroupExpenses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const result = await expenseService.getGroupExpenses(req.user._id, req.params.groupId, {
    page,
    limit,
  });
  successResponse(res, 200, 'Expenses fetched successfully', result);
});

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.user._id, req.params.id);
  successResponse(res, 200, 'Expense fetched successfully', { expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.user._id, req.params.id);
  successResponse(res, 200, 'Expense deleted successfully');
});


export const getCategorySuggestion = asyncHandler(async (req, res) => {
  const { description } = req.query;
  if (!description || description.trim().length < 3) {
    return successResponse(res, 200, 'Description too short', { category: 'other' });
  }
  const category = await suggestCategory(description);
  successResponse(res, 200, 'Category suggested', { category });
});


export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.user._id, req.params.id, req.body);
  successResponse(res, 200, 'Expense updated successfully', { expense });
});