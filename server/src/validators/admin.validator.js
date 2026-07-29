import { body } from 'express-validator';

export const updateRoleValidator = [
  body('role').isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"'),
];