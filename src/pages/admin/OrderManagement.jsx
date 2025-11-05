import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      // Sample orders for demo
      const sampleOrders = [
        {
          id: 1,
          userId: 2,
          userName: 'Regular User',
          items: [
            { id: 1, name: 'Phở Bò Tái', price: 75000, quantity: 2 },
            { id: 2, name: 'Bún Bò Huế', price: 70000, quantity: 1 }
          ],
          total: 220000,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];
      setOrders(sampleOrders);
      localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
  };

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
        <h2 style={{ color: '#2d3748', marginBottom: '2rem' }}>Quản Lý Đơn Hàng</h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
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

