import React, { useState } from 'react';
import './Auth.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Обработчик переключения между вкладками
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null); // Сбрасываем ошибки при переключении вкладок
  };

  // Обработчик успешной авторизации или регистрации
  const handleSuccess = () => {
    onClose();
  };

  // Обработчик ошибки
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => handleTabChange('login')}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} 
            onClick={() => handleTabChange('register')}
          >
            Регистрация
          </button>
        </div>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {activeTab === 'login' ? (
          <LoginForm 
            onClose={handleSuccess} 
            onError={handleError}
          />
        ) : (
          <RegisterForm 
            onClose={handleSuccess} 
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;