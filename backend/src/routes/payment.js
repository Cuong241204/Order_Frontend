import express from 'express';
import { 
  createVNPayUrl, 
  handleVNPayCallback, 
  createStripePaymentIntent,
  confirmStripePayment,
  processCardPayment,
  processEWalletPayment 
} from '../controllers/paymentController.js';

const router = express.Router();

// VNPay routes
router.post('/vnpay/create', createVNPayUrl);
router.get('/vnpay/callback', handleVNPayCallback);

// Stripe routes
router.post('/stripe/create-intent', createStripePaymentIntent);
router.post('/stripe/confirm', confirmStripePayment);

// Card payment (Mock fallback)
router.post('/card', processCardPayment);

// E-wallet payment (MoMo, ZaloPay)
router.post('/ewallet', processEWalletPayment);

export default router;

