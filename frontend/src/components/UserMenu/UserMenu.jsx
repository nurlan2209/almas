import React, { useState, useRef, useEffect } from 'react';
import './UserMenu.css';
import UserProfile from './UserProfile';

const UserMenu = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openProfile = () => {
    setIsProfileOpen(true);
    setIsMenuOpen(false);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div className="user-menu-trigger" onClick={toggleMenu}>
        <div className="user-avatar">
          {user.firstName ? user.firstName.charAt(0) : 'Д'}
        </div>
        <span className="user-name">{user.firstName || 'Донор'}</span>
        <i className={`arrow ${isMenuOpen ? 'up' : 'down'}`}></i>
      </div>
      
      {isMenuOpen && (
        <div className="user-dropdown-menu">
          <div className="menu-header">
            <div className="user-info">
              <div className="user-avatar-large">
                {user.firstName ? user.firstName.charAt(0) : 'Д'}
              </div>
              <div className="user-details">
                <div className="user-full-name">
                  {`${user.lastName || ''} ${user.firstName || 'Донор'} ${user.patronymic || ''}`}
                </div>
                <div className="user-email">{user.email || 'email@example.com'}</div>
              </div>
            </div>
          </div>
          
          <ul className="menu-items">
            <li onClick={openProfile}>
              <i className="icon profile-icon"></i>
              Мой профиль
            </li>
            <li>
              <i className="icon history-icon"></i>
              История донаций
            </li>
            <li>
              <i className="icon appointments-icon"></i>
              Мои записи
            </li>
            <li>
              <i className="icon certificates-icon"></i>
              Справки и документы
            </li>
            <li>
              <i className="icon notifications-icon"></i>
              Уведомления
            </li>
            <li onClick={handleLogout}>
              <i className="icon logout-icon"></i>
              Выйти
            </li>
          </ul>
        </div>
      )}
      
      {isProfileOpen && (
        <UserProfile user={user} onClose={closeProfile} />
      )}
    </div>
  );
};

export default UserMenu;