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
  
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Авторизация қажет');
      }
      
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Сұраныс қатесі: ${response.status}`);
      }
      
      const data = await response.json();
      setUser(data.user);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err.message || 'Пайдаланушы деректерін жүктеу мүмкін болмады');
    } finally {
      setLoading(false);
    }
  };
  
  const getUserRole = (role) => {
    switch (role) {
      case 'donor':
        return 'Донор';
      case 'recipient':
        return 'Реципиент';
      case 'admin':
        return 'Әкімші';
      default:
        return role;
    }
  };
  
  const getGender = (gender) => {
    switch (gender) {
      case 'male':
        return 'Ер';
      case 'female':
        return 'Әйел';
      default:
        return 'Белгіленбеген';
    }
  };
  
  const getRhFactor = (rh) => {
    switch (rh) {
      case 'positive':
        return 'Оң (+)';
      case 'negative':
        return 'Теріс (-)';
      default:
        return 'Белгіленбеген';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Белгіленбеген';
    const date = new Date(dateString);
    return date.toLocaleDateString('kk-KZ');
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Пайдаланушы деректерін жүктеу...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error">
        <h2>Деректерді жүктеу қатесі</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Қайталап көру
        </button>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="admin-error">
        <h2>Пайдаланушы табылмады</h2>
        <button 
          onClick={onBack} 
          className="btn btn-primary"
        >
          Тізімге оралу
        </button>
      </div>
    );
  }
  
  return (
    <div className="user-details">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Пайдаланушы туралы ақпарат</h2>
        <div className="admin-header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            Өңдеу
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onBack}
          >
            Артқа
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
            <h4 className="section-title">Негізгі ақпарат</h4>
            <div className="details-grid">
              <div className="details-item">
                <div className="details-label">Email</div>
                <div className="details-value">{user.email || 'Белгіленбеген'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Телефон</div>
                <div className="details-value">{user.phone_number || 'Белгіленбеген'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Туған күні</div>
                <div className="details-value">{formatDate(user.birth_date)}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Жыныс</div>
                <div className="details-value">{getGender(user.gender)}</div>
              </div>
              <div className="details-item">
                <div className="details-label">ЖСН</div>
                <div className="details-value">{user.iin || 'Белгіленбеген'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Мекенжай</div>
                <div className="details-value">{user.address || 'Белгіленбеген'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Тіркелген күні</div>
                <div className="details-value">{formatDate(user.created_at)}</div>
              </div>
            </div>
          </div>
          
          <div className="user-details-section">
            <h4 className="section-title">Медициналық ақпарат</h4>
            <div className="details-grid">
              <div className="details-item">
                <div className="details-label">Қан тобы</div>
                <div className="details-value">{user.blood_type || 'Белгіленбеген'}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Резус-фактор</div>
                <div className="details-value">{getRhFactor(user.rh_factor)}</div>
              </div>
              <div className="details-item">
                <div className="details-label">Бойы</div>
                <div className="details-value">
                  {user.height ? `${user.height} см` : 'Белгіленбеген'}
                </div>
              </div>
              <div className="details-item">
                <div className="details-label">Салмағы</div>
                <div className="details-value">
                  {user.weight ? `${user.weight} кг` : 'Белгіленбеген'}
                </div>
              </div>
              <div className="details-item">
                <div className="details-label">Созылмалы аурулар</div>
                <div className="details-value">
                  {user.has_chronic_diseases ? 'Бар' : 'Жоқ'}
                </div>
              </div>
              {user.has_chronic_diseases && (
                <div className="details-item full-width">
                  <div className="details-label">Аурулар туралы мәлімет</div>
                  <div className="details-value">
                    {user.chronic_diseases_details || 'Ақпарат жоқ'}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {user.role === 'donor' && (
            <div className="user-details-section">
              <h4 className="section-title">Донорлық</h4>
              <div className="empty-section">
                <p>Донорлық туралы ақпарат келесі нұсқаларда қолжетімді болады.</p>
              </div>
            </div>
          )}
          
          {user.role === 'recipient' && (
            <div className="user-details-section">
              <h4 className="section-title">Донорлыққа сұраныстар</h4>
              <div className="empty-section">
                <p>Сұраныстар туралы ақпарат келесі нұсқаларда қолжетімді болады.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;