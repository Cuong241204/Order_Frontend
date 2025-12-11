import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter, ArrowUpDown, X, TrendingUp, ShoppingCart } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, total, status
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadOrders = () => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      setOrders([]);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.userName && order.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.userPhone && order.userPhone.includes(searchTerm))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredOrders(filtered);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      completedRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#48bb78" />;
      case 'cancelled':
        return <XCircle size={20} color="#f56565" />;
      default:
        return <Clock size={20} color="#ed8936" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '2rem' }}>Quản Lý Đơn Hàng</h2>
            <p style={{ color: '#718096' }}>Tổng cộng: {orders.length} đơn hàng</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShoppingCart size={20} color="#667eea" />
              <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>Tổng đơn</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea', margin: 0 }}>
              {stats.total}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #fff4e6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={20} color="#ed8936" />
              <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>Đang chờ</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ed8936', margin: 0 }}>
              {stats.pending}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e6fffa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={20} color="#48bb78" />
              <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>Hoàn thành</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#48bb78', margin: 0 }}>
              {stats.completed}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #fee'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <XCircle size={20} color="#f56565" />
              <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>Đã hủy</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f56565', margin: 0 }}>
              {stats.cancelled}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
            border: '2px solid #f0f4ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <TrendingUp size={20} color="#667eea" />
              <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>Doanh thu</span>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#667eea', margin: 0 }}>
              {formatPrice(stats.completedRevenue)}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={18} color="#718096" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} color="#718096" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={20} color="#718096" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              <option value="date">Sắp xếp theo ngày</option>
              <option value="total">Sắp xếp theo tổng tiền</option>
              <option value="status">Sắp xếp theo trạng thái</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#667eea'
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 && orders.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
          }}>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>
              Không tìm thấy đơn hàng nào phù hợp với bộ lọc
            </p>
          </div>
        )}

        {filteredOrders.length === 0 && orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
                      Đơn hàng #{order.id}
                    </h3>
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                      Khách hàng: {order.userName || `User ID: ${order.userId}`}
                    </p>
                    {order.tableNumber && (
                      <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                        Bàn: {order.tableNumber} {order.numberOfGuests && `(${order.numberOfGuests} người)`}
                      </p>
                    )}
                    {order.userPhone && (
                      <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                        SĐT: {order.userPhone}
                      </p>
                    )}
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                      Ngày đặt: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(order.status)}
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Chi tiết đơn hàng:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Tổng cộng:</span>
                    <span style={{ color: '#667eea', fontSize: '1.2rem' }}>{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className="btn"
                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        style={{
                          background: '#48bb78',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Hoàn thành
                      </button>
                    </>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      style={{
                        background: '#48bb78',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Đánh dấu hoàn thành
                    </button>
                  )}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      style={{
                        background: '#f56565',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

