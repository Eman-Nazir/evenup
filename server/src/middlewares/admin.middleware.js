import { restrictTo } from './auth.middleware.js';

// Thin, readable alias so admin routes are self-documenting
export const requireAdmin = restrictTo('admin');