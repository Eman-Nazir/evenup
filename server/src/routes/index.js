import { Router } from 'express';
import authRoutes from './auth.routes.js';
import friendshipRoutes from './friendship.routes.js';
import groupRoutes from './group.routes.js';
import expenseRoutes from './expense.routes.js';
import settlementRoutes from './settlement.routes.js';
import adminRoutes from './admin.routes.js';
import userRoutes from './user.routes.js';





const router = Router();
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/friendships', friendshipRoutes);
router.use('/groups', groupRoutes);
router.use('/expenses', expenseRoutes);
router.use('/settlements', settlementRoutes);
router.use('/admin', adminRoutes);
router.use('/friendships', friendshipRoutes);



export default router;