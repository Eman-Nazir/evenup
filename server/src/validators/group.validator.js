import { body } from 'express-validator';

export const createGroupValidator = [
  body('name').trim().notEmpty().withMessage('Group name is required')
    .isLength({ max: 100 }).withMessage('Group name cannot exceed 100 characters'),
  body('type').optional().isIn(['trip', 'home', 'couple', 'other']).withMessage('Invalid group type'),
  body('memberEmails').optional().isArray().withMessage('memberEmails must be an array'),
];

export const addMemberValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];