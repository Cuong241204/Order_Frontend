import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter, ArrowUpDown, X, TrendingUp, ShoppingCart, FileText, Printer, X as XIcon, RefreshCw } from 'lucide-react';
import { ordersAPI } from '../../services/api.js';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, total, status
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [selectedOrder, setSelectedOrder] = useState(null); // For invoice view
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    loadOrders();
    
    // Auto-refresh mỗi 5 giây để cập nhật đơn hàng mới
    refreshIntervalRef.current = setInterval(() => {
      loadOrders(true); // true = silent refresh (không hiển thị loading)
    }, 5000);

    // Reload khi tab được focus lại
    const handleFocus = () => {
      loadOrders(true);
    };
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadOrders = async (silent = false) => {
    if (!silent) {
      setIsRefreshing(true);
    }
    try {
      const ordersData = await ordersAPI.getAll();
      // Transform API response to match frontend format
      const transformedOrders = ordersData.map(order => ({
        id: order.id,
        userId: order.user_id,
        userName: order.customer_name,
        userEmail: order.customer_email,
        userPhone: order.customer_phone,
        tableNumber: order.table_number,
        numberOfGuests: order.number_of_guests,
        items: JSON.parse(order.items),
        total: order.total_price,
        status: order.status,
        paymentMethod: order.payment_method,
        createdAt: order.created_at
      }));
      setOrders(transformedOrders);
      setLastRefreshTime(new Date());
    } catch (error) {
      console.error('Error loading orders from API, falling back to localStorage:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders([]);
      }
    } finally {
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  };

  const handleManualRefresh = () => {
    loadOrders(false); // false = hiển thị loading
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
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      completedRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
    const updated = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.message || 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng');
    }
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
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'vnpay':
        return 'VNPay';
      case 'card':
        return 'Thẻ tín dụng/Ghi nợ';
      case 'cash':
        return 'Tiền mặt';
      default:
        return method || 'Chưa xác định';
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            background: white;
          }
          button {
            display: none !important;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="section">
        <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '2rem' }}>Quản Lý Đơn Hàng</h2>
            <p style={{ color: '#718096' }}>
              Tổng cộng: {orders.length} đơn hàng
              {lastRefreshTime && (
                <span style={{ marginLeft: '1rem', fontSize: '0.85rem' }}>
                  (Cập nhật: {lastRefreshTime.toLocaleTimeString('vi-VN')})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: isRefreshing ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: isRefreshing ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
              opacity: isRefreshing ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            <RefreshCw 
              size={18} 
              style={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                transform: isRefreshing ? 'rotate(360deg)' : 'none'
              }} 
            />
            {isRefreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
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
                  {order.status === 'completed' && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FileText size={16} />
                      Xem hóa đơn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <XIcon size={24} color="#718096" />
            </button>

            {/* Invoice Content */}
            <div id="invoice-content" style={{ fontFamily: 'Arial, sans-serif' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '2rem' }}>
                <h1 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '2rem' }}>HÓA ĐƠN</h1>
                <p style={{ color: '#718096', fontSize: '1.1rem' }}>FoodOrder Restaurant</p>
                <p style={{ color: '#718096', fontSize: '0.9rem' }}>Mã đơn hàng: #{selectedOrder.id}</p>
              </div>

              {/* Order Info */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2d3748', marginBottom: '1rem', fontSize: '1.3rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  Thông Tin Đơn Hàng
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                      <strong>Khách hàng:</strong> {selectedOrder.userName || 'Khách hàng'}
                    </p>
                    {selectedOrder.userPhone && (
                      <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                        <strong>Số điện thoại:</strong> {selectedOrder.userPhone}
                      </p>
                    )}
                    {selectedOrder.userEmail && (
                      <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                        <strong>Email:</strong> {selectedOrder.userEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    {selectedOrder.tableNumber && (
                      <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                        <strong>Bàn:</strong> {selectedOrder.tableNumber}
                        {selectedOrder.numberOfGuests && ` (${selectedOrder.numberOfGuests} người)`}
                      </p>
                    )}
                    <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                      <strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                      <strong>Phương thức thanh toán:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                      <strong>Trạng thái:</strong> <span style={{ color: '#48bb78', fontWeight: '600' }}>Hoàn thành</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2d3748', marginBottom: '1rem', fontSize: '1.3rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  Chi Tiết Đơn Hàng
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#2d3748' }}>Món ăn</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: '#2d3748' }}>Số lượng</th>
                      <th style={{ padding: '1rem', textAlign: 'right', color: '#2d3748' }}>Đơn giá</th>
                      <th style={{ padding: '1rem', textAlign: 'right', color: '#2d3748' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem', color: '#4a5568' }}>{item.name}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#4a5568' }}>{item.quantity}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#4a5568' }}>{formatPrice(item.price)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#4a5568', fontWeight: '600' }}>
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '600', color: '#2d3748' }}>Tổng cộng:</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#667eea' }}>
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '2px solid #e2e8f0', color: '#718096' }}>
                <p style={{ margin: '0.5rem 0' }}>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Hóa đơn được tạo tự động từ hệ thống</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button
                onClick={handlePrintInvoice}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5568d3';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Printer size={20} />
                In hóa đơn
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#cbd5e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default OrderManagement;

