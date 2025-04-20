import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetails = ({ onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUserData(id);
  }, [id]);
  
  // Функция для загрузки данных пользователя
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Требуется авторизация');
      }
      
      // Запрос к API для получения данных пользователя
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }
      
      const data = await response.json();
      setUser(data.user);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err.message || 'Не удалось загрузить данные пользователя');
    } finally {
      setLoading(false);
    }
  };
  
  // Функция для отображения роли пользователя
  const getUserRole = (role) => {
    switch (role) {
      case 'donor':
        return 'Донор';
      case 'recipient':
        return 'Реципиент';
      case 'admin':
        return 'Администратор';
      default:
        return role;
    }
  };
  
  // Функция для отображения пола
  const getGender = (gender) => {
    switch (gender) {
      case 'male':
        return 'Мужской';
      case 'female':
        return 'Женский';
      default:
        return 'Не указан';
    }
  };
  
  // Функция для отображения резус-фактора
  const getRhFactor = (rh) => {
    switch (rh) {
      case 'positive':
        return 'Положительный (+)';
      case 'negative':
        return 'Отрицательный (-)';
      default:
        return 'Не указан';
    }
  };
  
  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Загрузка данных пользователя...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error">
        <h2>Ошибка загрузки данных</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Повторить попытку
        </button>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="admin-error">
        <h2>Пользователь не найден</h2>
        <button 
          onClick={onBack} 
          className="btn btn-primary"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }
  
  return (
    <div className="user-details">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Информация о пользователе</h2>
        <div className="admin-header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            Редактировать
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onBack}
          >
            Назад
          </button>
        </div>
      </div>
      
      <div className="admin-card">
        <div className="user-profile-header">
          <div className="user-avatar">
            {user.first_name ? user.first_name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="user-meta">
            <h3 className="user-name">
              {user.last_name} {user.first_name} {user.patronymic || ''}
            </h3>
            <div className="user-role-badge">{getUserRole(user.role)}</div>
            <div className="user-id">ID: {user.id}</div>
          </div>
        </div>
        
        <div className="user-details-sections">
          <div className="user-details-section">
            <h4 className="section-title">Основная информация</h4>
            <div className="details-grid">
              <div className="details-item">
                <div className="details-label">Email</div>
                <div className="details-value">{user.email || 'Не указан'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Телефон</div>
                <div className="details-value">{user.phone_number || 'Не указан'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Дата рождения</div>
                <div className="details-value">{formatDate(user.birth_date)}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Пол</div>
                <div className="details-value">{getGender(user.gender)}</div>
              </div>
              <div className="details-item">
                <div className="details-label">ИИН</div>
                <div className="details-value">{user.iin || 'Не указан'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Адрес</div>
                <div className="details-value">{user.address || 'Не указан'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Дата регистрации</div>
                <div className="details-value">{formatDate(user.created_at)}</div>
              </div>
            </div>
          </div>
          
          <div className="user-details-section">
            <h4 className="section-title">Медицинская информация</h4>
            <div className="details-grid">
              <div className="details-item">
                <div className="details-label">Группа крови</div>
                <div className="details-value">{user.blood_type || 'Не указана'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Резус-фактор</div>
                <div className="details-value">{getRhFactor(user.rh_factor)}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Рост</div>
                <div className="details-value">
                  {user.height ? `${user.height} см` : 'Не указан'}
                </div>
              </div>
              <div className="details-item">
                <div className="details-label">Вес</div>
                <div className="details-value">
                  {user.weight ? `${user.weight} кг` : 'Не указан'}
                </div>
              </div>
              <div className="details-item">
                <div className="details-label">Хронические заболевания</div>
                <div className="details-value">
                  {user.has_chronic_diseases ? 'Имеются' : 'Отсутствуют'}
                </div>
              </div>
              {user.has_chronic_diseases && (
                <div className="details-item full-width">
                  <div className="details-label">Детали заболеваний</div>
                  <div className="details-value">
                    {user.chronic_diseases_details || 'Нет информации'}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {user.role === 'donor' && (
            <div className="user-details-section">
              <h4 className="section-title">Донации</h4>
              <div className="empty-section">
                <p>Информация о донациях будет доступна в будущих версиях.</p>
              </div>
            </div>
          )}
          
          {user.role === 'recipient' && (
            <div className="user-details-section">
              <h4 className="section-title">Запросы на донацию</h4>
              <div className="empty-section">
                <p>Информация о запросах будет доступна в будущих версиях.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;