import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders] = useState([
    {
      id: 1,
      date: '2024-01-15',
      items: [
        { name: 'Phở Bò Tái', quantity: 2, price: 75000 },
        { name: 'Cơm Tấm Sài Gòn', quantity: 1, price: 60000 }
      ],
      total: 220000,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-20',
      items: [
        { name: 'Cơm Tấm Sài Gòn', quantity: 1, price: 60000 },
        { name: 'Gỏi Cuốn Tôm Thịt', quantity: 2, price: 45000 }
      ],
      total: 150000,
      status: 'delivered'
    }
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return '#48bb78';
      case 'pending':
        return '#ed8936';
      case 'cancelled':
        return '#f56565';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'delivered':
        return 'Đã giao';
      case 'pending':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h2 style={{
          textAlign: 'center',
          marginBottom: '3rem',
          fontSize: '2.5rem',
          color: 'white',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          Lịch Sử Đơn Hàng
        </h2>

        {orders.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#718096' }}>
              Bạn chưa có đơn hàng nào
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#2d3748' }}>
                      Đơn hàng #{order.id}
                    </h3>
                    <p style={{ color: '#718096' }}>Ngày đặt: {order.date}</p>
                  </div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: getStatusColor(order.status),
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#4a5568' }}>Chi tiết đơn hàng:</h4>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <span style={{ color: '#2d3748' }}>
                        {item.name} x {item.quantity}
                      </span>
                      <span style={{ color: '#2d3748', fontWeight: '600' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '2px solid #667eea'
                }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
                    Tổng cộng:
                  </span>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

