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

    // Kiểm tra Stripe đã được cấu hình chưa
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === '') {
      // Fallback to mock payment if Stripe not configured
      return res.json({
        useMock: true,
        message: 'Stripe chưa được cấu hình, sử dụng mock payment'
      });
    }

    // Tạo Payment Intent với Stripe
    const paymentIntent = await createPaymentIntent({
      orderId: order.id,
      amount: order.total_price,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      description: `Thanh toan don hang #${order.id}`
    });

    res.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    });
  } catch (error) {
    console.error('Create Stripe payment intent error:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo payment intent' });
  }
};

/**
 * Xác nhận thanh toán Stripe
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

    // Xác nhận payment với Stripe
    const paymentResult = await confirmPayment(paymentIntentId);

    if (paymentResult.status === 'succeeded') {
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
        paymentMethod: 'card',
        transactionId: paymentIntentId
      });

      res.json({ 
        success: true, 
        message: 'Thanh toán thành công',
        orderId: order.id
      });
    } else {
      res.status(400).json({ 
        error: 'Thanh toán chưa hoàn tất',
        status: paymentResult.status
      });
    }
  } catch (error) {
    console.error('Confirm Stripe payment error:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xác nhận thanh toán' });
  }
};

/**
 * Xử lý thanh toán bằng thẻ (Deprecated - use Stripe flow instead)
 * This endpoint is kept for backward compatibility but should not be used
 */
export const processCardPayment = async (req, res) => {
  try {
    const { orderId, cardData } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Validate cardData exists
    if (!cardData) {
      return res.status(400).json({ error: 'Card data is required' });
    }

    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    // Validate card data - check null before accessing properties
    if (!cardData.cardName || cardData.cardName.trim().length === 0) {
      return res.status(400).json({ error: 'Tên chủ thẻ không được để trống' });
    }

    // This endpoint should not be used - redirect to use Stripe
    return res.status(400).json({ 
      error: 'Vui lòng sử dụng Stripe payment flow thay vì endpoint này',
      useMock: false,
      shouldUseStripe: true
    });
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

