import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { ordersAPI } from '../services/api.js';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const order = await ordersAPI.getById(orderId);
          setOrderData(order);
        } catch (error) {
          console.error('Error loading order:', error);
        }
      }
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 10px 30px rgba(72, 187, 120, 0.4)'
          }}>
            <CheckCircle size={50} color="white" />
          </div>

          {/* Title */}
          <h1 style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            fontSize: '2.5rem'
          }}>
            Thanh Toán Thành Công!
          </h1>

          <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
          </p>

          {/* Order Info */}
          {orderData && (
            <div style={{
              background: '#f7fafc',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#2d3748', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={24} />
                Thông Tin Đơn Hàng
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Mã đơn hàng:</span>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>#{orderData.id}</span>
                </div>
                
                {transactionId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Mã giao dịch:</span>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{transactionId}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Tổng tiền:</span>
                  <span style={{ fontWeight: '600', color: '#667eea', fontSize: '1.2rem' }}>
                    {formatPrice(orderData.total_price)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Phương thức:</span>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>
                    {orderData.payment_method === 'vnpay' ? 'VNPay' : 
                     orderData.payment_method === 'card' ? 'Thẻ tín dụng' :
                     orderData.payment_method === 'momo' ? 'MoMo' :
                     orderData.payment_method === 'zalo' ? 'ZaloPay' : 'Tiền mặt'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              <Home size={20} />
              Về Trang Chủ
            </button>
            
            <button
              onClick={() => navigate('/orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <Receipt size={20} />
              Xem Đơn Hàng
            </button>
          </div>

          {/* Note */}
          <p style={{ 
            color: '#718096', 
            fontSize: '0.9rem', 
            marginTop: '2rem',
            padding: '1rem',
            background: '#e6fffa',
            borderRadius: '8px',
            border: '1px solid #9ae6b4'
          }}>
            📧 Email xác nhận đã được gửi đến địa chỉ email của bạn (nếu đã cấu hình).
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


