import React, { useState } from 'react';
import { donationRequestsAPI } from '../../services/apiService';
import { useAuth } from '../../services/authService';
import './DonationRequest.css';

const CreateDonationRequest = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    blood_type: user?.blood_type || '',
    rh_factor: user?.rh_factor || '',
    quantity_needed: 450, // По умолчанию 450 мл
    urgency_level: 'medium',
    hospital_name: '',
    hospital_address: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!formData.quantity_needed || formData.quantity_needed <= 0) {
      newErrors.quantity_needed = 'Укажите необходимое количество крови';
    }
    
    if (!formData.urgency_level) {
      newErrors.urgency_level = 'Выберите уровень срочности';
    }
    
    if (!formData.description) {
      newErrors.description = 'Добавьте описание вашего запроса';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      // Отправляем запрос на создание запроса на донацию
      const response = await donationRequestsAPI.createRequest(formData);
      
      // Вызываем колбэк успешного создания
      onSuccess(response.request);
    } catch (error) {
      console.error('Failed to create donation request:', error);
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Не удалось создать запрос. Попробуйте позже.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donation-request-form-container">
      <h2>Создание запроса на донацию</h2>
      
      {errors.general && (
        <div className="error-message general-error">
          {errors.general}
        </div>
      )}
      
      <form className="donation-request-form" onSubmit={handleSubmit}>
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
          <label htmlFor="quantity_needed">Необходимое количество (мл)*</label>
          <input
            type="number"
            id="quantity_needed"
            name="quantity_needed"
            value={formData.quantity_needed}
            onChange={handleChange}
            min="100"
            max="2000"
            className={errors.quantity_needed ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.quantity_needed && <div className="error-message">{errors.quantity_needed}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="urgency_level">Уровень срочности*</label>
          <select
            id="urgency_level"
            name="urgency_level"
            value={formData.urgency_level}
            onChange={handleChange}
            className={errors.urgency_level ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="critical">Критический</option>
          </select>
          {errors.urgency_level && <div className="error-message">{errors.urgency_level}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="hospital_name">Название медицинского учреждения</label>
          <input
            type="text"
            id="hospital_name"
            name="hospital_name"
            value={formData.hospital_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hospital_address">Адрес медицинского учреждения</label>
          <input
            type="text"
            id="hospital_address"
            name="hospital_address"
            value={formData.hospital_address}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Описание запроса*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            disabled={isSubmitting}
            placeholder="Укажите причину запроса и другую важную информацию"
            rows="4"
          ></textarea>
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
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
            {isSubmitting ? 'Создание...' : 'Создать запрос'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;