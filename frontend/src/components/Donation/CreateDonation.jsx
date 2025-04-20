import React, { useState, useEffect } from 'react';
import { donationsAPI, donationCentersAPI } from '../../services/apiService';
import { useAuth } from '../../services/authService';
import './Donation.css';

const CreateDonation = ({ requestId = null, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [donationCenters, setDonationCenters] = useState([]);
  const [formData, setFormData] = useState({
    blood_type: user?.blood_type || '',
    rh_factor: user?.rh_factor || '',
    quantity: 450, // По умолчанию 450 мл
    donation_date: '', // Дата в формате YYYY-MM-DD
    donation_center_id: '',
    request_id: requestId || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка списка центров донации
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await donationCentersAPI.getCenters();
        setDonationCenters(response.centers || []);
      } catch (error) {
        console.error('Error fetching donation centers:', error);
        setErrors(prev => ({
          ...prev,
          general: 'Не удалось загрузить список центров донации'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Для числовых полей преобразуем значение в число
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Очищаем ошибку поля при изменении значения
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.blood_type) {
      newErrors.blood_type = 'Выберите группу крови';
    }
    
    if (!formData.rh_factor) {
      newErrors.rh_factor = 'Выберите резус-фактор';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Укажите количество крови';
    }
    
    if (!formData.donation_date) {
      newErrors.donation_date = 'Выберите дату донации';
    } else {
      // Проверяем, что дата не в прошлом
      const selectedDate = new Date(formData.donation_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Сбрасываем время
      
      if (selectedDate < today) {
        newErrors.donation_date = 'Дата донации не может быть в прошлом';
      }
    }
    
    if (!formData.donation_center_id) {
      newErrors.donation_center_id = 'Выберите центр донации';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      // Отправляем запрос на создание донации
      const response = await donationsAPI.createDonation(formData);
      
      // Вызываем колбэк успешного создания
      onSuccess(response.donation);
    } catch (error) {
      console.error('Failed to create donation:', error);
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Не удалось создать донацию. Попробуйте позже.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если данные еще загружаются
  if (isLoading) {
    return (
      <div className="donation-form-container loading">
        <div className="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="donation-form-container">
      <h2>Запись на донацию</h2>
      
      {errors.general && (
        <div className="error-message general-error">
          {errors.general}
        </div>
      )}
      
      <form className="donation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="blood_type">Группа крови*</label>
          <select
            id="blood_type"
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            className={errors.blood_type ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Выберите группу крови</option>
            <option value="I">I (O)</option>
            <option value="II">II (A)</option>
            <option value="III">III (B)</option>
            <option value="IV">IV (AB)</option>
          </select>
          {errors.blood_type && <div className="error-message">{errors.blood_type}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="rh_factor">Резус-фактор*</label>
          <select
            id="rh_factor"
            name="rh_factor"
            value={formData.rh_factor}
            onChange={handleChange}
            className={errors.rh_factor ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Выберите резус-фактор</option>
            <option value="positive">Положительный (+)</option>
            <option value="negative">Отрицательный (-)</option>
          </select>
          {errors.rh_factor && <div className="error-message">{errors.rh_factor}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Количество крови (мл)*</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="100"
            max="550"
            className={errors.quantity ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.quantity && <div className="error-message">{errors.quantity}</div>}
          <small className="form-helper-text">Стандартная доза цельной крови - 450 мл</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="donation_date">Дата донации*</label>
          <input
            type="date"
            id="donation_date"
            name="donation_date"
            value={formData.donation_date}
            onChange={handleChange}
            className={errors.donation_date ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.donation_date && <div className="error-message">{errors.donation_date}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="donation_center_id">Центр донации*</label>
          <select
            id="donation_center_id"
            name="donation_center_id"
            value={formData.donation_center_id}
            onChange={handleChange}
            className={errors.donation_center_id ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Выберите центр донации</option>
            {donationCenters.map(center => (
              <option key={center.id} value={center.id}>
                {center.name} - {center.address}
              </option>
            ))}
          </select>
          {errors.donation_center_id && <div className="error-message">{errors.donation_center_id}</div>}
        </div>
        
        {/* Поле для привязки к запросу (если requestId не передан) */}
        {!requestId && (
          <div className="form-group">
            <label htmlFor="request_id">ID запроса на донацию (необязательно)</label>
            <input
              type="text"
              id="request_id"
              name="request_id"
              value={formData.request_id}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Введите ID запроса, если хотите помочь конкретному реципиенту"
            />
            <small className="form-helper-text">ID запроса можно узнать у реципиента или в списке активных запросов</small>
          </div>
        )}
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Запись...' : 'Записаться на донацию'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonation;