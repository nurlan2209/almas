import React, { useState } from 'react';
import './RegisterForm.css';
import { useAuth } from '../../services/authService';

const RegisterForm = ({ onClose, onError }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    iin: '',
    birthDate: '',
    gender: '',
    role: '',
    bloodType: '',
    rhFactor: '',
    height: '',
    weight: '',
    phoneNumber: '',
    address: '',
    hasChronicDiseases: false,
    chronicDiseasesDetails: '',
    hasMedicalConditions: false,
    medicalConditionsDetails: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.email) newErrors.email = 'Введите email';
      if (!formData.password) newErrors.password = 'Введите пароль';
      else if (formData.password.length < 6) newErrors.password = 'Пароль должен содержать минимум 6 символов';
      if (formData.password !== formData.confirmPassword) 
        newErrors.confirmPassword = 'Пароли не совпадают';
      if (!formData.role) newErrors.role = 'Выберите вашу роль';
    } else if (stepNumber === 2) {
      if (!formData.firstName) newErrors.firstName = 'Введите имя';
      if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
      if (!formData.iin) newErrors.iin = 'Введите ИИН';
      else if (formData.iin.length !== 12 || !/^\d+$/.test(formData.iin)) 
        newErrors.iin = 'ИИН должен содержать 12 цифр';
      if (!formData.birthDate) newErrors.birthDate = 'Выберите дату рождения';
      if (!formData.gender) newErrors.gender = 'Выберите пол';
    } else if (stepNumber === 3) {
      if (!formData.bloodType) newErrors.bloodType = 'Выберите группу крови';
      if (!formData.rhFactor) newErrors.rhFactor = 'Выберите резус-фактор';
    } else if (stepNumber === 4) {
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Введите номер телефона';
      else if (!/^\+7 \d{3} \d{3} \d{4}$/.test(formData.phoneNumber)) 
        newErrors.phoneNumber = 'Номер телефона должен быть в формате +7 777 777 7777';          
      if (!formData.address) newErrors.address = 'Введите адрес';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'Необходимо согласие на обработку персональных данных';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    try {
      setIsSubmitting(true);
      const userData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        patronymic: formData.patronymic || null,
        iin: formData.iin,
        birth_date: formData.birthDate,
        gender: formData.gender,
        role: formData.role,
        blood_type: formData.bloodType,
        rh_factor: formData.rhFactor,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null,
        phone_number: formData.phoneNumber,
        address: formData.address,
        has_chronic_diseases: formData.hasChronicDiseases,
        chronic_diseases_details: formData.chronicDiseasesDetails || null
      };
      
      console.log('Sending userData:', userData);
      const result = await register(userData);
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ server: result.error });  // Сохраняем ошибку сервера
      }
    } catch (error) {
      setErrors({ server: error.message || 'Ошибка при регистрации' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {step === 1 && (
        <div className="form-step">
          <h3>Шаг 1: Учетные данные</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтверждение пароля*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-group">
            <label>Выберите роль*</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="donor"
                  checked={formData.role === 'donor'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Я хочу стать донором
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="recipient"
                  checked={formData.role === 'recipient'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Я нуждаюсь в донорской крови
              </label>
            </div>
            {errors.role && <div className="error-message">{errors.role}</div>}
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn btn-primary" onClick={nextStep} disabled={isSubmitting}>
              Далее
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="form-step">
          <h3>Шаг 2: Личные данные</h3>
          
          <div className="form-group">
            <label htmlFor="lastName">Фамилия*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="firstName">Имя*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="patronymic">Отчество</label>
            <input
              type="text"
              id="patronymic"
              name="patronymic"
              value={formData.patronymic}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="iin">ИИН*</label>
            <input
              type="text"
              id="iin"
              name="iin"
              maxLength="12"
              value={formData.iin}
              onChange={handleChange}
              className={errors.iin ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.iin && <div className="error-message">{errors.iin}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения*</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={errors.birthDate ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.birthDate && <div className="error-message">{errors.birthDate}</div>}
          </div>
          
          <div className="form-group">
            <label>Пол*</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Мужской
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Женский
              </label>
            </div>
            {errors.gender && <div className="error-message">{errors.gender}</div>}
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={isSubmitting}>
              Назад
            </button>
            <button type="button" className="btn btn-primary" onClick={nextStep} disabled={isSubmitting}>
              Далее
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="form-step">
          <h3>Шаг 3: Медицинские данные</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodType">Группа крови*</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className={errors.bloodType ? 'error' : ''}
                disabled={isSubmitting}
              >
                <option value="">Выберите</option>
                <option value="I">I (O)</option>
                <option value="II">II (A)</option>
                <option value="III">III (B)</option>
                <option value="IV">IV (AB)</option>
              </select>
              {errors.bloodType && <div className="error-message">{errors.bloodType}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="rhFactor">Резус-фактор*</label>
              <select
                id="rhFactor"
                name="rhFactor"
                value={formData.rhFactor}
                onChange={handleChange}
                className={errors.rhFactor ? 'error' : ''}
                disabled={isSubmitting}
              >
                <option value="">Выберите</option>
                <option value="positive">Положительный (+)</option>
                <option value="negative">Отрицательный (-)</option>
              </select>
              {errors.rhFactor && <div className="error-message">{errors.rhFactor}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Рост (см)</label>
              <input
                type="number"
                id="height"
                name="height"
                min="100"
                max="250"
                value={formData.height}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight">Вес (кг)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="40"
                max="200"
                value={formData.weight}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="hasChronicDiseases"
                checked={formData.hasChronicDiseases}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Наличие хронических заболеваний
            </label>
          </div>
          
          {formData.hasChronicDiseases && (
            <div className="form-group">
              <label htmlFor="chronicDiseasesDetails">Опишите имеющиеся хронические заболевания</label>
              <textarea
                id="chronicDiseasesDetails"
                name="chronicDiseasesDetails"
                value={formData.chronicDiseasesDetails}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
            </div>
          )}
          
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={isSubmitting}>
              Назад
            </button>
            <button type="button" className="btn btn-primary" onClick={nextStep} disabled={isSubmitting}>
              Далее
            </button>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="form-step">
          <h3>Шаг 4: Контактная информация</h3>
          {errors.server && <div className="error-message">{errors.server}</div>} {/* Отображение ошибки */}
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Номер телефона*</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Адрес*</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              disabled={isSubmitting}
            ></textarea>
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>
          
          <div className="form-group checkbox-group">
            <label className={errors.agreeTerms ? 'error' : ''}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Я согласен на обработку персональных данных*
            </label>
            {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={isSubmitting}>
              Назад
            </button>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;