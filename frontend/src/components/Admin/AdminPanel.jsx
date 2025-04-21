import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminPanel.css';

// Импорт компонентов админ-панели
import UserManagement from './UserManagement';
import { useAuth } from '../../services/authService';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth > 768);

  // Проверка, что пользователь является администратором
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Рұқсат жоқ</h2>
        <p>Бұл бетке кіру үшін әкімші құқығыңыз жоқ.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Басты бетке оралу
        </button>
      </div>
    );
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar" data-open={isMenuOpen}>
        <div className="admin-sidebar-header">
          <h3>Әкімші панелі</h3>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? '×' : '☰'}
          </button>
        </div>
        
        <nav className="admin-navigation">
          <ul>
            <li className={location.pathname === '/admin' ? 'active' : ''}>
            </li>
            <li className={location.pathname.includes('/admin/users') ? 'active' : ''}>
              <Link to="/admin/users" onClick={() => window.innerWidth <= 768 && setIsMenuOpen(false)}>
                <i className="icon users-icon">👥</i>
                <span>Пайдаланушылар</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button className="logout-button" onClick={handleGoToHome}>
            <i className="icon logout-icon">🏠</i>
            <span>Басты бетке</span>
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <header className="admin-content-header">
          <div className="admin-user-info">
            <span>Сәлем, {user.first_name} {user.last_name}</span>
          </div>
        </header>
        
        <main className="admin-content-main">
          <Routes>
            <Route path="/users/*" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;