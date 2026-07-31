import { body } from 'express-validator';

const strongPassword = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number')
  .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character');

const emailNormalizeOptions = {
  gmail_remove_subaddress: false,
  gmail_remove_dots: false,
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(emailNormalizeOptions),
  strongPassword,
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(emailNormalizeOptions),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(emailNormalizeOptions),
];

export const resetPasswordValidator = [
  strongPassword,
];