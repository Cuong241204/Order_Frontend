import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      setMenuItems(JSON.parse(stored));
    } else {
      // Default menu items if admin hasn't added any
      const defaultItems = [
    {
      id: 1,
      name: "Phở Bò Tái",
      description: "Phở bò truyền thống với thịt bò tái tươi ngon",
      price: 75000,
      category: "main",
      image: "https://via.placeholder.com/300x200?text=Phở+Bò+Tái"
    },
    {
      id: 2,
      name: "Bún Bò Huế",
      description: "Bún bò Huế cay nồng với thịt bò và chả cua",
      price: 70000,
      category: "main",
      image: "https://via.placeholder.com/300x200?text=Bún+Bò+Huế"
    },
    {
      id: 3,
      name: "Cơm Tấm Sài Gòn",
      description: "Cơm tấm với sườn nướng, chả trứng và đồ chua",
      price: 60000,
      category: "main",
      image: "https://via.placeholder.com/300x200?text=Cơm+Tấm"
    },
    {
      id: 4,
      name: "Gỏi Cuốn Tôm Thịt",
      description: "Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún",
      price: 45000,
      category: "appetizer",
      image: "https://via.placeholder.com/300x200?text=Gỏi+Cuốn"
    },
    {
      id: 5,
      name: "Chả Cá Lã Vọng",
      description: "Chả cá truyền thống Hà Nội với bún tươi",
      price: 65000,
      category: "appetizer",
      image: "https://via.placeholder.com/300x200?text=Chả+Cá"
    },
    {
      id: 6,
      name: "Thịt Nướng BBQ",
      description: "Thịt heo nướng BBQ với sốt đặc biệt",
      price: 85000,
      category: "grilled",
      image: "https://via.placeholder.com/300x200?text=Thịt+Nướng"
    },
    {
      id: 7,
      name: "Cá Nướng Muối Ớt",
      description: "Cá nướng muối ớt cay nồng thơm ngon",
      price: 95000,
      category: "grilled",
      image: "https://via.placeholder.com/300x200?text=Cá+Nướng"
    },
    {
      id: 8,
      name: "Chè Ba Màu",
      description: "Chè ba màu truyền thống với đậu đỏ, đậu xanh và bánh lọt",
      price: 25000,
      category: "dessert",
      image: "https://via.placeholder.com/300x200?text=Chè+Ba+Màu"
    },
    {
      id: 9,
      name: "Trà Đá",
      description: "Trà đá mát lạnh giải nhiệt",
      price: 10000,
      category: "drink",
      image: "https://via.placeholder.com/300x200?text=Trà+Đá"
    }
      ];
      setMenuItems(defaultItems);
      localStorage.setItem('menuItems', JSON.stringify(defaultItems));
    }
  };

  const addToCart = (item) => {
    if (!user) {
      setMessage('Vui lòng đăng nhập để thêm vào giỏ hàng');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...item,
        quantity: 1,
        image: item.image || 'https://via.placeholder.com/80x80?text=Food'
      });
    }

    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    setMessage(`Đã thêm ${item.name} vào giỏ hàng!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const categories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'main', name: 'Món Chính' },
    { id: 'appetizer', name: 'Khai Vị' },
    { id: 'grilled', name: 'Món Nướng' },
    { id: 'dessert', name: 'Tráng Miệng' },
    { id: 'drink', name: 'Đồ Uống' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="section">
      <div className="container">
        <h2>Thực Đơn</h2>
        
        {message && (
          <div style={{
            background: '#e6fffa',
            color: '#48bb78',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #9ae6b4',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {message}
          </div>
        )}
        
        {/* Category Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid #ff6b35',
                background: selectedCategory === category.id ? '#ff6b35' : 'white',
                color: selectedCategory === category.id ? 'white' : '#ff6b35',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="food-card">
              <img src={item.image} alt={item.name} />
              <div className="food-card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="food-card-footer">
                  <span className="price">{formatPrice(item.price)}</span>
                  <button 
                    className="add-btn"
                    onClick={() => addToCart(item)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Không có món ăn nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;