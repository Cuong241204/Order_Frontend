import React from 'react';
import { Printer } from 'lucide-react';

const Invoice = ({ order, onClose, showActions = true }) => {
  // Validate order
  if (!order) {
    return (
      <div id="invoice-content-wrapper" style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
        <div id="invoice-content">
          <p>Không có dữ liệu đơn hàng</p>
        </div>
      </div>
    );
  }
  
  // Debug: Log order data
  console.log('Invoice Order Data:', order);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (e) {
      return dateString;
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
      case 'momo':
        return 'MoMo';
      case 'zalo':
        return 'ZaloPay';
      default:
        return method || 'Chưa xác định';
    }
  };

  // Parse items - có thể là string hoặc array
  let items = [];
  try {
    if (typeof order.items === 'string') {
      items = JSON.parse(order.items);
    } else if (Array.isArray(order.items)) {
      items = order.items;
    }
  } catch (e) {
    console.error('Error parsing items:', e);
    items = [];
  }

  const handlePrint = () => {
    // Ensure invoice content is visible before printing
    const invoiceWrapper = document.getElementById('invoice-content-wrapper');
    const invoiceContent = document.getElementById('invoice-content');
    
    if (invoiceWrapper) {
      invoiceWrapper.style.display = 'block';
      invoiceWrapper.style.visibility = 'visible';
      invoiceWrapper.style.position = 'relative';
      invoiceWrapper.style.width = '100%';
      invoiceWrapper.style.height = 'auto';
    }
    
    if (invoiceContent) {
      invoiceContent.style.display = 'block';
      invoiceContent.style.visibility = 'visible';
      invoiceContent.style.position = 'relative';
      invoiceContent.style.width = '100%';
      invoiceContent.style.color = '#000';
      
      // Đảm bảo tất cả children visible
      const allChildren = invoiceContent.querySelectorAll('*');
      allChildren.forEach(child => {
        child.style.visibility = 'visible';
        child.style.color = '#000';
      });
    }
    
    // Small delay to ensure styles are applied
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Reset body */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            overflow: visible !important;
          }
          
          /* Ẩn tất cả elements ngoại trừ invoice wrapper */
          body > *:not(#invoice-content-wrapper) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          
          /* Hiển thị invoice wrapper */
          #invoice-content-wrapper {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            page-break-after: avoid !important;
          }
          
          /* Hiển thị invoice content */
          #invoice-content {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 1.5cm !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            color: #000 !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
          }
          
          /* Đảm bảo tất cả elements trong invoice hiển thị */
          #invoice-content * {
            visibility: visible !important;
            color: #000 !important;
          }
          
          /* Headers */
          #invoice-content h1 {
            display: block !important;
            visibility: visible !important;
            color: #000 !important;
            font-size: 24pt !important;
            margin: 0 0 10pt 0 !important;
            padding: 0 !important;
          }
          
          #invoice-content h3 {
            display: block !important;
            visibility: visible !important;
            color: #000 !important;
            font-size: 14pt !important;
            margin: 15pt 0 10pt 0 !important;
            padding: 0 !important;
          }
          
          /* Paragraphs */
          #invoice-content p {
            display: block !important;
            visibility: visible !important;
            color: #000 !important;
            margin: 5pt 0 !important;
            padding: 0 !important;
          }
          
          /* Divs */
          #invoice-content > div {
            display: block !important;
            visibility: visible !important;
            margin: 10pt 0 !important;
            padding: 0 !important;
          }
          
          /* Spans */
          #invoice-content span {
            display: inline !important;
            visibility: visible !important;
            color: #000 !important;
          }
          
          /* Tables */
          #invoice-content table {
            display: table !important;
            visibility: visible !important;
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 10pt 0 !important;
            page-break-inside: avoid !important;
          }
          
          #invoice-content thead {
            display: table-header-group !important;
            visibility: visible !important;
          }
          
          #invoice-content tbody {
            display: table-row-group !important;
            visibility: visible !important;
          }
          
          #invoice-content tr {
            display: table-row !important;
            visibility: visible !important;
            page-break-inside: avoid !important;
          }
          
          #invoice-content td,
          #invoice-content th {
            display: table-cell !important;
            visibility: visible !important;
            border: 1px solid #000 !important;
            padding: 8pt !important;
            color: #000 !important;
            text-align: left !important;
          }
          
          #invoice-content th {
            font-weight: bold !important;
            background: #f0f0f0 !important;
          }
          
          /* Ẩn buttons và các elements không cần in */
          button, .no-print, .no-print *,
          [class*="no-print"], [id*="no-print"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          
          @page {
            margin: 0.5cm;
            size: A4 portrait;
          }
        }
      `}</style>

      <div id="invoice-content-wrapper" style={{ display: 'block', visibility: 'visible' }}>
        <div id="invoice-content" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', display: 'block', visibility: 'visible' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
          <h1 style={{ color: '#2d3748', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 'bold' }}>HÓA ĐƠN</h1>
          <p style={{ color: '#718096', fontSize: '1rem', fontWeight: '600' }}>FoodOrder Restaurant</p>
          <p style={{ color: '#718096', fontSize: '0.85rem' }}>Mã đơn hàng: #{order.id}</p>
        </div>

        {/* Order Info */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            color: '#2d3748', 
            marginBottom: '0.75rem', 
            fontSize: '1.1rem', 
            borderBottom: '1px solid #e2e8f0', 
            paddingBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Thông Tin Đơn Hàng
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              {(order.customer_phone || order.userPhone) && (
                <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                  <strong>Số điện thoại:</strong> {order.customer_phone || order.userPhone}
                </p>
              )}
            </div>
            <div>
              {(order.table_number || order.tableNumber) && (
                <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                  <strong>Bàn:</strong> {order.table_number || order.tableNumber}
                  {(order.number_of_guests || order.numberOfGuests) && ` (${order.number_of_guests || order.numberOfGuests} người)`}
                </p>
              )}
              <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                <strong>Ngày đặt:</strong> {formatDate(order.created_at || order.createdAt || order.date)}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                <strong>Phương thức thanh toán:</strong> {getPaymentMethodText(order.payment_method || order.paymentMethod || order.payment_method)}
              </p>
              {order.status && (
                <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>
                  <strong>Trạng thái:</strong> 
                  <span style={{ 
                    color: order.status === 'completed' ? '#48bb78' : 
                           order.status === 'processing' ? '#ed8936' : '#718096',
                    fontWeight: '600',
                    marginLeft: '0.5rem'
                  }}>
                    {order.status === 'completed' ? 'Hoàn thành' :
                     order.status === 'processing' ? 'Đang xử lý' :
                     order.status === 'pending' ? 'Đang chờ' : order.status}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            color: '#2d3748', 
            marginBottom: '0.75rem', 
            fontSize: '1.2rem', 
            borderBottom: '1px solid #e2e8f0', 
            paddingBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Chi Tiết Đơn Hàng
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#2d3748', fontWeight: '600', border: '1px solid #e2e8f0' }}>Món ăn</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', color: '#2d3748', fontWeight: '600', border: '1px solid #e2e8f0', width: '80px' }}>SL</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: '#2d3748', fontWeight: '600', border: '1px solid #e2e8f0', width: '120px' }}>Đơn giá</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', color: '#2d3748', fontWeight: '600', border: '1px solid #e2e8f0', width: '120px' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', color: '#4a5568', border: '1px solid #e2e8f0' }}>{item.name}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#4a5568', border: '1px solid #e2e8f0' }}>{item.quantity || 1}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#4a5568', border: '1px solid #e2e8f0' }}>{formatPrice(item.price || 0)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#4a5568', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '0.75rem', textAlign: 'center', color: '#718096' }}>
                    Không có món ăn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{
          background: '#f7fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>Tổng cộng:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>
              {formatPrice(order.total_price || order.total || order.totalPrice || 0)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '2px solid #e2e8f0', color: '#718096', fontSize: '0.85rem' }}>
          <p style={{ margin: '0.25rem 0' }}>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
          <p style={{ margin: '0.25rem 0' }}>Hóa đơn được tạo tự động từ hệ thống FoodOrder</p>
        </div>
      </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            onClick={handlePrint}
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
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#5568d3';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            <Printer size={20} />
            In hóa đơn
          </button>
          {onClose && (
            <button
              onClick={onClose}
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
          )}
        </div>
      )}
    </>
  );
};

export default Invoice;


