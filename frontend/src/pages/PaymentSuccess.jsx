import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Receipt, Printer } from 'lucide-react';
import { ordersAPI } from '../services/api.js';
import Invoice from '../components/Invoice.jsx';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  
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
            fontSize: '2.5rem',
            fontWeight: '800'
          }}>
            Thanh Toán Thành Công!
          </h1>

          {/* Thank You Message - Nổi bật */}
          <div style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            padding: '1.5rem 2rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(72, 187, 120, 0.3)'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              margin: 0,
              fontWeight: '700',
              textAlign: 'center'
            }}>
              🙏 Cảm Ơn Quý Khách!
            </h2>
            <p style={{
              margin: '0.5rem 0 0 0',
              fontSize: '1.1rem',
              opacity: 0.95,
              textAlign: 'center'
            }}>
              Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
            </p>
          </div>

          {/* Order Info - Chỉ hiển thị đơn hàng hiện tại */}
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
                Thông Tin Đơn Hàng #{orderData.id}
              </h3>
              
              {/* Thông tin cơ bản */}
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                {transactionId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#718096' }}>Mã giao dịch:</span>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{transactionId}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Ngày đặt:</span>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>
                    {new Date(orderData.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Phương thức thanh toán:</span>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>
                    {orderData.payment_method === 'vnpay' ? 'VNPay' : 
                     orderData.payment_method === 'card' ? 'Thẻ tín dụng' :
                     orderData.payment_method === 'momo' ? 'MoMo' :
                     orderData.payment_method === 'zalo' ? 'ZaloPay' : 'Tiền mặt'}
                  </span>
                </div>
              </div>

              {/* Chi tiết món ăn trong đơn hàng */}
              {(() => {
                let items = [];
                try {
                  if (typeof orderData.items === 'string') {
                    items = JSON.parse(orderData.items);
                  } else if (Array.isArray(orderData.items)) {
                    items = orderData.items;
                  }
                } catch (e) {
                  console.error('Error parsing items:', e);
                  items = [];
                }

                return items.length > 0 ? (
                  <div style={{
                    borderTop: '2px solid #e2e8f0',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem'
                  }}>
                    <h4 style={{ 
                      color: '#2d3748', 
                      marginBottom: '1rem',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      Chi Tiết Đơn Hàng:
                    </h4>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {items.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <span style={{ color: '#2d3748', fontWeight: '600' }}>
                              {item.name}
                            </span>
                            {item.quantity > 1 && (
                              <span style={{ color: '#718096', marginLeft: '0.5rem' }}>
                                x {item.quantity}
                              </span>
                            )}
                          </div>
                          <span style={{ 
                            color: '#2d3748', 
                            fontWeight: '600',
                            minWidth: '120px',
                            textAlign: 'right'
                          }}>
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Tổng tiền */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '2px solid #667eea'
                    }}>
                      <span style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: '#2d3748' 
                      }}>
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
                        {formatPrice(orderData.total_price)}
                      </span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {/* Nút Quay Về Trang Chủ - Nổi bật */}
            <button
              onClick={() => navigate('/home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                minWidth: '250px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }}
            >
              <Home size={24} />
              Quay Về Trang Chủ
            </button>
            
            {/* Nút In Hóa Đơn */}
            {orderData && (
              <button
                onClick={() => setShowInvoice(true)}
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
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Printer size={20} />
                In Hóa Đơn
              </button>
            )}
            
            {/* Nút Xem Đơn Hàng - Phụ */}
            <button
              onClick={() => navigate('/orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#718096',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f7fafc';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
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

      {/* Invoice Modal */}
      {showInvoice && orderData && (
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
          padding: '2rem',
          overflow: 'auto'
        }} onClick={() => setShowInvoice(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <Invoice 
              order={orderData} 
              onClose={() => setShowInvoice(false)}
              showActions={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;








