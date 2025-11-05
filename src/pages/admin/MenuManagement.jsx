import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: ''
  });

  const categories = [
    { id: 'main', name: 'Món Chính' },
    { id: 'appetizer', name: 'Khai Vị' },
    { id: 'grilled', name: 'Món Nướng' },
    { id: 'dessert', name: 'Tráng Miệng' },
    { id: 'drink', name: 'Đồ Uống' }
  ];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      setMenuItems(JSON.parse(stored));
    } else {
      // Default menu items
      const defaultItems = [
        { id: 1, name: "Phở Bò Tái", description: "Phở bò truyền thống với thịt bò tái tươi ngon", price: 75000, category: "main", image: "https://via.placeholder.com/300x200?text=Phở+Bò+Tái" },
        { id: 2, name: "Bún Bò Huế", description: "Bún bò Huế cay nồng với thịt bò và chả cua", price: 70000, category: "main", image: "https://via.placeholder.com/300x200?text=Bún+Bò+Huế" },
        { id: 3, name: "Cơm Tấm Sài Gòn", description: "Cơm tấm với sườn nướng, chả trứng và đồ chua", price: 60000, category: "main", image: "https://via.placeholder.com/300x200?text=Cơm+Tấm" },
        { id: 4, name: "Gỏi Cuốn Tôm Thịt", description: "Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún", price: 45000, category: "appetizer", image: "https://via.placeholder.com/300x200?text=Gỏi+Cuốn" }
      ];
      setMenuItems(defaultItems);
      localStorage.setItem('menuItems', JSON.stringify(defaultItems));
    }
  };

  const saveMenuItems = (items) => {
    localStorage.setItem('menuItems', JSON.stringify(items));
    setMenuItems(items);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update existing item
      const updated = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...formData, id: editingItem.id, price: Number(formData.price) }
          : item
      );
      saveMenuItems(updated);
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price)
      };
      saveMenuItems([...menuItems, newItem]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      saveMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main',
      image: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#2d3748' }}>Quản Lý Thực Đơn</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            Thêm Món Ăn
          </button>
        </div>

        {showForm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>
              {editingItem ? 'Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tên món</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Giá (VND)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>URL hình ảnh</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn">
                  {editingItem ? 'Cập Nhật' : 'Thêm Món'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid">
          {menuItems.map((item) => (
            <div key={item.id} className="food-card">
              <img src={item.image} alt={item.name} />
              <div className="food-card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="food-card-footer">
                  <span className="price">{formatPrice(item.price)}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: '#f56565',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Chưa có món ăn nào. Hãy thêm món ăn đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;

