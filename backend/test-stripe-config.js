/**
 * Unit Test: Stripe Configuration & Payment Flow
 * Kiểm tra cấu hình Stripe và các API endpoints
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('========================================');
console.log('🧪 STRIPE CONFIGURATION TEST');
console.log('========================================\n');

// Test 1: Check .env file exists
console.log('Test 1: Kiểm tra file .env');
try {
  const fs = await import('fs');
  const envPath = path.join(__dirname, '.env');
  const exists = fs.existsSync(envPath);
  console.log(`  ✅ File .env ${exists ? 'TỒN TẠI' : '❌ KHÔNG TỒN TẠI'} tại: ${envPath}\n`);
} catch (error) {
  console.log(`  ❌ Lỗi khi check file: ${error.message}\n`);
}

// Test 2: Check environment variables loaded
console.log('Test 2: Kiểm tra environment variables');
const requiredEnvVars = {
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  'PORT': process.env.PORT,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'JWT_SECRET': process.env.JWT_SECRET
};

let allPassed = true;
for (const [key, value] of Object.entries(requiredEnvVars)) {
  const status = value ? '✅' : '❌';
  const displayValue = value 
    ? (key.includes('SECRET') || key.includes('KEY') 
      ? value.substring(0, 20) + '...' 
      : value)
    : 'NOT FOUND';
  console.log(`  ${status} ${key}: ${displayValue}`);
  if (!value) allPassed = false;
}
console.log('');

// Test 3: Validate Stripe key format
console.log('Test 3: Validate Stripe key format');
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (stripeKey) {
  const isTestKey = stripeKey.startsWith('sk_test_');
  const isLiveKey = stripeKey.startsWith('sk_live_');
  const isValid = isTestKey || isLiveKey;
  
  if (isValid) {
    console.log(`  ✅ Stripe key format ĐÚNG (${isTestKey ? 'TEST' : 'LIVE'} key)`);
  } else {
    console.log(`  ❌ Stripe key format SAI (phải bắt đầu với sk_test_ hoặc sk_live_)`);
    allPassed = false;
  }
} else {
  console.log(`  ❌ STRIPE_SECRET_KEY không tồn tại`);
  allPassed = false;
}
console.log('');

// Test 4: Try to initialize Stripe
console.log('Test 4: Khởi tạo Stripe client');
try {
  const Stripe = (await import('stripe')).default;
  if (stripeKey) {
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    });
    console.log('  ✅ Stripe client khởi tạo THÀNH CÔNG');
    console.log(`  ℹ️  API Version: 2024-12-18.acacia`);
  } else {
    console.log('  ❌ Không thể khởi tạo Stripe: thiếu STRIPE_SECRET_KEY');
    allPassed = false;
  }
} catch (error) {
  console.log(`  ❌ Lỗi khi khởi tạo Stripe: ${error.message}`);
  allPassed = false;
}
console.log('');

// Test 5: Test createPaymentIntent function
console.log('Test 5: Test createPaymentIntent function (mock)');
try {
  const { createPaymentIntent } = await import('./src/config/stripe.js');
  
  const testOrderData = {
    orderId: 999,
    amount: 100000, // 100,000 VND
    customerEmail: 'test@example.com',
    customerName: 'Test User',
    description: 'Test Order'
  };
  
  const result = await createPaymentIntent(testOrderData);
  
  if (result && result.clientSecret && result.paymentIntentId) {
    console.log('  ✅ createPaymentIntent hoạt động ĐÚNG');
    console.log(`  ℹ️  Payment Intent ID: ${result.paymentIntentId}`);
    console.log(`  ℹ️  Client Secret: ${result.clientSecret.substring(0, 30)}...`);
  } else {
    console.log('  ❌ createPaymentIntent trả về kết quả không đúng format');
    allPassed = false;
  }
} catch (error) {
  console.log(`  ❌ createPaymentIntent LỖI: ${error.message}`);
  allPassed = false;
}
console.log('');

// Test 6: Check server port
console.log('Test 6: Kiểm tra server configuration');
const port = process.env.PORT || 3001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
console.log(`  ℹ️  Backend Port: ${port}`);
console.log(`  ℹ️  Frontend URL: ${frontendUrl}`);
console.log('');

// Final summary
console.log('========================================');
if (allPassed) {
  console.log('✅ TẤT CẢ TESTS PASSED');
  console.log('✅ Stripe đã được cấu hình ĐÚNG');
  console.log('✅ Backend sẵn sàng xử lý thanh toán');
} else {
  console.log('❌ MỘT SỐ TESTS FAILED');
  console.log('⚠️  Vui lòng kiểm tra lại cấu hình');
  console.log('');
  console.log('Hướng dẫn fix:');
  console.log('1. Đảm bảo file backend/.env tồn tại');
  console.log('2. Thêm STRIPE_SECRET_KEY=sk_test_... vào .env');
  console.log('3. Restart backend: cd backend && npm run dev');
}
console.log('========================================');

process.exit(allPassed ? 0 : 1);
