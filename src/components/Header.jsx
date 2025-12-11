import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Shield, Table } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTable } from '../contexts/TableContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { currentTable } = useTable();
  const [cartCount] = useState(0); // Sẽ được kết nối với context sau
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/home');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/home" className="logo">
            🍜 FoodOrder
          </Link>
          
          <nav className="nav">
            <Link to="/home" className={isActive('/home') ? 'active' : ''}>
              Trang Chủ
            </Link>
            <Link to="/menu" className={isActive('/menu') ? 'active' : ''}>
              Thực Đơn
            </Link>
            <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
              Giỏ Hàng
            </Link>
            <Link to="/checkout" className={isActive('/checkout') ? 'active' : ''}>
              Thanh Toán
            </Link>
          </nav>
          
          {currentTable && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '20px',
              color: '#667eea',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              <Table size={18} />
              {currentTable.number}
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;