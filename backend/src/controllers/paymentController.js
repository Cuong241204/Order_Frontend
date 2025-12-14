import db from '../config/database.js';
import { createPaymentUrl, verifyPayment } from '../config/vnpay.js';
import { createPaymentIntent, confirmPayment } from '../config/stripe.js';
import { sendOrderConfirmation, sendPaymentConfirmation } from '../config/email.js';

/**
 * Tạo URL thanh toán VNPay
 */
export const createVNPayUrl = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Lấy thông tin đơn hàng
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    // Lấy IP thực từ request
    const ipAddr = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   '127.0.0.1';

    // Tạo URL thanh toán
    const paymentUrl = createPaymentUrl({
      orderId: order.id,
      amount: order.total_price,
      orderDescription: `Thanh toan don hang #${order.id}`,
      ipAddr: ipAddr
    });

    res.json({ paymentUrl, orderId: order.id });
  } catch (error) {
    console.error('Create VNPay URL error:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo URL thanh toán' });
  }
};

/**
 * Xử lý callback từ VNPay
 */
export const handleVNPayCallback = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const paymentResult = verifyPayment(vnp_Params);

    if (!paymentResult.isValid) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?reason=invalid_signature`);
    }

    const orderId = parseInt(paymentResult.orderId);
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);

    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?reason=order_not_found`);
    }

    if (paymentResult.isSuccess) {
      // Cập nhật trạng thái đơn hàng thành completed khi thanh toán thành công
      await db.run(
        'UPDATE orders SET status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['completed', 'vnpay', orderId]
      );

      // Gửi email xác nhận thanh toán
      const orderItems = JSON.parse(order.items);
      await sendPaymentConfirmation({
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        orderId: order.id,
        totalPrice: order.total_price,
        paymentMethod: 'vnpay',
        transactionId: paymentResult.transactionId
      });

      // Clear cart after successful payment
      // Note: Cart clearing should be done in frontend after redirect
      
      // Redirect đến trang thành công
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?orderId=${orderId}&transactionId=${paymentResult.transactionId}`);
    } else {
      // Thanh toán thất bại
      const reasonCode = paymentResult.responseCode || 'unknown';
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?orderId=${orderId}&reason=${reasonCode}`);
    }
  } catch (error) {
    console.error('VNPay callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?reason=server_error`);
  }
};

