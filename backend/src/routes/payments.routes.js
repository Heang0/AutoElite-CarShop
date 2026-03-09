import { Router } from 'express';
import {
  createBakongPayment,
  confirmBakongPayment,
  getBakongPaymentStatus
} from '../controllers/payments.controller.js';

const router = Router();

router.post('/khqr', createBakongPayment);
router.post('/khqr/confirm', confirmBakongPayment);
router.get('/khqr/:paymentId', getBakongPaymentStatus);

export default router;
