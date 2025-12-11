import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTable } from '../contexts/TableContext';
import { CreditCard, Phone, User, Mail, Users } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { currentTable } = useTable();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    tableNumber: currentTable?.number || '',
    numberOfGuests: '1',
    paymentMethod: 'cash', // cash = tại nhà hàng
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: ''
  });

  useEffect(() => {
    // Update table number when currentTable changes
    if (currentTable) {
      setFormData(prev => ({
        ...prev,
        tableNumber: currentTable.number
      }));
    }
  }, [currentTable]);

  useEffect(() => {
    // Load cart from localStorage - support both logged in and guest users
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) {
      const items = JSON.parse(storedCart);
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(items);
    } else {
      navigate('/cart');
    }
  }, [user, navigate]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate form
    if (!formData.fullName || !formData.fullName.trim()) {
      setMessage('Vui lòng nhập họ và tên');
      setLoading(false);
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setMessage('Họ và tên phải có ít nhất 2 ký tự');
      setLoading(false);
      return;
    }

    if (formData.fullName.trim().length > 50) {
      setMessage('Họ và tên không được vượt quá 50 ký tự');
      setLoading(false);
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      setMessage('Email không hợp lệ');
      setLoading(false);
      return;
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
      setMessage('Số điện thoại không hợp lệ (10-11 chữ số)');
      setLoading(false);
      return;
    }

    if (!formData.tableNumber || !formData.tableNumber.trim()) {
      setMessage('Vui lòng nhập số bàn');
      setLoading(false);
      return;
    }

    if (formData.tableNumber.trim().length > 20) {
      setMessage('Số bàn không được vượt quá 20 ký tự');
      setLoading(false);
      return;
    }

    // Validate number of guests
    const numGuests = parseInt(formData.numberOfGuests);
    if (isNaN(numGuests) || numGuests < 1 || numGuests > 20) {
      setMessage('Số khách phải từ 1 đến 20 người');
      setLoading(false);
      return;
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCVC) {
        setMessage('Vui lòng điền đầy đủ thông tin thanh toán');
        setLoading(false);
        return;
      }
      
      // Validate card number (should be 16 digits)
      const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
      if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
        setMessage('Số thẻ không hợp lệ (phải có 16 chữ số)');
        setLoading(false);
        return;
      }

      // Validate expiry date (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        setMessage('Ngày hết hạn không hợp lệ (định dạng MM/YY)');
        setLoading(false);
        return;
      }

      // Validate CVC (3 digits)
      if (!/^\d{3}$/.test(formData.cardCVC)) {
        setMessage('CVC không hợp lệ (phải có 3 chữ số)');
        setLoading(false);
        return;
      }

      // Validate card name
      if (formData.cardName.trim().length < 2) {
        setMessage('Tên chủ thẻ phải có ít nhất 2 ký tự');
        setLoading(false);
        return;
      }

      // Validate expiry date is not in the past
      const [month, year] = formData.cardExpiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiryDate < now) {
        setMessage('Thẻ đã hết hạn');
        setLoading(false);
        return;
      }
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const order = {
      id: Date.now(),
      userId: user?.id || null, // Allow null for guest orders
      userName: formData.fullName,
      userEmail: formData.email,
      userPhone: formData.phone,
      tableNumber: formData.tableNumber,
      numberOfGuests: formData.numberOfGuests,
      items: cartItems,
      total: getTotalPrice(),
      paymentMethod: formData.paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order (with pending status - will be updated after payment)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Save guest email for order history lookup (if not logged in)
    if (!user) {
      localStorage.setItem('guest_email', formData.email);
    }

    // Save order to localStorage for payment page
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    setMessage('Đặt hàng thành công! Đang chuyển đến trang thanh toán...');
    setTimeout(() => {
      navigate('/payment', { state: { order } });
    }, 1500);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d3748', marginBottom: '2rem', textAlign: 'center' }}>Thanh Toán</h2>

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
            <h3 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>Đơn Hàng Của Bạn</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem 0',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>
                      {item.name}
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
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
              borderTop: '2px solid #667eea',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#718096' }}>Tạm tính:</span>
                <span style={{ color: '#718096' }}>{formatPrice(getTotalPrice())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#718096' }}>Phí phục vụ:</span>
                <span style={{ color: '#718096' }}>{formatPrice(0)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#667eea',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid #e2e8f0'
              }}>
                <span>Tổng cộng:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            {message && (
              <div style={{
                background: message.includes('thành công') ? '#e6fffa' : '#fee',
                color: message.includes('thành công') ? '#48bb78' : '#c33',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: `1px solid ${message.includes('thành công') ? '#9ae6b4' : '#fcc'}`,
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Restaurant Table Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2d3748', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} />
                  Thông Tin Đặt Bàn
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      <User size={16} />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      <Phone size={16} />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
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
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                    <Mail size={16} />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                      Số bàn *
                    </label>
                    <input
                      type="text"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Ví dụ: Bàn 1, Bàn 5"
                      disabled={!!currentTable}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: currentTable ? '#f7fafc' : 'white',
                        cursor: currentTable ? 'not-allowed' : 'text'
                      }}
                    />
                    {currentTable && (
                      <p style={{ fontSize: '0.85rem', color: '#48bb78', marginTop: '0.25rem' }}>
                        ✓ Số bàn đã được tự động điền từ QR code
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      <Users size={16} />
                      Số khách *
                    </label>
                    <select
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'người' : 'người'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2d3748', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} />
                  Phương Thức Thanh Toán
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${formData.paymentMethod === 'cash' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.paymentMethod === 'cash' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontWeight: '600' }}>Thanh toán tiền mặt tại nhà hàng</span>
                  </label>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `2px solid ${formData.paymentMethod === 'card' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.paymentMethod === 'card' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontWeight: '600' }}>Thẻ tín dụng/Ghi nợ</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1.5rem',
                    background: '#f7fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                        Số thẻ *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Quay Lại Giỏ Hàng
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{ flex: 1 }}
                >
                  {loading ? 'Đang xử lý...' : `Hoàn Tất Đặt Hàng - ${formatPrice(getTotalPrice())}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

