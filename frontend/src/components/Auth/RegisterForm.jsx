import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    iin: '', // ИИН
    birthDate: '',
    gender: '',
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
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.email) newErrors.email = 'Введите email';
      if (!formData.password) newErrors.password = 'Введите пароль';
      if (formData.password !== formData.confirmPassword) 
        newErrors.confirmPassword = 'Пароли не совпадают';
    } else if (stepNumber === 2) {
      if (!formData.firstName) newErrors.firstName = 'Введите имя';
      if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
      if (!formData.iin) newErrors.iin = 'Введите ИИН';
      else if (formData.iin.length !== 12 || !/^\d+$/.test(formData.iin)) 
        newErrors.iin = 'ИИН должен содержать 12 цифр';
      if (!formData.birthDate) newErrors.birthDate = 'Выберите дату рождения';
      if (!formData.gender) newErrors.gender = 'Выберите пол';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      // Здесь будет отправка данных на сервер
      console.log('Form data submitted:', formData);
      alert('Регистрация выполнена успешно!');
      onClose();
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
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn btn-primary" onClick={nextStep}>
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
                />
                Женский
              </label>
            </div>
            {errors.gender && <div className="error-message">{errors.gender}</div>}
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={prevStep}>
              Назад
            </button>
            <button type="button" className="btn btn-primary" onClick={nextStep}>
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
              <label htmlFor="bloodType">Группа крови</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">Выберите</option>
                <option value="I">I (O)</option>
                <option value="II">II (A)</option>
                <option value="III">III (B)</option>
                <option value="IV">IV (AB)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="rhFactor">Резус-фактор</label>
              <select
                id="rhFactor"
                name="rhFactor"
                value={formData.rhFactor}
                onChange={handleChange}
              >
                <option value="">Выберите</option>
                <option value="positive">Положительный (+)</option>
                <option value="negative">Отрицательный (-)</option>
              </select>
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
              ></textarea>
            </div>
          )}
          
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={prevStep}>
              Назад
            </button>
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Далее
            </button>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="form-step">
          <h3>Шаг 4: Контактная информация</h3>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Номер телефона</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Адрес</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                required
              />
              Я согласен на обработку персональных данных
            </label>
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={prevStep}>
              Назад
            </button>
            <button type="submit" className="btn btn-success">
              Зарегистрироваться
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;