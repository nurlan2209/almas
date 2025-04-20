import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserForm = ({ isEditing = false, onSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    patronymic: '',
    role: 'donor',
    iin: '',
    birth_date: '',
    gender: 'male',
    phone_number: '',
    address: '',
    blood_type: '',
    rh_factor: '',
    height: '',
    weight: '',
    has_chronic_diseases: false,
    chronic_diseases_details: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Если это форма редактирования, загружаем данные пользователя
  useEffect(() => {
    if (isEditing && id) {
      fetchUserData(id);
    }
  }, [isEditing, id]);
  
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
      
      // Обновляем состояние формы
      setFormData({
        email: data.user.email || '',
        password: '', // Пароль не передается в ответе API
        first_name: data.user.first_name || '',
        last_name: data.user.last_name || '',
        patronymic: data.user.patronymic || '',
        role: data.user.role || 'donor',
        iin: data.user.iin || '',
        birth_date: data.user.birth_date || '',
        gender: data.user.gender || 'male',
        phone_number: data.user.phone_number || '',
        address: data.user.address || '',
        blood_type: data.user.blood_type || '',
        rh_factor: data.user.rh_factor || '',
        height: data.user.height || '',
        weight: data.user.weight || '',
        has_chronic_diseases: data.user.has_chronic_diseases || false,
        chronic_diseases_details: data.user.chronic_diseases_details || ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err.message || 'Не удалось загрузить данные пользователя');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку для этого поля
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Валидация формы
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }
    
    if (!isEditing && !formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (!isEditing && formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!formData.first_name) {
      errors.first_name = 'Имя обязательно';
    }
    
    if (!formData.last_name) {
      errors.last_name = 'Фамилия обязательна';
    }
    
    if (!formData.role) {
      errors.role = 'Роль обязательна';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Требуется авторизация');
      }
      
      // Формирование данных для отправки
      const userData = { ...formData };
      
      // Если пароль пустой и это форма редактирования, удаляем его из данных
      if (isEditing && !userData.password) {
        delete userData.password;
      }
      
      // URL и метод запроса в зависимости от типа формы
      const url = isEditing
        ? `http://localhost:5000/api/admin/users/${id}`
        : 'http://localhost:5000/api/admin/users';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Отправка запроса к API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка запроса: ${response.status}`);
      }
      
      // Если запрос выполнен успешно
      alert(isEditing ? 'Пользователь успешно обновлен' : 'Пользователь успешно создан');
      
      // Вызываем колбэк успешного завершения
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to save user:', err);
      setError(err.message || 'Не удалось сохранить пользователя');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик отмены
  const handleCancel = () => {
    navigate('/admin/users');
  };
  
  if (loading && isEditing) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }
  
  return (
    <div className="user-form-container">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          {isEditing ? 'Редактирование пользователя' : 'Создание пользователя'}
        </h2>
      </div>
      
      <div className="admin-card">
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {formErrors.email && <div className="field-error">{formErrors.email}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="password">
                {isEditing ? 'Пароль (оставьте пустым, чтобы не менять)' : 'Пароль*'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required={!isEditing}
              />
              {formErrors.password && <div className="field-error">{formErrors.password}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="last_name">Фамилия*</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {formErrors.last_name && <div className="field-error">{formErrors.last_name}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="first_name">Имя*</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {formErrors.first_name && <div className="field-error">{formErrors.first_name}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="patronymic">Отчество</label>
              <input
                type="text"
                id="patronymic"
                name="patronymic"
                value={formData.patronymic}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="role">Роль*</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="donor">Донор</option>
                <option value="recipient">Реципиент</option>
                <option value="admin">Администратор</option>
              </select>
              {formErrors.role && <div className="field-error">{formErrors.role}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="gender">Пол</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="birth_date">Дата рождения</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="iin">ИИН</label>
              <input
                type="text"
                id="iin"
                name="iin"
                value={formData.iin}
                onChange={handleChange}
                disabled={loading}
                maxLength="12"
              />
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="phone_number">Телефон</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="address">Адрес</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-section-title">Медицинская информация</div>
          
          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="blood_type">Группа крови</label>
              <select
                id="blood_type"
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Не указано</option>
                <option value="I">I (0)</option>
                <option value="II">II (A)</option>
                <option value="III">III (B)</option>
                <option value="IV">IV (AB)</option>
              </select>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="rh_factor">Резус-фактор</label>
              <select
                id="rh_factor"
                name="rh_factor"
                value={formData.rh_factor}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Не указано</option>
                <option value="positive">Положительный (+)</option>
                <option value="negative">Отрицательный (-)</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="height">Рост (см)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                disabled={loading}
                min="0"
                max="300"
              />
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="weight">Вес (кг)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                disabled={loading}
                min="0"
                max="300"
              />
            </div>
          </div>
          
          <div className="admin-form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="has_chronic_diseases"
                checked={formData.has_chronic_diseases}
                onChange={handleChange}
                disabled={loading}
              />
              Наличие хронических заболеваний
            </label>
          </div>
          
          {formData.has_chronic_diseases && (
            <div className="admin-form-group">
              <label htmlFor="chronic_diseases_details">Детали хронических заболеваний</label>
              <textarea
                id="chronic_diseases_details"
                name="chronic_diseases_details"
                value={formData.chronic_diseases_details}
                onChange={handleChange}
                disabled={loading}
                rows="3"
              ></textarea>
            </div>
          )}
          
          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : (isEditing ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;