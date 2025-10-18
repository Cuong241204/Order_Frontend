import React, { useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Phở Bò Tái",
      price: 75000,
      quantity: 2,
      image: "https://via.placeholder.com/80x80?text=Phở"
    },
    {
      id: 2,
      name: "Bún Bò Huế",
      price: 70000,
      quantity: 1,
      image: "https://via.placeholder.com/80x80?text=Bún"
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  return (
    <div className="section">
      <div className="container">
        <div className="cart">
          <h2>Giỏ Hàng ({cartItems.length} món)</h2>
          
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
            <button className="btn" style={{ marginRight: '1rem' }}>
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