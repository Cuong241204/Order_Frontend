import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Smartphone, CheckCircle, ArrowLeft, Lock } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    phoneNumber: ''
  });

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

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      setFormData(prev => ({ ...prev, cardNumber: value }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, cardExpiry: value }));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
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
      if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCVC) {
        setError('Vui lòng điền đầy đủ thông tin thẻ');
        setLoading(false);
        return;
      }
      
      // Validate card number (should be 16 digits)
      const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
      if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
        setError('Số thẻ không hợp lệ (phải có 16 chữ số)');
        setLoading(false);
        return;
      }

      // Validate card name
      if (formData.cardName.trim().length < 2) {
        setError('Tên chủ thẻ phải có ít nhất 2 ký tự');
        setLoading(false);
        return;
      }

      // Validate expiry date (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        setError('Ngày hết hạn không hợp lệ (định dạng MM/YY)');
        setLoading(false);
        return;
      }

      // Validate expiry date is not in the past
      const [month, year] = formData.cardExpiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiryDate < now) {
        setError('Thẻ đã hết hạn');
        setLoading(false);
        return;
      }

      // Validate CVC (3 digits)
      if (!/^\d{3}$/.test(formData.cardCVC)) {
        setError('CVC không hợp lệ (phải có 3 chữ số)');
        setLoading(false);
        return;
      }
    } else if (paymentMethod === 'momo' || paymentMethod === 'zalo') {
      if (!formData.phoneNumber) {
        setError('Vui lòng nhập số điện thoại');
        setLoading(false);
        return;
      }
      
      if (!validatePhone(formData.phoneNumber)) {
        setError('Số điện thoại không hợp lệ (10-11 chữ số)');
        setLoading(false);
        return;
      }
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update order status
    if (orderData) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map(order => 
        order.id === orderData.id 
          ? { ...order, status: 'completed', paymentMethod, paidAt: new Date().toISOString() }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Clear cart after successful payment
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const cartKey = currentUser ? `cart_${currentUser.id}` : 'cart_guest';
      localStorage.removeItem(cartKey);
      localStorage.removeItem('lastOrder');
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/orders', { state: { paymentSuccess: true } });
    }, 2000);
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
                {/* Cash */}
                <label
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
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    style={{ margin: 0 }}
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

                {/* Credit Card */}
                <label
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
                    marginBottom: '1rem'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ margin: 0 }}
                  />
                  <CreditCard size={24} color={paymentMethod === 'card' ? '#667eea' : '#718096'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#2d3748', margin: 0 }}>
                      Thẻ tín dụng/Ghi nợ
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
                      Visa, Mastercard, JCB
                    </p>
                  </div>
                </label>

                {/* MoMo */}
                <label
                  onClick={() => setPaymentMethod('momo')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: `2px solid ${paymentMethod === 'momo' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'momo' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s',
                    marginBottom: '1rem'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    style={{ margin: 0 }}
                  />
                  <Smartphone size={24} color={paymentMethod === 'momo' ? '#667eea' : '#718096'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#2d3748', margin: 0 }}>
                      Ví MoMo
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
                      Thanh toán qua ứng dụng MoMo
                    </p>
                  </div>
                </label>

                {/* ZaloPay */}
                <label
                  onClick={() => setPaymentMethod('zalo')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: `2px solid ${paymentMethod === 'zalo' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'zalo' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="zalo"
                    checked={paymentMethod === 'zalo'}
                    onChange={() => setPaymentMethod('zalo')}
                    style={{ margin: 0 }}
                  />
                  <Smartphone size={24} color={paymentMethod === 'zalo' ? '#667eea' : '#718096'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#2d3748', margin: 0 }}>
                      ZaloPay
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
                      Thanh toán qua ứng dụng ZaloPay
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
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Số thẻ *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                        Ngày hết hạn *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleExpiryChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                        CVC *
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        required
                        placeholder="123"
                        maxLength={3}
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
                </div>
              )}

              {(paymentMethod === 'momo' || paymentMethod === 'zalo') && (
                <div style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>
                    Số điện thoại {paymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'} *
                  </h4>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="0901234567"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <p style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Bạn sẽ được chuyển đến ứng dụng {paymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'} để hoàn tất thanh toán
                  </p>
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

