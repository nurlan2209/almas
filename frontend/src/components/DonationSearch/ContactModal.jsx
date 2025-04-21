import React from 'react';
import './ContactModal.css';

const ContactModal = ({ person, onClose }) => {
  if (!person) return null;

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal">
        <div className="contact-modal-header">
          <h3>Байланыс ақпараты</h3>
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
                <span className="contact-detail-label">Қан тобы:</span>
                <span className="contact-detail-value">
                  {person.blood_type || 'Көрсетілмеген'} 
                  {person.rh_factor ? (person.rh_factor === 'positive' ? '(+)' : '(-)') : ''}
                </span>
              </div>
              <div className="contact-gender-info">
                <span className="contact-detail-label">Жынысы:</span>
                <span className="contact-detail-value">
                  {person.gender === 'male' ? 'Ер' : 'Әйел'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="contact-data">
            <div className="contact-section">
              <h4>Байланысу жолдары</h4>
              <div className="contact-data-row">
                <div className="contact-label">Email:</div>
                <div className="contact-value">{person.email || 'Көрсетілмеген'}</div>
              </div>
              <div className="contact-data-row">
                <div className="contact-label">Телефон:</div>
                <div className="contact-value">{person.phone_number || 'Көрсетілмеген'}</div>
              </div>
              <div className="contact-data-row">
                <div className="contact-label">Мекенжай:</div>
                <div className="contact-value">{person.address || 'Көрсетілмеген'}</div>
              </div>
            </div>
          </div>
          
          <div className="contact-actions">
            <p className="contact-note">
              {person.gender === 'male' ? 'Донормен' : 'Донормен'} байланысқанда өзіңізді таныстырып, 
              хабарласу мақсатыңызды түсіндіруді ұсынамыз. Сыпайы және құрметпен сөйлесіңіз.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Түсінікті</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;