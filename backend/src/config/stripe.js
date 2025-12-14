// Stripe Configuration
// Lưu ý: Trong production, nên lưu trong .env file
import Stripe from 'stripe';

// Initialize Stripe - check key at runtime, not at module load
let stripe = null;

// Function to get or initialize Stripe instance
const getStripe = () => {
  if (stripe) {
    return stripe;
  }
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey || secretKey.trim() === '') {
    console.warn('⚠️ STRIPE_SECRET_KEY not found or empty');
    return null;
  }
  
  try {
    stripe = new Stripe(secretKey.trim(), {
      apiVersion: '2024-12-18.acacia',
    });
    console.log('✅ Stripe instance initialized');
    return stripe;
  } catch (error) {
    console.error('❌ Failed to initialize Stripe:', error.message);
    return null;
  }
};

/**
 * Tạo Payment Intent với Stripe
 * @param {Object} orderData - Thông tin đơn hàng
 * @returns {Promise<Object>} Payment Intent
 */
export const createPaymentIntent = async (orderData) => {
  const stripeInstance = getStripe();
  if (!stripeInstance) {
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
    // Validate amount
    if (!amount || amount <= 0 || isNaN(amount)) {
      throw new Error(`Invalid amount: ${amount}. Amount must be a positive number.`);
    }

    // Stripe supports VND directly
    // Amount should be in smallest currency unit (for VND, it's the same as the amount)
    const amountInCents = Math.round(Number(amount));
    
    if (amountInCents <= 0) {
      throw new Error(`Invalid amount after rounding: ${amountInCents}. Amount must be greater than 0.`);
    }

    console.log('🔄 Calling Stripe API: paymentIntents.create()');
    console.log('   Amount:', amountInCents, 'VND');
    console.log('   Currency: vnd');
    console.log('   Order ID:', orderId);

    const paymentIntent = await stripeInstance.paymentIntents.create({
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

    console.log('✅ Stripe payment intent created:');
    console.log('   ID:', paymentIntent.id);
    console.log('   Status:', paymentIntent.status);
    console.log('   Amount:', paymentIntent.amount, paymentIntent.currency);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('❌ Stripe create payment intent error:');
    console.error('   Message:', error.message);
    console.error('   Type:', error.type);
    console.error('   Code:', error.code);
    console.error('   Status:', error.statusCode);
    console.error('   Raw error:', error);
    throw new Error('Không thể tạo payment intent: ' + error.message);
  }
};

/**
 * Xác nhận thanh toán Stripe
 * @param {string} paymentIntentId - Payment Intent ID
 * @returns {Promise<Object>} Payment Intent status
 */
export const confirmPayment = async (paymentIntentId) => {
  const stripeInstance = getStripe();
  if (!stripeInstance) {
    throw new Error('Stripe chưa được cấu hình');
  }

  try {
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    
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

export default getStripe;

