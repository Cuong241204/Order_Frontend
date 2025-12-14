// Stripe Configuration
// IMPORTANT: Load dotenv first
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import Stripe from 'stripe';

// Only initialize Stripe if secret key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== '') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
}

/**
 * Tạo Payment Intent với Stripe
 * @param {Object} orderData - Thông tin đơn hàng
 * @returns {Promise<Object>} Payment Intent
 */
export const createPaymentIntent = async (orderData) => {
  if (!stripe) {
    throw new Error('Stripe chưa được cấu hình. Vui lòng thêm STRIPE_SECRET_KEY vào .env');
  }

  const {
    orderId,
    amount, // Số tiền (VND)
    customerEmail,
    customerName,
    description = 'Thanh toan don hang'
  } = orderData;

  try {
    // Stripe supports VND directly
    // Amount should be in smallest currency unit (for VND, it's the same as the amount)
    const amountInCents = Math.round(amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'vnd', // Stripe supports VND
      metadata: {
        orderId: orderId.toString(),
        customerName: customerName || 'Guest',
        customerEmail: customerEmail || ''
      },
      description: `${description} #${orderId}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe create payment intent error:', error);
    throw new Error('Không thể tạo payment intent: ' + error.message);
  }
};

/**
 * Xác nhận thanh toán Stripe
 * @param {string} paymentIntentId - Payment Intent ID
 * @returns {Promise<Object>} Payment Intent status
 */
export const confirmPayment = async (paymentIntentId) => {
  if (!stripe) {
    throw new Error('Stripe chưa được cấu hình');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    };
  } catch (error) {
    console.error('Stripe confirm payment error:', error);
    throw new Error('Không thể xác nhận thanh toán: ' + error.message);
  }
};

export default stripe;