/**
 * Tạo Stripe Payment Intent
 */
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log('🔄 createStripePaymentIntent called');
    console.log('   Request body:', req.body);
    console.log('   Order ID:', orderId);

    if (!orderId) {
      console.error('❌ Order ID is missing');
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Kiểm tra Stripe đã được cấu hình chưa
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === '') {
      console.warn('⚠️ STRIPE_SECRET_KEY not configured, returning mock payment');
      return res.json({
        useMock: true,
        message: 'Stripe chưa được cấu hình, sử dụng mock payment'
      });
    }

    console.log('✅ Stripe secret key exists');

    // Lấy thông tin đơn hàng
    let order;
    try {
      order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return res.status(500).json({ 
        error: 'Lỗi khi truy vấn database',
        details: dbError.message 
      });
    }
    
    if (!order) {
      console.error('❌ Order not found:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('✅ Order found:', {
      id: order.id,
      status: order.status,
      total_price: order.total_price,
      customer_name: order.customer_name
    });

    if (order.status !== 'pending') {
      console.warn('⚠️ Order status is not pending:', order.status);
      return res.status(400).json({ 
        error: 'Order is not pending',
        currentStatus: order.status
      });
    }

    // Kiểm tra total_price
    if (!order.total_price || order.total_price <= 0) {
      console.error('❌ Invalid total_price:', order.total_price);
      return res.status(400).json({ 
        error: 'Order total price is invalid',
        total_price: order.total_price
      });
    }

    console.log('✅ Creating Stripe Payment Intent for order:', order.id);
    console.log('   Amount:', order.total_price, 'VND');
    console.log('   Customer:', order.customer_name || 'Guest');
    
    // Tạo Payment Intent với Stripe
    let paymentIntent;
    try {
      paymentIntent = await createPaymentIntent({
        orderId: order.id,
        amount: order.total_price,
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        description: `Thanh toan don hang #${order.id}`
      });
    } catch (stripeError) {
      console.error('❌ Stripe API error:', stripeError);
      console.error('   Error message:', stripeError.message);
      console.error('   Error type:', stripeError.type);
      console.error('   Error code:', stripeError.code);
      return res.status(500).json({ 
        error: 'Lỗi khi tạo payment intent với Stripe',
        details: stripeError.message,
        stripeErrorType: stripeError.type,
        stripeErrorCode: stripeError.code
      });
    }

    console.log('✅ Stripe Payment Intent created successfully!');
    console.log('   Payment Intent ID:', paymentIntent.paymentIntentId);
    console.log('   Client Secret:', paymentIntent.clientSecret.substring(0, 20) + '...');
    console.log('🔗 Xem trên Dashboard: https://dashboard.stripe.com/test/payments');
    console.log('   Tìm Payment Intent ID:', paymentIntent.paymentIntentId);
    
    res.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    });
  } catch (error) {
    console.error('❌ Create Stripe payment intent error:', error);
    console.error('   Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi tạo payment intent',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Xác nhận thanh toán Stripe (Payment đã được confirm trên frontend, chỉ cần update order)
 */
export const confirmStripePayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId) {
      return res.status(400).json({ error: 'Order ID and Payment Intent ID are required' });
    }

    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('✅ Verifying Stripe payment on backend...');
    console.log('   Payment Intent ID:', paymentIntentId);
    console.log('   Order ID:', orderId);
    
    // Verify payment với Stripe để đảm bảo payment đã succeeded
    let paymentResult;
    try {
      paymentResult = await confirmPayment(paymentIntentId);
      console.log('✅ Payment verified from Stripe:');
      console.log('   Status:', paymentResult.status);
      console.log('   Amount:', paymentResult.amount, paymentResult.currency);
      console.log('   Payment Intent ID:', paymentResult.paymentIntentId);
    } catch (stripeError) {
      console.error('❌ Error verifying payment with Stripe:', stripeError.message);
      return res.status(500).json({ 
        error: 'Không thể xác minh thanh toán với Stripe',
        details: stripeError.message
      });
    }

    // Chỉ update order nếu payment đã succeeded
    if (paymentResult.status === 'succeeded') {
      console.log('✅ Payment succeeded! Updating order status to COMPLETED...');
      
      // Cập nhật trạng thái đơn hàng thành completed
      const updateResult = await db.run(
        'UPDATE orders SET status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['completed', 'card', orderId]
      );

      // Verify update
      const updatedOrder = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
      if (updatedOrder && updatedOrder.status === 'completed') {
        console.log('✅ Order status updated to COMPLETED successfully');
        console.log('   Order ID:', updatedOrder.id);
        console.log('   Status:', updatedOrder.status);
        console.log('   Payment Method:', updatedOrder.payment_method);
      } else {
        console.error('❌ Order status update failed!');
        console.error('   Expected: completed');
        console.error('   Actual:', updatedOrder?.status);
        throw new Error('Failed to update order status to completed');
      }

      // Gửi email xác nhận (optional, không block nếu fail)
      try {
        await sendPaymentConfirmation({
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderId: order.id,
          totalPrice: order.total_price,
          paymentMethod: 'card',
          transactionId: paymentIntentId
        });
        console.log('✅ Confirmation email sent');
      } catch (emailError) {
        console.warn('⚠️ Failed to send confirmation email:', emailError.message);
        // Không throw error vì email chỉ là optional
      }

      res.json({ 
        success: true, 
        message: 'Thanh toán thành công',
        orderId: order.id,
        paymentIntentId: paymentIntentId,
        amount: paymentResult.amount,
        currency: paymentResult.currency
      });
    } else {
      console.warn('⚠️ Payment status is not succeeded:', paymentResult.status);
      res.status(400).json({ 
        error: 'Thanh toán chưa hoàn tất',
        status: paymentResult.status,
        paymentIntentId: paymentIntentId
      });
    }
  } catch (error) {
    console.error('❌ Confirm Stripe payment error:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi xác nhận thanh toán',
      details: error.message
    });
  }
};

/**
 * Xử lý thanh toán bằng thẻ (Mock fallback nếu Stripe chưa cấu hình)
 */
export const processCardPayment = async (req, res) => {
  try {
    const { orderId, cardData } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    // Mock payment - chỉ dùng khi Stripe chưa được cấu hình
    // Validate card data
    if (!cardData || !cardData.cardNumber || !cardData.cardName) {
      return res.status(400).json({ error: 'Thông tin thẻ không đầy đủ' });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock: luôn thành công (trong production nên dùng Stripe)
    const paymentSuccess = true;

    if (paymentSuccess) {
      // Cập nhật trạng thái đơn hàng thành completed khi thanh toán thành công
      await db.run(
        'UPDATE orders SET status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['completed', 'card', orderId]
      );

      // Gửi email xác nhận
      await sendPaymentConfirmation({
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        orderId: order.id,
        totalPrice: order.total_price,
        paymentMethod: 'card'
      });

      res.json({ 
        success: true, 
        message: 'Thanh toán thành công (Mock)',
        orderId: order.id,
        mock: true
      });
    } else {
      res.status(400).json({ error: 'Thanh toán thất bại' });
    }
  } catch (error) {
    console.error('Process card payment error:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý thanh toán' });
  }
};

/**
 * Xử lý thanh toán MoMo/ZaloPay (mock - cần tích hợp API thực tế)
 */
export const processEWalletPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber, walletType } = req.body;

    if (!orderId || !phoneNumber) {
      return res.status(400).json({ error: 'Order ID and phone number are required' });
    }

    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // TODO: Tích hợp MoMo/ZaloPay API thực tế
    // Hiện tại chỉ mock
    const paymentSuccess = true;

    if (paymentSuccess) {
      await db.run(
        'UPDATE orders SET status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['completed', walletType, orderId]
      );

      await sendPaymentConfirmation({
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        orderId: order.id,
        totalPrice: order.total_price,
        paymentMethod: walletType
      });

      res.json({ 
        success: true, 
        message: 'Thanh toán thành công',
        orderId: order.id
      });
    } else {
      res.status(400).json({ error: 'Thanh toán thất bại' });
    }
  } catch (error) {
    console.error('Process e-wallet payment error:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý thanh toán' });
  }
};

