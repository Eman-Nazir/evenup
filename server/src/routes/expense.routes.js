import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { createExpenseValidator, updateExpenseValidator } from '../validators/expense.validator.js';

const router = Router();

router.use(protect);

router.post('/', createExpenseValidator, validate, expenseController.createExpense);
router.get('/suggest-category', expenseController.getCategorySuggestion);
router.get('/group/:groupId', expenseController.getGroupExpenses);
router.get('/:id', expenseController.getExpense);
router.patch('/:id', updateExpenseValidator, validate, expenseController.updateExpense); // ← use updateExpenseValidator, not createExpenseValidator
router.delete('/:id', expenseController.deleteExpense);

export default router;