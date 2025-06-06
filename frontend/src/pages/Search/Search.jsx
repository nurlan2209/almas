import React, { useState } from 'react';
import DonationSearch from '../../components/DonationSearch/DonationSearch';
import CreateDonation from '../../components/Donation/CreateDonation';
import { useAuth } from '../../services/authService';
import './Search.css';

const Search = () => {
  const { user } = useAuth();
  const [isCreatingDonation, setIsCreatingDonation] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Обработчик отклика на запрос донации
  const handleRespondToRequest = (requestId) => {
    setSelectedRequestId(requestId);
    setIsCreatingDonation(true);
  };

  // Обработчик успешного создания донации
  const handleDonationCreated = (donation) => {
    setIsCreatingDonation(false);
    setSelectedRequestId(null);
    // Можно добавить обновление списка донаций
    alert('Сіз донацияға сәтті тіркелдіңіз!');
    // Перезагрузка страницы для обновления данных
    window.location.reload();
  };

  return (
    <div className="search-page">
      <section className="search-hero">
        <div className="container">
          <h1>{user?.role === 'donor' ? 'Донорлыққа мұқтаж жандар' : 'Донорларды іздеу'}</h1>
          <p>
            {user?.role === 'donor' 
              ? 'Сіздің көмегіңізге мұқтаж адамдарды табыңыз және бүгін қан доноры болыңыз.' 
              : 'Сізге көмектесе алатын донорларды табыңыз немесе донацияға сұраныс жасаңыз.'}
          </p>
        </div>
      </section>

      <section className="search-content">
        <div className="container">
          {/* Модальное окно создания донации */}
          {isCreatingDonation && (
            <div className="modal-overlay">
              <div className="modal-content">
                <CreateDonation
                  requestId={selectedRequestId}
                  onSuccess={handleDonationCreated}
                  onCancel={() => {
                    setIsCreatingDonation(false);
                    setSelectedRequestId(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Компонент поиска доноров/реципиентов */}
          <DonationSearch
            onRespondToRequest={handleRespondToRequest}
          />
        </div>
      </section>
    </div>
  );
};

export default Search;