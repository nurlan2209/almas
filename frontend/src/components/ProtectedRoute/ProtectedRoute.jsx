import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../services/authService';

// Компонент для защиты маршрутов, требующих авторизации
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Пока проверяем авторизацию, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на главную страницу
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Если пользователь авторизован, показываем защищенный контент
  return children;
};

export default ProtectedRoute;