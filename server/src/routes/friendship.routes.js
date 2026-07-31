import { Router } from 'express';
import * as friendshipController from '../controllers/friendship.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/request', friendshipController.sendRequest);
router.patch('/request/:id', friendshipController.respondToRequest);
router.get('/', friendshipController.getFriends);
router.get('/pending', friendshipController.getPending);
router.delete('/:id', friendshipController.deleteFriend);

export default router;