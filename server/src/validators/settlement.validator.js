import { body } from 'express-validator';

export const createSettlementValidator = [
  body('from').isMongoId().withMessage('Valid "from" user ID is required'),
  body('to').isMongoId().withMessage('Valid "to" user ID is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('method').optional().isIn(['cash', 'online']).withMessage('Invalid method'),
];