// Test Stripe Real Payment Flow
require('dotenv').config({ path: './backend/.env' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function testPaymentFlow() {
  console.log('🧪 TEST STRIPE REAL PAYMENT FLOW\n');
  
  try {
    // 1. Create Payment Intent
    console.log('1️⃣ Creating Payment Intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100000, // 100,000 VND
      currency: 'vnd',
      description: 'Test Payment Intent - Real Payment',
      metadata: {
        test: 'true',
        orderId: 'TEST_ORDER_123'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    console.log('✅ Payment Intent created:');
    console.log('   ID:', paymentIntent.id);
    console.log('   Status:', paymentIntent.status);
    console.log('   Amount:', paymentIntent.amount, paymentIntent.currency);
    console.log('   Client Secret:', paymentIntent.client_secret.substring(0, 30) + '...');
    console.log('');
    console.log('🔗 Check on Dashboard NOW:');
    console.log('   https://dashboard.stripe.com/test/payments');
    console.log('   Search for:', paymentIntent.id);
    console.log('   ⚠️ Status should be: requires_payment_method');
    console.log('');
    
    // 2. Simulate payment confirmation (in real app, this is done by frontend)
    console.log('2️⃣ Simulating payment confirmation...');
    console.log('   In real app, frontend calls: stripe.confirmCardPayment()');
    console.log('   This test will show you what happens after confirmation');
    console.log('');
    
    // Note: We can't actually confirm without a real card, but we can check the payment intent
    const retrieved = await stripe.paymentIntents.retrieve(paymentIntent.id);
    console.log('✅ Payment Intent retrieved:');
    console.log('   ID:', retrieved.id);
    console.log('   Status:', retrieved.status);
    console.log('   Created:', new Date(retrieved.created * 1000).toLocaleString());
    console.log('');
    
    console.log('📝 IMPORTANT NOTES:');
    console.log('   1. Payment Intent đã được tạo trên Stripe');
    console.log('   2. Bạn có thể tìm thấy nó trên Dashboard ngay bây giờ');
    console.log('   3. Status sẽ là: requires_payment_method');
    console.log('   4. Sau khi confirm payment (trong app), status sẽ là: succeeded');
    console.log('   5. Payment Intent sẽ xuất hiện trên Dashboard sau khi confirm');
    console.log('');
    
    // Cancel test payment intent
    try {
      await stripe.paymentIntents.cancel(paymentIntent.id);
      console.log('✅ Test payment intent cancelled');
    } catch (cancelError) {
      console.log('⚠️ Could not cancel (may already be confirmed):', cancelError.message);
    }
    
    console.log('');
    console.log('✅ TEST COMPLETED');
    console.log('');
    console.log('🔍 NEXT STEPS:');
    console.log('   1. Check Dashboard: https://dashboard.stripe.com/test/payments');
    console.log('   2. Make sure Test Mode is ON (toggle green)');
    console.log('   3. Search for Payment Intent ID:', paymentIntent.id);
    console.log('   4. In your app, when you confirm payment, it will appear as succeeded');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.type) {
      console.error('   Type:', error.type);
    }
    if (error.code) {
      console.error('   Code:', error.code);
    }
  }
}

testPaymentFlow();





