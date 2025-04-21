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
            <span className="logo-text">Өмір<span className="logo-highlight">Донор</span></span>
          </Link>
        </div>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Басты бет
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Біз туралы
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/how-to-donate" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Донор болу жолы
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink to="/search" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                  {user?.role === 'donor' ? 'Мұқтаж жандар' : 'Донор іздеу'}
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink to="/contact" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(false)}>
                Байланыс
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="auth-container">
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <button className="auth-button" onClick={openAuthModal}>
              Кіру / Тіркелу
            </button>
          )}
        </div>
      </div>
      
      <Auth isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </header>
  );
};

export default Header;