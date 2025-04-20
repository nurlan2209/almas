// src/components/UserMenu/UserProfile.jsx
import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика сохранения изменений
    console.log('Updated user data:', formData);
    setIsEditing(false);
    // Обновление данных пользователя в родительском компоненте
  };

  const cancelEdit = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="profile-modal-overlay" onClick={(e) => {
      // Закрываем модальное окно при клике на оверлей
      if (e.target.className === 'profile-modal-overlay') {
        onClose();
      }
    }}>
      <div className="profile-modal">
        <div className="profile-header">
          <h2>Профиль донора</h2>
          <div className="header-buttons">
            <button 
              className="close-button" 
              onClick={onClose} 
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`} 
            onClick={() => setActiveTab('personal')}
          >
            Личные данные
          </button>
          <button 
            className={`profile-tab ${activeTab === 'medical' ? 'active' : ''}`} 
            onClick={() => setActiveTab('medical')}
          >
            Медицинские данные
          </button>
          <button 
            className={`profile-tab ${activeTab === 'donations' ? 'active' : ''}`} 
            onClick={() => setActiveTab('donations')}
          >
            История донаций
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'personal' && (
            <>
              {!isEditing ? (
                <div className="profile-data">
                  <div className="profile-section">
                    <h3>Основная информация</h3>
                    <div className="data-row">
                      <div className="data-label">ФИО:</div>
                      <div className="data-value">
                        {`${formData.lastName || ''} ${formData.firstName || ''} ${formData.patronymic || ''}`}
                      </div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">ИИН:</div>
                      <div className="data-value">{formData.iin || 'Не указан'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Дата рождения:</div>
                      <div className="data-value">{formData.birthDate || 'Не указана'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Пол:</div>
                      <div className="data-value">
                        {formData.gender === 'male' ? 'Мужской' : 
                         formData.gender === 'female' ? 'Женский' : 'Не указан'}
                      </div>
                    </div>
                  </div>

                  <div className="profile-section">
                    <h3>Контактная информация</h3>
                    <div className="data-row">
                      <div className="data-label">Email:</div>
                      <div className="data-value">{formData.email || 'Не указан'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Телефон:</div>
                      <div className="data-value">{formData.phoneNumber || 'Не указан'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Адрес:</div>
                      <div className="data-value">{formData.address || 'Не указан'}</div>
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Редактировать
                  </button>
                </div>
              ) : (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="profile-section">
                    <h3>Основная информация</h3>
                    <div className="form-group">
                      <label htmlFor="lastName">Фамилия</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="firstName">Имя</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="patronymic">Отчество</label>
                      <input
                        type="text"
                        id="patronymic"
                        name="patronymic"
                        value={formData.patronymic || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-section">
                    <h3>Контактная информация</h3>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Телефон</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="address">Адрес</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                      Отмена
                    </button>
                    <button type="submit" className="btn btn-success">
                      Сохранить
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === 'medical' && (
            <div className="profile-data">
              <div className="profile-section">
                <h3>Медицинские данные</h3>
                <div className="data-row">
                  <div className="data-label">Группа крови:</div>
                  <div className="data-value">
                    {formData.bloodType ? 
                      `${formData.bloodType} ${formData.rhFactor === 'positive' ? '(+)' : '(-)'}` : 
                      'Не указана'}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">Рост:</div>
                  <div className="data-value">
                    {formData.height ? `${formData.height} см` : 'Не указан'}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">Вес:</div>
                  <div className="data-value">
                    {formData.weight ? `${formData.weight} кг` : 'Не указан'}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">Хронические заболевания:</div>
                  <div className="data-value">
                    {formData.hasChronicDiseases ? 'Имеются' : 'Отсутствуют'}
                  </div>
                </div>
                {formData.hasChronicDiseases && (
                  <div className="data-row">
                    <div className="data-label">Описание хронических заболеваний:</div>
                    <div className="data-value">
                      {formData.chronicDiseasesDetails || 'Не указано'}
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Редактировать
              </button>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="profile-data">
              <div className="profile-section">
                <h3>История донаций</h3>
                {formData.donations && formData.donations.length > 0 ? (
                  <table className="donations-table">
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Тип донации</th>
                        <th>Центр донорства</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.donations.map((donation, index) => (
                        <tr key={index}>
                          <td>{donation.date}</td>
                          <td>{donation.type}</td>
                          <td>{donation.center}</td>
                          <td>{donation.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">У вас пока нет зарегистрированных донаций.</p>
                )}
              </div>

              <button className="btn btn-primary">
                Записаться на донацию
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;