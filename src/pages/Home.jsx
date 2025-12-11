import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTable } from '../contexts/TableContext';

const Home = () => {
  const [searchParams] = useSearchParams();
  const { setTable, currentTable } = useTable();

  useEffect(() => {
    // Check URL for table parameter from QR code
    const tableId = searchParams.get('table');
    if (tableId) {
      const tables = JSON.parse(localStorage.getItem('tables') || '[]');
      const table = tables.find(t => t.id === parseInt(tableId)) || {
        id: parseInt(tableId),
        number: `Bàn ${tableId}`,
        capacity: 4,
        status: 'available'
      };
      setTable(table);
    }
  }, [searchParams, setTable]);

  const featuredItems = [
    {
      id: 1,
      name: "Phở Bò Tái",
      description: "Phở bò truyền thống với thịt bò tái tươi ngon",
      price: 75000,
      image: "https://via.placeholder.com/300x200?text=Phở+Bò+Tái"
    },
    {
      id: 2,
      name: "Cơm Tấm Sài Gòn",
      description: "Cơm tấm với sườn nướng, chả trứng và đồ chua",
      price: 60000,
      image: "/images/com_tam.jpg"
    },
    {
      id: 4,
      name: "Gỏi Cuốn Tôm Thịt",
      description: "Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún",
      price: 45000,
      image: "https://via.placeholder.com/300x200?text=Gỏi+Cuốn"
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🍜 FoodOrder</h1>
          <p>Ẩm thực Việt Nam - Hương vị truyền thống, chất lượng hiện đại</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/menu" className="btn">
              Xem Thực Đơn
            </Link>
            <Link to="/cart" className="btn btn-secondary">
              Giỏ Hàng
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="section">
        <div className="container">
          <h2>Món Ăn Nổi Bật</h2>
          <div className="grid">
            {featuredItems.map((item) => (
              <div key={item.id} className="food-card">
                <img src={item.image} alt={item.name} />
                <div className="food-card-content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="food-card-footer">
                    <span className="price">{formatPrice(item.price)}</span>
                    <button className="add-btn">Thêm vào giỏ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/menu" className="btn">
              Xem Tất Cả Món Ăn
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2>Tại Sao Chọn Chúng Tôi?</h2>
          <div className="grid">
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⭐</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>Chất Lượng Cao</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>Nguyên liệu tươi ngon, chế biến cẩn thận theo công thức truyền thống</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🍽️</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>Phục Vụ Nhanh</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>Món ăn được phục vụ nhanh chóng, đảm bảo còn nóng hổi khi đến bàn</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏪</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>Không Gian Đẹp</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>Không gian nhà hàng sang trọng, thoáng mát, phù hợp cho mọi dịp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;