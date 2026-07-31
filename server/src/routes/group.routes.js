import { Router } from 'express';
import * as groupController from '../controllers/group.controller.js';
import { createGroupValidator, addMemberValidator ,updateGroupValidator} from '../validators/group.validator.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/', createGroupValidator, validate, groupController.createGroup);
router.get('/', groupController.getMyGroups);
router.get('/:id', groupController.getGroup);
router.post('/:id/members', addMemberValidator, validate, groupController.addMember);
router.delete('/:id/members/:memberId', groupController.removeMember);
router.delete('/:id', groupController.deleteGroup);
router.get('/:id/balances', groupController.getGroupBalances);
router.get('/:id/simplified-debts', groupController.getSimplifiedDebts);
router.get('/:id/activity', groupController.getGroupActivity);
router.get('/:id/spending-by-category', groupController.getSpendingByCategory);
router.get('/:id/export-pdf', groupController.exportLedger);
router.patch('/:id', updateGroupValidator, validate, groupController.updateGroup);

export default router;