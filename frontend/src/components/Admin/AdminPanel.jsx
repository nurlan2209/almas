import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminPanel.css';

// Импорт компонентов админ-панели
import UserManagement from './UserManagement';
import DonationRequestsAdmin from './DonationRequestsAdmin';
import DonationsAdmin from './DonationsAdmin';
import DonationCentersAdmin from './DonationCentersAdmin';
import SystemSettings from './SystemSettings';
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
        <h2>Доступ запрещен</h2>
        <p>У вас нет прав администратора для доступа к этой странице.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Вернуться на главную
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
          <h3>Панель администратора</h3>
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
                <span>Пользователи</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button className="logout-button" onClick={handleGoToHome}>
            <i className="icon logout-icon">🏠</i>
            <span>На главную</span>
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <header className="admin-content-header">
          <div className="admin-user-info">
            <span>Привет, {user.first_name} {user.last_name}</span>
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