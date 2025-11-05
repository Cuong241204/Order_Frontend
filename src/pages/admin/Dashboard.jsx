import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Utensils, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalMenuItems: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Load stats from localStorage or API
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    setStats({
      totalOrders: orders.length,
      totalUsers: users.length,
      totalMenuItems: menuItems.length,
      totalRevenue: revenue
    });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const statCards = [
    {
      title: 'Tổng Đơn Hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: '#667eea',
      link: '/admin/orders'
    },
    {
      title: 'Tổng Người Dùng',
      value: stats.totalUsers,
      icon: Users,
      color: '#48bb78',
      link: '/admin/users'
    },
    {
      title: 'Món Ăn',
      value: stats.totalMenuItems,
      icon: Utensils,
      color: '#ed8936',
      link: '/admin/menu'
    },
    {
      title: 'Doanh Thu',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: '#f56565',
      link: '/admin/orders'
    }
  ];

  return (
    <div className="section">
      <div className="container">
        <h2 style={{ color: '#2d3748', marginBottom: '3rem' }}>Admin Dashboard</h2>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.link}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: `2px solid ${card.color}20`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <Icon size={40} color={card.color} />
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3748', marginBottom: '0.5rem' }}>
                    {card.value}
                  </h3>
                  <p style={{ color: '#718096', fontWeight: '600' }}>{card.title}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Link to="/admin/menu" className="btn" style={{ textAlign: 'center', padding: '2rem' }}>
            <Utensils size={32} style={{ marginBottom: '1rem' }} />
            <h3>Quản Lý Thực Đơn</h3>
            <p>Thêm, sửa, xóa món ăn</p>
          </Link>
          
          <Link to="/admin/orders" className="btn" style={{ textAlign: 'center', padding: '2rem' }}>
            <ShoppingCart size={32} style={{ marginBottom: '1rem' }} />
            <h3>Quản Lý Đơn Hàng</h3>
            <p>Xem và quản lý đơn hàng</p>
          </Link>
          
          <Link to="/admin/users" className="btn" style={{ textAlign: 'center', padding: '2rem' }}>
            <Users size={32} style={{ marginBottom: '1rem' }} />
            <h3>Quản Lý Người Dùng</h3>
            <p>Xem danh sách người dùng</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

