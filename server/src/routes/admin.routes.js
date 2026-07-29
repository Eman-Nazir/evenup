import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { updateRoleValidator } from '../validators/admin.validator.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = Router();

router.use(protect, requireAdmin); // every route below requires admin role

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', updateRoleValidator, validate, adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.get('/groups', adminController.getGroups);
router.delete('/groups/:id', adminController.deleteGroup);

export default router;