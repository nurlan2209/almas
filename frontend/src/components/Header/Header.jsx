// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import Auth from '../Auth/Auth';
import UserMenu from '../UserMenu/UserMenu';
import { useAuth } from '../../services/authService';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">Донор<span className="logo-highlight">Жизни</span></span>
          </Link>
        </div>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Главная
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                О нас
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/how-to-donate" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Как стать донором
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/donation-centers" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Центры сдачи
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Контакты
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="auth-container">
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <button className="auth-button" onClick={openAuthModal}>
              Войти / Регистрация
            </button>
          )}
        </div>
      </div>
      
      <Auth isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </header>
  );
};

export default Header;