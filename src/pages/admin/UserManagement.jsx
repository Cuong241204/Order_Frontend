import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Load from localStorage or create default users
    const stored = localStorage.getItem('users');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      // Default users
      const defaultUsers = [
        { id: 1, name: 'Admin User', email: 'admin@foodorder.com', role: 'admin' },
        { id: 2, name: 'Regular User', email: 'user@foodorder.com', role: 'user' },
        { id: 3, name: 'Test User', email: 'test@test.com', role: 'user' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  };

  const deleteUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      const updated = users.filter(user => user.id !== userId);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h2 style={{ color: '#2d3748', marginBottom: '2rem' }}>Quản Lý Người Dùng</h2>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Chưa có người dùng nào.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#2d3748', marginBottom: '0.25rem' }}>
                      {user.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.9rem' }}>
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem', background: user.role === 'admin' ? '#fee' : '#e6fffa', borderRadius: '8px' }}>
                  <Shield size={16} color={user.role === 'admin' ? '#c33' : '#48bb78'} />
                  <span style={{ fontWeight: '600', color: user.role === 'admin' ? '#c33' : '#48bb78' }}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>

                {user.role !== 'admin' && (
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      width: '100%',
                      background: '#f56565',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e53e3e'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f56565'}
                  >
                    <Trash2 size={16} />
                    Xóa người dùng
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

