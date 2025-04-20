import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authService';
import './AdminLogin.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('У вас нет прав администратора');
        }
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
    try {
        setIsLoading(true);
        console.log('Attempting login with:', formData);
        const result = await login(formData.email, formData.password);
        
        console.log('Login result:', result);
        
        if (result.success) {
          console.log('User role:', result.user.role);
          if (result.user.role === 'admin') {
            console.log('Redirecting to admin panel...');
            navigate('/admin/dashboard');
          } else {
            setError('У вас нет прав администратора');
          }
        } else {
          setError(result.error || 'Ошибка входа');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err.message || 'Произошла ошибка при входе');
      } finally {
        setIsLoading(false);
      }
  };
  
  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Вход в панель администратора</h2>
        </div>
        
        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Введите email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Введите пароль"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <button 
            className="back-to-site-button"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Вернуться на сайт
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;