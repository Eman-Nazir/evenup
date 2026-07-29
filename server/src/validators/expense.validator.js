import { body } from 'express-validator';

export const createExpenseValidator = [
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('group').isMongoId().withMessage('Valid group ID is required'),
  body('category')
    .optional()
    .isIn(['food', 'rent', 'transport', 'entertainment', 'utilities', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('splitType')
    .optional()
    .isIn(['equal', 'exact', 'percentage', 'shares'])
    .withMessage('Invalid split type'),
  body('paidBy').optional().isArray().withMessage('paidBy must be an array'),
  body('splitDetails').optional().isArray().withMessage('splitDetails must be an array'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
body('recurrence.frequency')
  .if(body('isRecurring').equals('true'))
  .isIn(['daily', 'weekly', 'monthly'])
  .withMessage('Valid frequency is required for recurring expenses'),
];


export const updateExpenseValidator = [
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category')
    .optional()
    .isIn(['food', 'rent', 'transport', 'entertainment', 'utilities', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('splitType')
    .optional()
    .isIn(['equal', 'exact', 'percentage', 'shares'])
    .withMessage('Invalid split type'),
  body('splitDetails').optional().isArray().withMessage('splitDetails must be an array'),
];