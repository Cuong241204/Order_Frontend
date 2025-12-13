import crypto from 'crypto';
import querystring from 'querystring';

// VNPay Configuration
// Lưu ý: Trong production, nên lưu trong .env file
const VNPAY_CONFIG = {
  tmnCode: process.env.VNPAY_TMN_CODE || 'YOUR_TMN_CODE', // Mã website của bạn trên VNPay
  secretKey: process.env.VNPAY_SECRET_KEY || 'YOUR_SECRET_KEY', // Secret key từ VNPay
  vnpUrl: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // Sandbox URL
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3001/api/payment/vnpay/callback', // URL trả về sau thanh toán (backend callback)
  apiUrl: process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
};

/**
 * Tạo URL thanh toán VNPay
 * @param {Object} orderData - Thông tin đơn hàng
 * @returns {string} Payment URL
 */
export const createPaymentUrl = (orderData) => {
  const {
    orderId,
    amount, // Số tiền (VND)
    orderDescription = 'Thanh toan don hang',
    orderType = 'other',
    locale = 'vn',
    ipAddr = '127.0.0.1'
  } = orderData;

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + '+07';
  const expireDate = new Date(date.getTime() + 15 * 60 * 1000) // 15 phút
    .toISOString().replace(/[-:]/g, '').split('.')[0] + '+07';

  const vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = VNPAY_CONFIG.tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId.toString();
  vnp_Params['vnp_OrderInfo'] = orderDescription;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu số tiền nhân 100
  vnp_Params['vnp_ReturnUrl'] = VNPAY_CONFIG.returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params['vnp_ExpireDate'] = expireDate;

  // Sắp xếp params theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // Tạo query string để ký (không encode) - VNPay yêu cầu format đặc biệt
  const signData = Object.keys(sortedParams)
    .sort()
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');
  
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  sortedParams['vnp_SecureHash'] = signed;

  // Tạo URL thanh toán - VNPay yêu cầu encode URL nhưng giữ nguyên format cho signature
  const queryString = Object.keys(sortedParams)
    .sort()
    .map(key => {
      // Encode giá trị nhưng giữ nguyên key
      const value = sortedParams[key];
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
  const paymentUrl = VNPAY_CONFIG.vnpUrl + '?' + queryString;
  
  return paymentUrl;
};

/**
 * Xác thực callback từ VNPay
 * @param {Object} vnp_Params - Params từ VNPay callback
 * @returns {Object} { isValid, orderId, amount, transactionId }
 */
export const verifyPayment = (vnp_Params) => {
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sắp xếp params
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // Tạo query string (không encode)
  const signData = Object.keys(sortedParams)
    .sort()
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');
  
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const isValid = secureHash === signed;
  const responseCode = vnp_Params['vnp_ResponseCode'];

  return {
    isValid,
    isSuccess: isValid && responseCode === '00',
    orderId: vnp_Params['vnp_TxnRef'],
    amount: parseInt(vnp_Params['vnp_Amount']) / 100, // Chia 100 để lấy số tiền thực
    transactionId: vnp_Params['vnp_TransactionNo'],
    responseCode,
    message: vnp_Params['vnp_OrderInfo']
  };
};

export default VNPAY_CONFIG;

