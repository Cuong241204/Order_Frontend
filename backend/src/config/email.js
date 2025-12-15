import nodemailer from 'nodemailer';

// Email Configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password' // App password, không phải mật khẩu thường
  }
};

// Tạo transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: EMAIL_CONFIG.secure,
  auth: EMAIL_CONFIG.auth
});

/**
 * Gửi email xác nhận đơn hàng
 * @param {Object} orderData - Thông tin đơn hàng
 * @returns {Promise}
 */
export const sendOrderConfirmation = async (orderData) => {
  try {
    const {
      customerEmail,
      customerName,
      orderId,
      items,
      totalPrice,
      tableNumber,
      paymentMethod,
      createdAt
    } = orderData;

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    };

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    const paymentMethodText = {
      'cash': 'Tiền mặt',
      'card': 'Thẻ tín dụng/Ghi nợ',
      'vnpay': 'VNPay',
      'momo': 'Ví MoMo',
      'zalo': 'ZaloPay'
    }[paymentMethod] || paymentMethod;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #667eea; color: white; padding: 10px; text-align: left; }
          .total { font-size: 1.2em; font-weight: bold; color: #667eea; text-align: right; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Đơn Hàng Của Bạn Đã Được Xác Nhận!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${customerName}</strong>,</p>
            <p>Cảm ơn bạn đã đặt hàng tại nhà hàng của chúng tôi!</p>
            
            <div class="order-info">
              <h2>Thông Tin Đơn Hàng</h2>
              <p><strong>Mã đơn hàng:</strong> #${orderId}</p>
              <p><strong>Số bàn:</strong> ${tableNumber || 'N/A'}</p>
              <p><strong>Phương thức thanh toán:</strong> ${paymentMethodText}</p>
              <p><strong>Thời gian đặt:</strong> ${new Date(createdAt).toLocaleString('vi-VN')}</p>
            </div>

            <h3>Chi Tiết Đơn Hàng</h3>
            <table>
              <thead>
                <tr>
                  <th>Món ăn</th>
                  <th style="text-align: center;">Số lượng</th>
                  <th style="text-align: right;">Đơn giá</th>
                  <th style="text-align: right;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total">
              <p>Tổng cộng: ${formatPrice(totalPrice)}</p>
            </div>

            <p style="margin-top: 30px;">
              Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ thông báo cho bạn khi đơn hàng sẵn sàng!
            </p>
          </div>
          <div class="footer">
            <p>© 2025 FoodOrder. Cảm ơn bạn đã sử dụng dịch vụ!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"FoodOrder" <${EMAIL_CONFIG.auth.user}>`,
      to: customerEmail,
      subject: `Xác nhận đơn hàng #${orderId} - FoodOrder`,
      html: htmlContent
    };

    // Chỉ gửi email nếu đã cấu hình
    if (EMAIL_CONFIG.auth.user !== 'your-email@gmail.com') {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      console.log('Email not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Gửi email thông báo thanh toán thành công
 */
export const sendPaymentConfirmation = async (orderData) => {
  try {
    const {
      customerEmail,
      customerName,
      orderId,
      totalPrice,
      paymentMethod,
      transactionId
    } = orderData;

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 60px; margin: 20px 0; }
          .amount { font-size: 1.5em; font-weight: bold; color: #48bb78; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Thanh Toán Thành Công!</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${customerName}</strong>,</p>
            <p>Đơn hàng #${orderId} của bạn đã được thanh toán thành công!</p>
            
            <div class="amount">
              <p>Số tiền: ${formatPrice(totalPrice)}</p>
            </div>

            <p><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
            ${transactionId ? `<p><strong>Mã giao dịch:</strong> ${transactionId}</p>` : ''}
            
            <p style="margin-top: 30px;">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"FoodOrder" <${EMAIL_CONFIG.auth.user}>`,
      to: customerEmail,
      subject: `Thanh toán thành công - Đơn hàng #${orderId}`,
      html: htmlContent
    };

    if (EMAIL_CONFIG.auth.user !== 'your-email@gmail.com') {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } else {
      console.log('Email not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;














