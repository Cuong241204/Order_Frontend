import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [cartCount] = useState(0); // Sẽ được kết nối với context sau

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🍜 FoodOrder
          </Link>
          
          <nav className="nav">
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Trang Chủ
            </Link>
            <Link to="/menu" className={isActive('/menu') ? 'active' : ''}>
              Thực Đơn
            </Link>
            <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
              Giỏ Hàng
            </Link>
          </nav>
          
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            Giỏ Hàng
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;