import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { paymentAPI } from '../services/api.js';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // Stripe as default
  const [orderData, setOrderData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [formData, setFormData] = useState({
    cardName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    // Lấy thông tin đơn hàng từ location state hoặc localStorage
    const orderFromState = location.state?.order;
    
    console.log('🔍 Loading order data in Payment page...');
    console.log('   Order from state:', orderFromState ? '✅ Có' : '❌ Không có');
    
    if (orderFromState) {
      console.log('✅ Using order from location state');
      console.log('   Order ID:', orderFromState.id);
      console.log('   Order total:', orderFromState.total);
      setOrderData(orderFromState);
    } else {
      // Nếu không có từ state, lấy từ localStorage
      const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
      console.log('   Order from localStorage:', lastOrder ? '✅ Có' : '❌ Không có');
      
      if (lastOrder) {
        console.log('✅ Using order from localStorage');
        console.log('   Order ID:', lastOrder.id);
        console.log('   Order total:', lastOrder.total);
        setOrderData(lastOrder);
      } else {
        console.warn('⚠️ No order data found, redirecting to cart');
        // Nếu không có order, quay lại giỏ hàng
        navigate('/cart');
      }
    }
  }, [location, navigate]);

  // Load Stripe Payment Intent when order data is available
  useEffect(() => {
    const loadPaymentIntent = async () => {
      if (orderData && paymentMethod === 'card') {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        
        console.log('🔍 Checking Stripe configuration...');
        console.log('   Publishable Key:', publishableKey ? '✅ Có' : '❌ Không có');
        console.log('   Stripe instance:', stripe ? '✅ Có' : '⏳ Đang load...');
        console.log('   Elements:', elements ? '✅ Có' : '⏳ Đang load...');
        
        if (!publishableKey) {
          console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY không tồn tại!');
          console.error('   Vui lòng thêm key vào frontend/.env và restart frontend');
          setError('Stripe chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
          return;
        }
        
        // Đợi Stripe và Elements load xong
        if (!stripe || !elements) {
          console.log('⏳ Đợi Stripe Elements load...');
          return;
        }
        
        try {
          console.log('🔄 Creating Stripe Payment Intent...');
          console.log('   Order ID:', orderData.id);
          console.log('   Amount:', orderData.total, 'VND');
          
          const intent = await paymentAPI.createStripePaymentIntent(orderData.id);
          
          if (intent.useMock) {
            console.error('❌ Backend trả về mock payment!');
            console.error('   Backend chưa có STRIPE_SECRET_KEY');
            setError('Stripe chưa được cấu hình trên server. Giao dịch sẽ không xuất hiện trên Dashboard.');
            return;
          }
          
          if (intent.clientSecret && intent.paymentIntentId) {
            console.log('✅✅✅ Stripe Payment Intent created! ✅✅✅');
            console.log('   Payment Intent ID:', intent.paymentIntentId);
            console.log('   ✅ Payment Intent đã được tạo trên Stripe');
            console.log('   🔗 Xem trên Dashboard: https://dashboard.stripe.com/test/payments');
            setClientSecret(intent.clientSecret);
          } else {
            console.error('❌ Không nhận được clientSecret từ backend');
            setError('Không thể tạo payment intent. Vui lòng thử lại.');
          }
        } catch (error) {
          console.error('❌ Failed to create Stripe Payment Intent:', error);
          setError('Không thể tạo payment intent: ' + (error.message || 'Unknown error'));
        }
      }
    };
    
    // Retry nếu Stripe chưa load xong
    const timer = setTimeout(() => {
      loadPaymentIntent();
    }, 500);
    
    loadPaymentIntent();
    
    return () => clearTimeout(timer);
  }, [orderData, paymentMethod, stripe, elements]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Card element options for Stripe
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderData) {
      setError('Không tìm thấy thông tin đơn hàng');
      return;
    }
    
    setLoading(true);
    setError('');

    // Validate based on payment method
    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        setError('Stripe chưa sẵn sàng. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Vui lòng nhập thông tin thẻ');
        setLoading(false);
        return;
      }

      // Validate card name
      if (!formData.cardName || formData.cardName.trim().length < 2) {
        setError('Tên chủ thẻ phải có ít nhất 2 ký tự');
        setLoading(false);
        return;
      }
    }

      // Process payment via API
      try {
        if (paymentMethod === 'card') {
          // Kiểm tra Stripe configuration
          const hasPublishableKey = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
          
          console.log('🔍 Payment Configuration Check:');
          console.log('   Publishable Key:', hasPublishableKey ? '✅ Có' : '❌ Không có');
          console.log('   Stripe instance:', stripe ? '✅ Có' : '❌ Không có');
          console.log('   Elements:', elements ? '✅ Có' : '❌ Không có');
          console.log('   Client Secret:', clientSecret ? '✅ Có' : '❌ Không có');
          
          // Nếu có publishable key nhưng stripe/elements không có, có thể chưa load xong
          if (hasPublishableKey && (!stripe || !elements)) {
            console.warn('⚠️ Stripe đang load, đợi thêm...');
            setError('Stripe đang khởi tạo, vui lòng đợi vài giây rồi thử lại');
            setLoading(false);
            return;
          }
          
          // Nếu không có publishable key, không thể dùng Stripe
          if (!hasPublishableKey) {
            throw new Error('Stripe chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
          }
          
          // Nếu không có clientSecret, không thể thanh toán
          if (!clientSecret) {
            throw new Error('Không thể tạo payment intent. Vui lòng thử lại.');
          }
          
          // Stripe payment - CHỈ dùng Stripe, KHÔNG fallback sang mock
          if (!stripe || !elements) {
            throw new Error('Stripe chưa sẵn sàng. Vui lòng refresh trang và thử lại.');
          }
          
          // Use Stripe Elements to confirm payment - CHỈ DÙNG STRIPE, KHÔNG MOCK
          console.log('✅ Using REAL Stripe payment (NO MOCK)');
          console.log('   Stripe instance:', !!stripe);
          console.log('   Elements:', !!elements);
          console.log('   Client Secret:', clientSecret.substring(0, 30) + '...');
          
          const cardElement = elements.getElement(CardElement);
          if (!cardElement) {
            throw new Error('Không tìm thấy card element. Vui lòng nhập thông tin thẻ.');
          }
          
          console.log('🔄 Confirming payment with Stripe API...');
          console.log('   Order ID:', orderData.id);
          console.log('   Amount:', orderData.total, 'VND');
          console.log('   Client Secret:', clientSecret.substring(0, 30) + '...');
          
          // Confirm payment với Stripe API - ĐÂY LÀ BƯỚC QUAN TRỌNG
          console.log('🔄 Calling Stripe API: stripe.confirmCardPayment()...');
          console.log('   This will send payment to Stripe and confirm it');
          
          const confirmResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: formData.cardName,
              },
            },
          });

          console.log('📦 Stripe confirmCardPayment response received:');
          console.log('   hasError:', !!confirmResult.error);
          console.log('   hasPaymentIntent:', !!confirmResult.paymentIntent);
          
          if (confirmResult.error) {
            console.error('❌ Stripe payment error:', confirmResult.error);
            console.error('   Error type:', confirmResult.error.type);
            console.error('   Error code:', confirmResult.error.code);
            console.error('   Error message:', confirmResult.error.message);
            console.error('   ⚠️ Payment KHÔNG được gửi đến Stripe');
            throw new Error(confirmResult.error.message || 'Thanh toán thất bại');
          }

          const paymentIntent = confirmResult.paymentIntent;
          if (!paymentIntent) {
            console.error('❌ Không nhận được paymentIntent từ Stripe');
            console.error('   Response:', confirmResult);
            console.error('   ⚠️ Payment KHÔNG được gửi đến Stripe');
            throw new Error('Không nhận được payment intent từ Stripe');
          }
          
          console.log('✅ Payment Intent received from Stripe:');
          console.log('   ID:', paymentIntent.id);
          console.log('   Status:', paymentIntent.status);
          console.log('   Amount:', paymentIntent.amount, paymentIntent.currency);
          console.log('   ✅ Payment đã được gửi đến Stripe API');
          console.log('   ✅ Payment Intent này đã xuất hiện trên Stripe Dashboard');

          // Payment đã được confirm thành công với Stripe
          console.log('');
          console.log('═══════════════════════════════════════════════════════');
          console.log('✅✅✅ THANH TOÁN THÀNH CÔNG VỚI STRIPE! ✅✅✅');
          console.log('═══════════════════════════════════════════════════════');
          console.log('   Payment Intent ID:', paymentIntent.id);
          console.log('   Status:', paymentIntent.status);
          console.log('   Amount:', paymentIntent.amount, paymentIntent.currency);
          console.log('   Created:', new Date(paymentIntent.created * 1000).toLocaleString('vi-VN'));
          console.log('');
          console.log('🔗 XEM TRÊN STRIPE DASHBOARD:');
          console.log('   1. Vào: https://dashboard.stripe.com/test/payments');
          console.log('   2. Đảm bảo Test Mode ON (toggle màu xanh ở góc trên bên phải)');
          console.log('   3. Paste Payment Intent ID vào search box:', paymentIntent.id);
          console.log('   4. Hoặc xem danh sách Payments gần đây');
          console.log('');
          console.log('⚠️ QUAN TRỌNG:');
          console.log('   - Phải đảm bảo Test Mode ON (không phải Live Mode)');
          console.log('   - Payment Intent này đã được confirm và sẽ xuất hiện trên Dashboard');
          console.log('   - Nếu không thấy, kiểm tra lại Test Mode toggle');
          console.log('═══════════════════════════════════════════════════════');
          console.log('');

          // Kiểm tra status
          if (paymentIntent.status !== 'succeeded') {
            console.warn('⚠️ Payment Intent status không phải succeeded:', paymentIntent.status);
            console.warn('   Payment Intent ID:', paymentIntent.id);
            console.warn('   Payment Intent vẫn có thể được tìm thấy trên Dashboard');
            throw new Error(`Thanh toán chưa hoàn tất. Status: ${paymentIntent.status}`);
          }
          
          // Payment Intent đã được confirm thành công
          console.log('✅ Payment Intent đã được confirm thành công trên Stripe');
          console.log('   ✅ Payment Intent này đã xuất hiện trên Stripe Dashboard');
          console.log('   🔗 Dashboard link: https://dashboard.stripe.com/test/payments');
          console.log('   🔍 Search for Payment Intent ID:', paymentIntent.id);
          console.log('');

          // Update order status on backend
          console.log('🔄 Updating order status on backend...');
          console.log('   Order ID:', orderData.id);
          console.log('   Payment Intent ID:', paymentIntent.id);
          
          // Update order status on backend - QUAN TRỌNG: Phải đợi update xong
          try {
            console.log('🔄 Calling backend to confirm payment and update order status...');
            const confirmResult = await paymentAPI.confirmStripePayment(orderData.id, paymentIntent.id);
            
            if (confirmResult && confirmResult.error) {
              console.error('❌ Backend error:', confirmResult.error);
              throw new Error(`Backend update failed: ${confirmResult.error}`);
            } else if (confirmResult && confirmResult.success === false) {
              console.error('❌ Backend update failed:', confirmResult.message);
              throw new Error(`Backend update failed: ${confirmResult.message}`);
            } else if (confirmResult && confirmResult.success === true) {
              console.log('✅ Order status updated to COMPLETED on backend');
              console.log('   Order ID:', confirmResult?.orderId || orderData.id);
              console.log('   Status: completed');
            } else {
              // Nếu không có success flag, vẫn coi như thành công nếu không có error
              console.log('✅ Backend confirmed payment');
            }
          } catch (backendError) {
            console.error('❌ Backend update error:', backendError.message);
            // Retry once
            try {
              console.log('🔄 Retrying backend update...');
              const retryResult = await paymentAPI.confirmStripePayment(orderData.id, paymentIntent.id);
              if (retryResult && retryResult.success === true) {
                console.log('✅ Order status updated on retry');
              } else {
                throw backendError; // Re-throw nếu retry cũng fail
              }
            } catch (retryError) {
              console.error('❌ Backend update failed after retry:', retryError.message);
              // Vẫn tiếp tục vì payment đã thành công trên Stripe
              // Nhưng log error để admin biết
              console.warn('⚠️ Payment succeeded on Stripe but order status may not be updated');
              console.warn('   Order ID:', orderData.id);
              console.warn('   Payment Intent ID:', paymentIntent.id);
            }
          }

          console.log('');
          console.log('═══════════════════════════════════════════════════════');
          console.log('✅✅✅ GIAO DỊCH ĐÃ XUẤT HIỆN TRÊN STRIPE DASHBOARD! ✅✅✅');
          console.log('═══════════════════════════════════════════════════════');
          console.log('   Payment Intent ID:', paymentIntent.id);
          console.log('   Status:', paymentIntent.status);
          console.log('   Amount:', paymentIntent.amount, paymentIntent.currency);
          console.log('');
          console.log('🔗 XEM TRÊN DASHBOARD:');
          console.log('   1. Vào: https://dashboard.stripe.com/test/payments');
          console.log('   2. Đảm bảo Test Mode ON (toggle màu xanh)');
          console.log('   3. Search Payment Intent ID:', paymentIntent.id);
          console.log('   4. Hoặc xem danh sách Payments gần đây');
          console.log('');
          console.log('⚠️ NẾU KHÔNG THẤY:');
          console.log('   - Kiểm tra Test Mode có ON không (toggle màu xanh)');
          console.log('   - Copy Payment Intent ID:', paymentIntent.id);
          console.log('   - Paste vào search box trên Dashboard');
          console.log('   - Payment Intent này đã được confirm và PHẢI xuất hiện');
          console.log('═══════════════════════════════════════════════════════');
          console.log('');
        } else if (paymentMethod === 'cash') {
          // Cash payment - update order status to pending (will be confirmed later)
          // Order is already created with 'pending' status
          // For cash, we can mark it as confirmed immediately or wait for confirmation
          // For now, we'll just mark it as confirmed
          try {
            const { ordersAPI } = await import('../services/api.js');
            await ordersAPI.updateStatus(orderData.id, 'confirmed');
          } catch (updateError) {
            console.warn('Could not update order status for cash payment:', updateError);
            // Continue anyway
          }
        }

        // Clear cart after successful payment
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        const cartKey = currentUser ? `cart_${currentUser.id}` : 'cart_guest';
        localStorage.removeItem(cartKey);
        localStorage.removeItem('lastOrder');

        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          navigate('/payment/success', { state: { orderId: orderData.id } });
        }, 2000);
      } catch (error) {
        console.error('Payment error:', error);
        setError(error.message || 'Đã xảy ra lỗi khi xử lý thanh toán');
        setLoading(false);
      }
  };

  if (!orderData) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 10px 30px rgba(72, 187, 120, 0.4)'
            }}>
              <CheckCircle size={40} color="white" />
            </div>
            <h2 style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
              fontSize: '2rem'
            }}>
              Thanh Toán Thành Công!
            </h2>
            <p style={{ color: '#718096', marginBottom: '2rem' }}>
              Đơn hàng của bạn đã được thanh toán thành công. Cảm ơn bạn đã sử dụng dịch vụ!
            </p>
            <p style={{ color: '#4a5568', fontWeight: '600' }}>
              Đang chuyển đến trang đơn hàng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#667eea',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fcfff0ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowLeft size={20} color="#d266eaff" />
            Quay lại giỏ hàng
          </button>
          <h2 style={{
            background: 'linear-gradient(135deg, #ea66dfff 0%, #4ba278ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            flex: 1,
            textAlign: 'center',
            fontSize: '2rem'
          }}>
            Thanh Toán
          </h2>
          <div style={{ width: '100px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Order Summary */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
              Tóm Tắt Đơn Hàng
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {orderData.items?.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>
                      {item.name}
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem' }}>
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '2px solid #667eea'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#667eea',
                marginTop: '1rem'
              }}>
                <span>Tổng cộng:</span>
                <span>{formatPrice(orderData.total || 0)}</span>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f0f4ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Lock size={20} color="#667eea" />
              <p style={{ color: '#4a5568', fontSize: '0.9rem', margin: 0 }}>
                Thông tin thanh toán được bảo mật
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
              Chọn Phương Thức Thanh Toán
            </h3>

            {error && (
              <div style={{
                background: '#fee',
                color: '#c33',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Payment Method Options */}
              <div style={{ marginBottom: '2rem' }}>
                {/* Stripe - Phương thức thanh toán chính */}
                <label
                  htmlFor="payment-card"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: `2px solid ${paymentMethod === 'card' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'card' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s',
                    marginBottom: '1rem',
                    position: 'relative'
                  }}
                >
                  <input
                    id="payment-card"
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ margin: 0, width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <CreditCard size={24} color={paymentMethod === 'card' ? '#667eea' : '#718096'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#2d3748', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Stripe (Thẻ tín dụng/Ghi nợ)
                      <span style={{
                        background: '#48bb78',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>Khuyến nghị</span>
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
                      Visa, Mastercard, JCB, American Express
                    </p>
                  </div>
                </label>

                {/* Cash */}
                <label
                  htmlFor="payment-cash"
                  onClick={() => setPaymentMethod('cash')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: `2px solid ${paymentMethod === 'cash' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'cash' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s',
                    marginBottom: '1rem'
                  }}
                >
                  <input
                    id="payment-cash"
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    style={{ margin: 0, width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <Wallet size={24} color={paymentMethod === 'cash' ? '#667eea' : '#718096'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#2d3748', margin: 0 }}>
                      Tiền mặt
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
                      Thanh toán khi nhận hàng
                    </p>
                  </div>
                </label>

              </div>

              {/* Payment Form based on method */}
              {paymentMethod === 'card' && (
                <div style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Thông Tin Thẻ</h4>
                  
                  {/* Stripe Card Element */}
                  {stripe && elements ? (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                        Thông tin thẻ *
                      </label>
                      <div style={{
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        background: 'white'
                      }}>
                        <CardElement options={cardElementOptions} />
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '1rem',
                      background: '#fff3cd',
                      borderRadius: '8px',
                      border: '1px solid #ffc107',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>
                        ℹ️ Stripe chưa được cấu hình. Hệ thống sẽ sử dụng mock payment (luôn thành công) cho mục đích testing.
                      </p>
                    </div>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Tên chủ thẻ *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      placeholder="NGUYEN VAN A"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>
                    Thanh Toán Bằng Stripe
                  </h4>
                  <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Thanh toán an toàn và bảo mật với Stripe. Hỗ trợ tất cả các loại thẻ tín dụng và ghi nợ.
                  </p>
                  <div style={{
                    padding: '1rem',
                    background: '#e6fffa',
                    borderRadius: '8px',
                    border: '1px solid #9ae6b4'
                  }}>
                    <p style={{ color: '#2d3748', fontSize: '0.9rem', margin: 0 }}>
                      <strong>Hỗ trợ:</strong> Visa, Mastercard, JCB, American Express
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                {loading ? 'Đang xử lý thanh toán...' : `Thanh Toán ${formatPrice(orderData.total || 0)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

