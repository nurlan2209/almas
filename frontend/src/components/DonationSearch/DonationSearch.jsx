import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authService';
import { usersAPI, donationRequestsAPI } from '../../services/apiService';
import ContactModal from './ContactModal';
import './DonationSearch.css';

// Компонент для поиска доноров или реципиентов в зависимости от роли пользователя
const DonationSearch = ({ onRespondToRequest }) => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    blood_type: '',
    rh_factor: '',
  });
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Определяем, кого ищем в зависимости от роли пользователя
  const isSearchingDonors = user?.role === 'recipient';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // В зависимости от роли пользователя загружаем доноров или реципиентов
        if (isSearchingDonors) {
          // Реципиент ищет доноров
          const response = await usersAPI.getDonors(filters);
          setSearchResults(response.donors || []);
          
          // Также загружаем активные запросы пользователя
          const requestsResponse = await donationRequestsAPI.getMyRequests({
            status: 'pending'
          });
          setRequests(requestsResponse.requests || []);
        } else {
          // Донор ищет реципиентов
          const response = await usersAPI.getRecipients(filters);
          setSearchResults(response.recipients || []);
          
          // Также загружаем активные запросы на донацию
          const requestsResponse = await donationRequestsAPI.getRequests({
            status: 'pending',
            blood_type: user?.blood_type,
            rh_factor: user?.rh_factor
          });
          setRequests(requestsResponse.requests || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, filters, isSearchingDonors]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactPerson = (person) => {
    setSelectedPerson(person);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedPerson(null);
  };

  // Если пользователь не авторизован или данные еще загружаются
  if (!user || loading) {
    return (
      <div className="donation-search loading">
        <div className="spinner"></div>
        <p>Деректер жүктелуде...</p>
      </div>
    );
  }

  return (
    <div className="donation-search">
      <div className="donation-search-header">
        <h2>
          {isSearchingDonors ? 'Донорларды іздеу' : 'Донорлыққа мұқтаж жандар'}
        </h2>
        
        <div className="donation-search-filters">
          <div className="filter-group">
            <label htmlFor="blood_type">Қан тобы:</label>
            <select
              id="blood_type"
              name="blood_type"
              value={filters.blood_type}
              onChange={handleFilterChange}
            >
              <option value="">Барлығы</option>
              <option value="I">I (O)</option>
              <option value="II">II (A)</option>
              <option value="III">III (B)</option>
              <option value="IV">IV (AB)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="rh_factor">Резус-фактор:</label>
            <select
              id="rh_factor"
              name="rh_factor"
              value={filters.rh_factor}
              onChange={handleFilterChange}
            >
              <option value="">Барлығы</option>
              <option value="positive">Оң (+)</option>
              <option value="negative">Теріс (-)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Активные запросы */}
      {requests.length > 0 && (
        <div className="active-requests">
          <h3>Донацияға белсенді сұраныстар</h3>
          <div className="requests-list">
            {requests.map(request => (
              <div className="request-card" key={request.id}>
                <div className="request-info">
                  <div className="request-header">
                    <span className={`urgency-badge ${request.urgency_level}`}>
                      {request.urgency_level === 'low' && 'Төмен басымдық'}
                      {request.urgency_level === 'medium' && 'Орташа басымдық'}
                      {request.urgency_level === 'high' && 'Жоғары басымдық'}
                      {request.urgency_level === 'critical' && 'Сын басымдық'}
                    </span>
                    <span className="blood-info">
                      Қан тобы: {request.blood_type} {request.rh_factor === 'positive' ? '(+)' : '(-)'}
                    </span>
                  </div>
                  
                  <p className="request-description">
                    {request.description || 'Донорлық қан қажет'}
                  </p>
                  
                  {request.hospital_name && (
                    <p className="request-hospital">
                      Медициналық мекеме: {request.hospital_name}
                    </p>
                  )}
                  
                  {request.hospital_address && (
                    <p className="request-address">
                      Мекенжай: {request.hospital_address}
                    </p>
                  )}
                </div>
                
                {!isSearchingDonors && (
                  <div className="request-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => onRespondToRequest(request.id)}
                    >
                      Жауап беру
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Результаты поиска */}
      <div className="search-results">
        <h3>
          {isSearchingDonors ? 'Қолжетімді донорлар' : 'Донорлыққа мұқтаж жандар'}
        </h3>
        
        {searchResults.length === 0 ? (
          <div className="no-results">
            <p>Сіздің сұранысыңыз бойынша ештеңе табылмады</p>
          </div>
        ) : (
          <div className="results-list">
            {searchResults.map(person => (
              <div className="person-card" key={person.id}>
                <div className="person-avatar">
                  {person.first_name ? person.first_name.charAt(0) : '?'}
                </div>
                
                <div className="person-info">
                  <h4 className="person-name">
                    {person.last_name} {person.first_name} {person.patronymic}
                  </h4>
                  
                  <div className="person-details">
                    <span className="blood-info">
                      Қан тобы: {person.blood_type || 'Көрсетілмеген'} 
                      {person.rh_factor ? (person.rh_factor === 'positive' ? '(+)' : '(-)') : ''}
                    </span>
                    
                    <span className="gender-info">
                      Жынысы: {person.gender === 'male' ? 'Ер' : 'Әйел'}
                    </span>
                  </div>
                </div>
                
                <div className="person-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => handleContactPerson(person)}
                  >
                    Байланысу
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Модальное окно с контактами */}
      {showContactModal && (
        <ContactModal
          person={selectedPerson}
          onClose={closeContactModal}
        />
      )}
    </div>
  );
};

export default DonationSearch;