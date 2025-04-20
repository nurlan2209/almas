// src/components/DonationSearch/ContactModal.jsx
import React from 'react';
import './ContactModal.css';

const ContactModal = ({ person, onClose }) => {
  if (!person) return null;

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal">
        <div className="contact-modal-header">
          <h3>Контактная информация</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="contact-modal-content">
          <div className="contact-person-info">
            <div className="contact-person-avatar">
              {person.first_name ? person.first_name.charAt(0) : '?'}
            </div>
            <div className="contact-person-details">
              <h4 className="contact-person-name">
                {person.last_name} {person.first_name} {person.patronymic}
              </h4>
              <div className="contact-blood-info">
                <span className="contact-detail-label">Группа крови:</span>
                <span className="contact-detail-value">
                  {person.blood_type || 'Не указана'} 
                  {person.rh_factor ? (person.rh_factor === 'positive' ? '(+)' : '(-)') : ''}
                </span>
              </div>
              <div className="contact-gender-info">
                <span className="contact-detail-label">Пол:</span>
                <span className="contact-detail-value">
                  {person.gender === 'male' ? 'Мужской' : 'Женский'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="contact-data">
            <div className="contact-section">
              <h4>Как связаться</h4>
              <div className="contact-data-row">
                <div className="contact-label">Email:</div>
                <div className="contact-value">{person.email || 'Не указан'}</div>
              </div>
              <div className="contact-data-row">
                <div className="contact-label">Телефон:</div>
                <div className="contact-value">{person.phone_number || 'Не указан'}</div>
              </div>
              <div className="contact-data-row">
                <div className="contact-label">Адрес:</div>
                <div className="contact-value">{person.address || 'Не указан'}</div>
              </div>
            </div>
          </div>
          
          <div className="contact-actions">
            <p className="contact-note">
              При связи с {person.gender === 'male' ? 'донором' : 'донором'} рекомендуем представиться и 
              объяснить цель вашего обращения. Пожалуйста, будьте вежливы и уважительны.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Понятно</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;