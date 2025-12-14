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

  // Debug: Log Stripe initialization
  useEffect(() => {
    console.log('💳 Stripe initialized:', !!stripe);
    console.log('📝 Elements initialized:', !!elements);
    console.log('🔑 Publishable Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
  }, [stripe, elements]);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ location state hoặc localStorage
    const orderFromState = location.state?.order;
    if (orderFromState) {
      setOrderData(orderFromState);
    } else {
      // Nếu không có từ state, lấy từ localStorage (giả sử đã tạo order)
      const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
      if (lastOrder) {
        setOrderData(lastOrder);
      } else {
        // Nếu không có order, quay lại giỏ hàng
        navigate('/cart');
      }
    }
  }, [location, navigate]);

  // Load Stripe Payment Intent when order data is available
  useEffect(() => {
    const loadPaymentIntent = async () => {
      if (orderData && paymentMethod === 'card') {
        try {
          console.log('🔄 Loading Stripe Payment Intent for order:', orderData.id);
          setLoading(true);
          const intent = await paymentAPI.createStripePaymentIntent(orderData.id);
          
          console.log('✅ Payment Intent response:', intent);
          
          if (intent.useMock) {
            // Stripe not configured
            setError('Stripe chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
            setLoading(false);
            return;
          }
          
          if (intent.clientSecret) {
            setClientSecret(intent.clientSecret);
            setError('');
            console.log('✅ ClientSecret loaded successfully');
          } else {
            setError('Không thể tạo payment intent. Vui lòng thử lại.');
            console.error('❌ No clientSecret in response:', intent);
          }
          setLoading(false);
        } catch (error) {
          console.error('❌ Error loading payment intent:', error);
          setError('Stripe chưa được cấu hình hoặc có lỗi xảy ra. Vui lòng liên hệ quản trị viên.');
          setLoading(false);
        }
      }
    };
    loadPaymentIntent();
  }, [orderData, paymentMethod]);

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
      if (!stripe || !elements || !clientSecret) {
        setError('Stripe chưa được cấu hình. Không thể thanh toán.');
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
          // Stripe payment - MUST have Stripe configured
          if (!stripe || !elements || !clientSecret) {
            throw new Error('Stripe chưa được cấu hình. Không thể thanh toán.');
          }

          // Use Stripe Elements to confirm payment
          const cardElement = elements.getElement(CardElement);
          
          const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: formData.cardName,
              },
            },
          });

          if (stripeError) {
            throw new Error(stripeError.message || 'Thanh toán thất bại');
          }

          if (paymentIntent.status === 'succeeded') {
            // Confirm payment on backend
            const confirmResult = await paymentAPI.confirmStripePayment(orderData.id, paymentIntent.id);
            
            if (confirmResult && confirmResult.error) {
              throw new Error(confirmResult.error || 'Thanh toán thất bại');
            }
            if (confirmResult && confirmResult.success === false) {
              throw new Error(confirmResult.message || confirmResult.error || 'Thanh toán thất bại');
            }
          } else {
            throw new Error('Thanh toán chưa hoàn tất');
          }
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
                  {loading && !clientSecret ? (
                    <div style={{
                      padding: '1rem',
                      background: '#fff3cd',
                      borderRadius: '8px',
                      border: '1px solid #ffc107',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>
                        ⏳ Đang tải form thanh toán...
                      </p>
                    </div>
                  ) : !stripe || !elements ? (
                    <div style={{
                      padding: '1rem',
                      background: '#fee',
                      borderRadius: '8px',
                      border: '1px solid #fcc',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ color: '#c33', fontSize: '0.9rem', margin: 0 }}>
                        ⚠️ Stripe chưa được khởi tạo. Vui lòng refresh trang (Cmd+Shift+R).
                      </p>
                    </div>
                  ) : !clientSecret ? (
                    <div style={{
                      padding: '1rem',
                      background: '#fee',
                      borderRadius: '8px',
                      border: '1px solid #fcc',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ color: '#c33', fontSize: '0.9rem', margin: 0 }}>
                        ⚠️ Không thể tạo payment intent. Backend có thể chưa cấu hình Stripe.
                      </p>
                      <p style={{ color: '#c33', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
                        Vui lòng kiểm tra backend logs hoặc liên hệ quản trị viên.
                      </p>
                    </div>
                  ) : (
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
                      <p style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        💳 Test card: 4242 4242 4242 4242
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

