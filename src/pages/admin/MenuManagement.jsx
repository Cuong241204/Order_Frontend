import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, ArrowUpDown, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // name, price, category
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số món ăn mỗi trang
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    { id: 'main', name: 'Món Chính' },
    { id: 'appetizer', name: 'Khai Vị' },
    { id: 'grilled', name: 'Món Nướng' },
    { id: 'dessert', name: 'Tráng Miệng' },
    { id: 'drink', name: 'Đồ Uống' }
  ];

  useEffect(() => {
    // Xóa trực tiếp các món không mong muốn từ localStorage trước khi load
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      try {
        let items = JSON.parse(stored);
        const itemsBeforeDelete = items.length;
        items = items.filter(item => 
          item.name !== "Bún Bò" && 
          item.name !== "Bún Bò Huế" &&
          item.name !== "Chả Cá" &&
          item.name !== "Chả Cá Lã Vọng"
        );
        if (items.length < itemsBeforeDelete) {
          localStorage.setItem('menuItems', JSON.stringify(items));
        }
      } catch (e) {
        console.error('Error cleaning menu items:', e);
      }
    }
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
    setCurrentPage(1); // Reset về trang 1 khi filter/sort thay đổi
  }, [menuItems, searchTerm, selectedCategory, sortBy, sortOrder]);

  const filterAndSortItems = () => {
    let filtered = [...menuItems];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  };

  const loadMenuItems = () => {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      let items = JSON.parse(stored);
      
      // Mapping tên món với ảnh local
      const imageMapping = {
        "Phở Bò Tái": "/images/pho_bo.jpg",
        "Cơm Tấm Sài Gòn": "/images/com_tam.jpg",
        "Bún Mọc": "/images/bunmoc.jpg",
        "Bún Chả": "/images/buncha.jpg",
        "Gỏi Cuốn Tôm Thịt": "/images/goi_cuon.jpg",
        "Cháo Lòng": "/images/chaolong.jpg",
        "Cá Nướng Muối Ớt": "/images/ca_nuong.jpg",
        "Sườn Nướng": "/images/suon_nuong.jpg",
        "Thịt Nướng BBQ": "/images/suon_nuong.jpg",
        "Bánh Flan": "/images/flan.jpg",
        "Flan Caramel": "/images/flan.jpg",
        "Chè Bưởi": "/images/che_buoi.jpg",
        "Nhãn Trần": "/images/nhan_tran.jpg",
        "Hoa Quả": "/images/hoa_qua.jpg",
        "Sữa Đậu Nành": "/images/sua_dau_nanh.jpg",
        "Cà Phê": "/images/cafe.jpg",
        "Trà Đá": "/images/tra_da.jpg",
        "Chè Ba Màu": "/images/che_buoi.jpg"
      };
      
      // Khai báo biến updated
      let updated = false;
      
      // Các món mới cần thêm vào menu
      const newItemsToAdd = [
        {
          id: Date.now() + 0,
          name: "Cơm Tấm Sài Gòn",
          description: "Cơm tấm với sườn nướng, chả trứng và đồ chua",
          price: 60000,
          category: "main",
          image: "/images/com_tam.jpg"
        },
        {
          id: Date.now() + 1,
          name: "Bún Mọc",
          description: "Bún mọc thơm ngon với thịt viên và nước dùng đậm đà",
          price: 50000,
          category: "main",
          image: "/images/bunmoc.jpg"
        },
        {
          id: Date.now() + 2,
          name: "Bún Chả",
          description: "Bún chả Hà Nội với thịt nướng thơm lừng",
          price: 60000,
          category: "main",
          image: "/images/buncha.jpg"
        },
        {
          id: Date.now() + 3,
          name: "Cháo Lòng",
          description: "Cháo lòng nóng hổi với lòng heo tươi ngon",
          price: 40000,
          category: "main",
          image: "/images/chaolong.jpg"
        },
        {
          id: Date.now() + 6,
          name: "Cá Nướng Muối Ớt",
          description: "Cá nướng muối ớt cay nồng thơm ngon",
          price: 95000,
          category: "grilled",
          image: "/images/ca_nuong.jpg"
        },
        {
          id: Date.now() + 7,
          name: "Sườn Nướng",
          description: "Sườn heo nướng thơm lừng với sốt đặc biệt",
          price: 85000,
          category: "grilled",
          image: "/images/suon_nuong.jpg"
        },
        {
          id: Date.now() + 8,
          name: "Bánh Flan",
          description: "Bánh flan caramel mềm mịn, ngọt ngào",
          price: 30000,
          category: "dessert",
          image: "/images/flan.jpg"
        },
        {
          id: Date.now() + 9,
          name: "Chè Bưởi",
          description: "Chè bưởi mát lạnh, thanh mát",
          price: 25000,
          category: "dessert",
          image: "/images/che_buoi.jpg"
        },
        {
          id: Date.now() + 10,
          name: "Nhãn Trần",
          description: "Nhãn trần tươi ngon, ngọt thanh",
          price: 20000,
          category: "dessert",
          image: "/images/nhan_tran.jpg"
        },
        {
          id: Date.now() + 11,
          name: "Hoa Quả",
          description: "Đĩa hoa quả tươi ngon, đa dạng",
          price: 35000,
          category: "dessert",
          image: "/images/hoa_qua.jpg"
        },
        {
          id: Date.now() + 12,
          name: "Sữa Đậu Nành",
          description: "Sữa đậu nành thơm ngon, bổ dưỡng",
          price: 12000,
          category: "drink",
          image: "/images/sua_dau_nanh.jpg"
        },
        {
          id: Date.now() + 13,
          name: "Cà Phê",
          description: "Cà phê đậm đà, thơm ngon",
          price: 15000,
          category: "drink",
          image: "/images/cafe.jpg"
        },
        {
          id: Date.now() + 14,
          name: "Trà Đá",
          description: "Trà đá mát lạnh giải nhiệt",
          price: 10000,
          category: "drink",
          image: "/images/tra_da.jpg"
        }
      ];
      
      // Thay thế "Chè Ba Màu" bằng "Chè Bưởi" nếu có
      items = items.map(item => {
        if (item.name === "Chè Ba Màu") {
          updated = true;
          return {
            ...item,
            name: "Chè Bưởi",
            image: "/images/che_buoi.jpg",
            description: "Chè bưởi mát lạnh, thanh mát",
            price: 25000
          };
        }
        return item;
      });
      
      // Xóa "Bún Bò", "Bún Bò Huế" và "Chả Cá", "Chả Cá Lã Vọng" nếu có
      const itemsBeforeDelete = items.length;
      items = items.filter(item => 
        item.name !== "Bún Bò" && 
        item.name !== "Bún Bò Huế" &&
        item.name !== "Chả Cá" &&
        item.name !== "Chả Cá Lã Vọng"
      );
      if (items.length < itemsBeforeDelete) {
        updated = true;
      }
      
      // Chuyển "Cà Phê Tráng Miệng" thành "Cà Phê" trong đồ uống nếu có
      items = items.map(item => {
        if (item.name === "Cà Phê Tráng Miệng") {
          updated = true;
          return {
            ...item,
            name: "Cà Phê",
            category: "drink",
            price: 15000,
            description: "Cà phê đậm đà, thơm ngon"
          };
        }
        return item;
      });
      
      // Xóa trùng lặp nếu có cả "Cà Phê Tráng Miệng" đã chuyển và "Cà Phê" gốc
      const cafeItems = items.filter(item => item.name === "Cà Phê");
      if (cafeItems.length > 1) {
        // Giữ lại một món "Cà Phê" trong đồ uống
        const otherItems = items.filter(item => item.name !== "Cà Phê");
        items = [...otherItems, {
          id: cafeItems[0].id,
          name: "Cà Phê",
          description: "Cà phê đậm đà, thơm ngon",
          price: 15000,
          category: "drink",
          image: "/images/cafe.jpg"
        }];
        updated = true;
      }
      
      // Cập nhật ảnh cho các món có trong mapping
      items = items.map(item => {
        if (imageMapping[item.name] && (!item.image || item.image.includes('placeholder') || item.image.includes('via.placeholder'))) {
          updated = true;
          return { ...item, image: imageMapping[item.name] };
        }
        return item;
      });
      
      // Thêm các món mới nếu chưa có
      const existingNames = items.map(item => item.name);
      newItemsToAdd.forEach(newItem => {
        if (!existingNames.includes(newItem.name)) {
          items.push(newItem);
          updated = true;
        }
      });
      
      if (updated) {
        localStorage.setItem('menuItems', JSON.stringify(items));
      }
      
      setMenuItems(items);
    } else {
      // Default menu items
      const defaultItems = [
        { id: 1, name: "Phở Bò Tái", description: "Phở bò truyền thống với thịt bò tái tươi ngon", price: 75000, category: "main", image: "/images/pho_bo.jpg" },
        { id: 1.5, name: "Cơm Tấm Sài Gòn", description: "Cơm tấm với sườn nướng, chả trứng và đồ chua", price: 60000, category: "main", image: "/images/com_tam.jpg" },
        { id: 2, name: "Bún Mọc", description: "Bún mọc thơm ngon với thịt viên và nước dùng đậm đà", price: 50000, category: "main", image: "/images/bunmoc.jpg" },
        { id: 3, name: "Bún Chả", description: "Bún chả Hà Nội với thịt nướng thơm lừng", price: 60000, category: "main", image: "/images/buncha.jpg" },
        { id: 5, name: "Gỏi Cuốn Tôm Thịt", description: "Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún", price: 45000, category: "appetizer", image: "/images/goi_cuon.jpg" },
        { id: 6, name: "Cháo Lòng", description: "Cháo lòng nóng hổi với lòng heo tươi ngon", price: 40000, category: "main", image: "/images/chaolong.jpg" },
        { id: 10, name: "Cá Nướng Muối Ớt", description: "Cá nướng muối ớt cay nồng thơm ngon", price: 95000, category: "grilled", image: "/images/ca_nuong.jpg" },
        { id: 11, name: "Sườn Nướng", description: "Sườn heo nướng thơm lừng với sốt đặc biệt", price: 85000, category: "grilled", image: "/images/suon_nuong.jpg" },
        { id: 8, name: "Bánh Flan", description: "Bánh flan caramel mềm mịn, ngọt ngào", price: 30000, category: "dessert", image: "/images/flan.jpg" },
        { id: 12, name: "Chè Bưởi", description: "Chè bưởi mát lạnh, thanh mát", price: 25000, category: "dessert", image: "/images/che_buoi.jpg" },
        { id: 13, name: "Nhãn Trần", description: "Nhãn trần tươi ngon, ngọt thanh", price: 20000, category: "dessert", image: "/images/nhan_tran.jpg" },
        { id: 14, name: "Hoa Quả", description: "Đĩa hoa quả tươi ngon, đa dạng", price: 35000, category: "dessert", image: "/images/hoa_qua.jpg" },
        { id: 9, name: "Cà Phê", description: "Cà phê đậm đà, thơm ngon", price: 15000, category: "drink", image: "/images/cafe.jpg" },
        { id: 15, name: "Sữa Đậu Nành", description: "Sữa đậu nành thơm ngon, bổ dưỡng", price: 12000, category: "drink", image: "/images/sua_dau_nanh.jpg" },
        { id: 16, name: "Trà Đá", description: "Trà đá mát lạnh giải nhiệt", price: 10000, category: "drink", image: "/images/tra_da.jpg" }
      ];
      setMenuItems(defaultItems);
      localStorage.setItem('menuItems', JSON.stringify(defaultItems));
    }
  };

  const saveMenuItems = (items) => {
    localStorage.setItem('menuItems', JSON.stringify(items));
    setMenuItems(items);
  };

  const validatePrice = (price) => {
    const numPrice = Number(price);
    return !isNaN(numPrice) && numPrice > 0;
  };

  const validateImageURL = (url) => {
    if (!url.trim()) return true; // Optional field
    // Accept both URLs, local paths, and base64 images
    if (url.startsWith('/images/')) return true;
    if (url.startsWith('data:image/')) return true; // Base64 image
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh (jpg, png, gif, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
        setError('');
      };
      reader.onerror = () => {
        setError('Lỗi khi đọc file ảnh. Vui lòng thử lại.');
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate name
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên món ăn');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Tên món ăn phải có ít nhất 2 ký tự');
      return;
    }

    // Validate description
    if (!formData.description.trim()) {
      setError('Vui lòng nhập mô tả món ăn');
      return;
    }

    if (formData.description.trim().length < 10) {
      setError('Mô tả món ăn phải có ít nhất 10 ký tự');
      return;
    }

    // Validate price
    if (!validatePrice(formData.price)) {
      setError('Giá không hợp lệ (phải là số dương)');
      return;
    }

    const priceValue = Number(formData.price);
    if (priceValue < 1000) {
      setError('Giá phải tối thiểu 1,000 VND');
      return;
    }

    if (priceValue > 10000000) {
      setError('Giá không được vượt quá 10,000,000 VND');
      return;
    }

    // Validate image URL if provided
    if (formData.image && !validateImageURL(formData.image)) {
      setError('URL hình ảnh không hợp lệ');
      return;
    }

    try {
    if (editingItem) {
      // Update existing item
      const updated = menuItems.map(item =>
        item.id === editingItem.id
            ? { 
                ...formData, 
                id: editingItem.id, 
                price: Number(formData.price), 
                name: formData.name.trim(), 
                description: formData.description.trim(),
                image: formData.image.trim() || 'https://via.placeholder.com/300x200?text=Food'
              }
          : item
      );
      saveMenuItems(updated);
        setError('');
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Date.now(),
          price: Number(formData.price),
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: formData.image.trim() || 'https://via.placeholder.com/300x200?text=Food'
      };
      saveMenuItems([...menuItems, newItem]);
        setError('');
    }
    resetForm();
    } catch (err) {
      setError('Đã xảy ra lỗi khi lưu món ăn. Vui lòng thử lại.');
      console.error('Error saving menu item:', err);
    }
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
    // Set preview if image is base64
    if (item.image && item.image.startsWith('data:image/')) {
      setImagePreview(item.image);
    } else {
      setImagePreview(null);
    }
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
    setImagePreview(null);
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
          <div>
            <h2 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '2rem' }}>Quản Lý Thực Đơn</h2>
            <p style={{ color: '#718096' }}>Tổng cộng: {menuItems.length} món ăn</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            Thêm Món Ăn
          </button>
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
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} color="#718096" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} color="#718096" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
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
              <option value="name">Sắp xếp theo tên</option>
              <option value="price">Sắp xếp theo giá</option>
              <option value="category">Sắp xếp theo danh mục</option>
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
            
            {error && (
              <div style={{
                background: '#fee',
                color: '#c33',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}
            
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Hình ảnh sản phẩm
                </label>
                
                {/* Upload từ máy tính */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="image-upload"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    📷 Tải ảnh từ máy tính
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
                    Chọn file ảnh (JPG, PNG, GIF - tối đa 5MB)
                  </p>
                </div>

                {/* Preview ảnh */}
                {(imagePreview || (formData.image && formData.image.startsWith('data:image/'))) && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    border: '2px dashed #667eea',
                    borderRadius: '8px',
                    background: '#f7fafc',
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>Xem trước ảnh:</p>
                    <img
                      src={imagePreview || formData.image}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'contain',
                        margin: '0 auto',
                        display: 'block'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: '' });
                        setImagePreview(null);
                      }}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#f56565',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}

                {/* Hiển thị ảnh hiện tại nếu đang edit và không có preview */}
                {editingItem && !imagePreview && formData.image && !formData.image.startsWith('data:image/') && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#f7fafc',
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>Ảnh hiện tại:</p>
                    <img
                      src={formData.image}
                      alt="Current"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'contain',
                        margin: '0 auto',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
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

        {filteredItems.length === 0 && menuItems.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
          }}>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>
              Không tìm thấy món ăn nào phù hợp với bộ lọc
            </p>
          </div>
        )}

        {/* Phân trang */}
        {(() => {
          const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedItems = filteredItems.slice(startIndex, endIndex);

          return (
            <>
        <div className="grid">
                {paginatedItems.map((item) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '3rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      border: '2px solid #e2e8f0',
                      background: currentPage === 1 ? '#f7fafc' : 'white',
                      color: currentPage === 1 ? '#cbd5e0' : '#2d3748',
                      borderRadius: '8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      opacity: currentPage === 1 ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.background = '#f7fafc';
                        e.currentTarget.style.borderColor = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }
                    }}
                  >
                    <ChevronLeft size={18} />
                    Trước
                  </button>

                  {/* Page Numbers */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        totalPages <= 7 ||
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                              minWidth: '40px',
                              height: '40px',
                              padding: '0.5rem',
                              border: '2px solid',
                              borderColor: currentPage === page ? '#667eea' : '#e2e8f0',
                              background: currentPage === page ? '#667eea' : 'white',
                              color: currentPage === page ? 'white' : '#2d3748',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              if (currentPage !== page) {
                                e.currentTarget.style.background = '#f7fafc';
                                e.currentTarget.style.borderColor = '#667eea';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (currentPage !== page) {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                              }
                            }}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} style={{ color: '#718096', padding: '0 0.25rem' }}>
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      border: '2px solid #e2e8f0',
                      background: currentPage === totalPages ? '#f7fafc' : 'white',
                      color: currentPage === totalPages ? '#cbd5e0' : '#2d3748',
                      borderRadius: '8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      opacity: currentPage === totalPages ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.background = '#f7fafc';
                        e.currentTarget.style.borderColor = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }
                    }}
                  >
                    Sau
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Page Info */}
              {filteredItems.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  color: '#718096',
                  fontSize: '0.9rem'
                }}>
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} trong tổng số {filteredItems.length} món ăn
                </div>
              )}
            </>
          );
        })()}

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

