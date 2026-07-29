import { Router } from 'express';
import * as settlementController from '../controllers/settlement.controller.js';
import { createSettlementValidator } from '../validators/settlement.validator.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(protect);

router.post('/group/:groupId', createSettlementValidator, validate, settlementController.createSettlement);
router.get('/group/:groupId', settlementController.getGroupSettlements);

export default router;