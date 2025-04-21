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
    console.log('Updated user data:', formData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="profile-modal-overlay" onClick={(e) => {
      if (e.target.className === 'profile-modal-overlay') {
        onClose();
      }
    }}>
      <div className="profile-modal">
        <div className="profile-header">
          <h2>{user?.role === 'donor' ? 'Донор профилі' : 'Реципиент профилі'}</h2>
          <div className="header-buttons">
            <button 
              className="close-button" 
              onClick={onClose} 
              aria-label="Жабу"
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
            Жеке деректер
          </button>
          <button 
            className={`profile-tab ${activeTab === 'medical' ? 'active' : ''}`} 
            onClick={() => setActiveTab('medical')}
          >
            Медициналық деректер
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'personal' && (
            <>
              {!isEditing ? (
                <div className="profile-data">
                  <div className="profile-section">
                    <h3>Негізгі ақпарат</h3>
                    <div className="data-row">
                      <div className="data-label">ТАӘ:</div>
                      <div className="data-value">
                        {`${formData.last_name || ''} ${formData.first_name || ''} ${formData.patronymic || ''}`}
                      </div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">ЖСН:</div>
                      <div className="data-value">{formData.iin || 'Көрсетілмеген'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Туған күні:</div>
                      <div className="data-value">{formData.birth_date || 'Көрсетілмеген'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Жынысы:</div>
                      <div className="data-value">
                        {formData.gender === 'male' ? 'Ер' : 
                         formData.gender === 'female' ? 'Әйел' : 'Көрсетілмеген'}
                      </div>
                    </div>
                  </div>

                  <div className="profile-section">
                    <h3>Байланыс ақпараты</h3>
                    <div className="data-row">
                      <div className="data-label">Email:</div>
                      <div className="data-value">{formData.email || 'Көрсетілмеген'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Телефон:</div>
                      <div className="data-value">{formData.phone_number || 'Көрсетілмеген'}</div>
                    </div>
                    <div className="data-row">
                      <div className="data-label">Мекенжай:</div>
                      <div className="data-value">{formData.address || 'Көрсетілмеген'}</div>
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Өңдеу
                  </button>
                </div>
              ) : (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="profile-section">
                    <h3>Негізгі ақпарат</h3>
                    <div className="form-group">
                      <label htmlFor="last_name">Тегі</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="first_name">Аты</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="patronymic">Әкесінің аты</label>
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
                    <h3>Байланыс ақпараты</h3>
                    <div className="form-group">
                      <label htmlFor="phone_number">Телефон</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="address">Мекенжай</label>
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
                      Болдырмау
                    </button>
                    <button type="submit" className="btn btn-success">
                      Сақтау
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === 'medical' && (
            <div className="profile-data">
              <div className="profile-section">
                <h3>Медициналық деректер</h3>
                <div className="data-row">
                  <div className="data-label">Қан тобы:</div>
                  <div className="data-value">
                    {formData.blood_type ? 
                      `${formData.blood_type} ${formData.rh_factor === 'positive' ? '(+)' : '(-)'}` : 
                      'Көрсетілмеген'}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">Бойы:</div>
                  <div className="data-value">
                    {formData.height ? `${formData.height} см` : 'Көрсетілмеген'}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">Салмағы:</div>
                  <div className="data-value">
                    {formData.weight ? `${formData.weight} кг` : 'Көрсетілмеген'}
                  </div>
                </div>
                <div className="data-row">
                  <div className="data-label">Созылмалы аурулар:</div>
                  <div className="data-value">
                    {formData.has_chronic_diseases ? 'Бар' : 'Жоқ'}
                  </div>
                </div>
                {formData.has_chronic_diseases && (
                  <div className="data-row">
                    <div className="data-label">Созылмалы аурулар сипаттамасы:</div>
                    <div className="data-value">
                      {formData.chronic_diseases_details || 'Көрсетілмеген'}
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Өңдеу
              </button>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="profile-data">
              <div className="profile-section">
                <h3>{user?.role === 'donor' ? 'Донациялар тарихы' : 'Донацияға сұраныстар тарихы'}</h3>
                {user?.role === 'donor' ? (
                  formData.donations && formData.donations.length > 0 ? (
                    <table className="donations-table">
                      <thead>
                        <tr>
                          <th>Күні</th>
                          <th>Донация түрі</th>
                          <th>Донорлық орталық</th>
                          <th>Күйі</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.donations && formData.donations.map((donation, index) => (
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
                    <p className="no-data">Сізде әлі тіркелген донациялар жоқ.</p>
                  )
                ) : (
                  formData.requests && formData.requests.length > 0 ? (
                    <table className="donations-table">
                      <thead>
                        <tr>
                          <th>Күні</th>
                          <th>Қан тобы</th>
                          <th>Шұғылдығы</th>
                          <th>Күйі</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.requests && formData.requests.map((request, index) => (
                          <tr key={index}>
                            <td>{request.date}</td>
                            <td>{request.blood_type}</td>
                            <td>{request.urgency}</td>
                            <td>{request.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-data">Сізде әлі тіркелген сұраныстар жоқ.</p>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;