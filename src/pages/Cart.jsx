import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem(`cart_${user?.id}`);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [user]);

  const saveCart = (items) => {
    setCartItems(items);
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      const updated = cartItems.filter(item => item.id !== id);
      saveCart(updated);
    } else {
      const updated = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      saveCart(updated);
    }
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Giỏ hàng của bạn đang trống!');
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="cart">
            <h2>Giỏ Hàng Trống</h2>
            <p>Bạn chưa có món ăn nào trong giỏ hàng.</p>
            <a href="/menu" className="btn">Xem Thực Đơn</a>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <div className="cart">
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để sử dụng giỏ hàng.</p>
            <a href="/login" className="btn">Đăng Nhập</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="cart">
          <h2>Giỏ Hàng ({cartItems.length} món)</h2>
          
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
          
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{formatPrice(item.price)}</p>
              </div>
              <div className="cart-item-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          
          <div className="cart-total">
            Tổng cộng: {formatPrice(getTotalPrice())}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="btn" 
              style={{ marginRight: '1rem' }}
              onClick={handleCheckout}
            >
              Thanh Toán
            </button>
            <a href="/menu" className="btn btn-secondary">
              Tiếp Tục Mua Sắm
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;