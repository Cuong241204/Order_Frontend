import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Utensils, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Table } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalMenuItems: 0,
    totalTables: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Load users from orders and localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUserIds = new Set();
    orders.forEach(order => {
      if (order.userId) allUserIds.add(order.userId);
    });
    const uniqueUsers = storedUsers.length + (allUserIds.size - storedUsers.filter(u => allUserIds.has(u.id)).length);
    
    // Load menu items
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    
    // Load tables
    const tables = JSON.parse(localStorage.getItem('tables') || '[]');
    
    // Calculate revenue
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Calculate today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = orders
      .filter(order => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Order status counts
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    
    // Recent orders (last 5)
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setRecentOrders(sortedOrders.slice(0, 5));

    setStats({
      totalOrders: orders.length,
      totalUsers: uniqueUsers || storedUsers.length,
      totalMenuItems: menuItems.length,
      totalTables: tables.length || 5, // Default 5 if empty
      totalRevenue: revenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      todayRevenue
    });
  };

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
      link: '/admin/orders',
      subtitle: `${stats.pendingOrders} đang chờ`
    },
    {
      title: 'Tổng Người Dùng',
      value: stats.totalUsers,
      icon: Users,
      color: '#48bb78',
      link: '/admin/users',
      subtitle: 'Người dùng đã đăng ký'
    },
    {
      title: 'Món Ăn',
      value: stats.totalMenuItems,
      icon: Utensils,
      color: '#ed8936',
      link: '/admin/menu',
      subtitle: 'Món trong thực đơn'
    },
    {
      title: 'Quản Lý Bàn',
      value: stats.totalTables,
      icon: Table,
      color: '#9f7aea',
      link: '/admin/tables',
      subtitle: 'Bàn trong nhà hàng'
    },
    {
      title: 'Doanh Thu Tổng',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: '#f56565',
      link: '/admin/orders',
      subtitle: `Hôm nay: ${formatPrice(stats.todayRevenue)}`
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fff4e6', color: '#ed8936', icon: Clock },
      processing: { bg: '#e6f3ff', color: '#667eea', icon: Clock },
      completed: { bg: '#e6fffa', color: '#48bb78', icon: CheckCircle },
      cancelled: { bg: '#fee', color: '#f56565', icon: XCircle }
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        background: style.bg,
        color: style.color,
        fontSize: '0.85rem',
        fontWeight: '600'
      }}>
        <Icon size={14} />
        {status === 'pending' ? 'Đang chờ' : 
         status === 'processing' ? 'Đang xử lý' :
         status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
      </span>
    );
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '2rem' }}>Admin Dashboard</h2>
            <p style={{ color: '#718096' }}>Tổng quan hệ thống và quản lý</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/admin/menu" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <Utensils size={18} style={{ marginRight: '0.5rem' }} />
              Quản Lý Menu
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} />
              Quản Lý Đơn Hàng
            </Link>
            <Link to="/admin/tables" className="btn" style={{ padding: '0.75rem 1.5rem' }}>
              <Table size={18} style={{ marginRight: '0.5rem' }} />
              Quản Lý Bàn
            </Link>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
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
                  border: `2px solid ${card.color}20`,
                  position: 'relative',
                  overflow: 'hidden'
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
                  <div style={{ 
                    position: 'absolute', 
                    top: '-20px', 
                    right: '-20px', 
                    width: '100px', 
                    height: '100px', 
                    background: `${card.color}10`,
                    borderRadius: '50%'
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' }}>
                    <Icon size={40} color={card.color} />
                    <TrendingUp size={20} color={card.color} style={{ opacity: 0.5 }} />
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3748', marginBottom: '0.25rem' }}>
                    {card.value}
                  </h3>
                  <p style={{ color: '#2d3748', fontWeight: '600', marginBottom: '0.25rem' }}>{card.title}</p>
                  {card.subtitle && (
                    <p style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.5rem' }}>{card.subtitle}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Order Status Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #fff4e6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Clock size={24} color="#ed8936" />
              <span style={{ fontWeight: '600', color: '#2d3748' }}>Đang chờ</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ed8936', margin: 0 }}>
              {stats.pendingOrders}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e6fffa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={24} color="#48bb78" />
              <span style={{ fontWeight: '600', color: '#2d3748' }}>Hoàn thành</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#48bb78', margin: 0 }}>
              {stats.completedOrders}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #fee'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <XCircle size={24} color="#f56565" />
              <span style={{ fontWeight: '600', color: '#2d3748' }}>Đã hủy</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f56565', margin: 0 }}>
              {stats.cancelledOrders}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2d3748', fontSize: '1.5rem' }}>Đơn Hàng Gần Đây</h3>
            <Link to="/admin/orders" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
              Xem tất cả →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
              Chưa có đơn hàng nào
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#edf2f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f7fafc';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '700', color: '#2d3748' }}>Đơn #{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>
                      {order.userName || `User ID: ${order.userId || 'Guest'}`} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', color: '#667eea', fontSize: '1.1rem', margin: 0 }}>
                      {formatPrice(order.total)}
                    </p>
                    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
                      {order.items?.length || 0} món
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

