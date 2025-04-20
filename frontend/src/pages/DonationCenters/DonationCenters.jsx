import { useEffect, useState } from 'react';
import CenterCard from '../../components/CenterCard/CenterCard';
import './DonationCenters.css';

const DonationCenters = () => {
  const [centers, setCenters] = useState([
    {
      id: 1,
      name: 'Центр крови ФМБА России',
      address: 'г. Москва, ул. Щукинская, д. 6, корп. 2',
      workingHours: 'Пн-Пт: 8:30 - 14:00',
      phone: '+7 (495) 122-20-13'
    },
    {
      id: 2,
      name: 'Городская станция переливания крови',
      address: 'г. Москва, ул. Бакинская, д. 31',
      workingHours: 'Пн-Сб: 8:00 - 15:00',
      phone: '+7 (495) 366-98-10'
    },
    {
      id: 3,
      name: 'НИИ Скорой помощи им. Склифосовского',
      address: 'г. Москва, Б. Сухаревская пл., д. 3',
      workingHours: 'Пн-Пт: 9:00 - 13:00',
      phone: '+7 (495) 680-41-54'
    },
    {
      id: 4,
      name: 'Центр крови им. О.К. Гаврилова',
      address: 'г. Москва, ул. Поликарпова, д. 14, корп. 2',
      workingHours: 'Пн-Пт: 8:30 - 14:00',
      phone: '+7 (495) 945-71-66'
    },
    {
      id: 5,
      name: 'Национальный медицинский центр гематологии',
      address: 'г. Москва, Новый Зыковский проезд, д. 4',
      workingHours: 'Пн-Пт: 9:00 - 14:00',
      phone: '+7 (495) 612-44-13'
    },
    {
      id: 6,
      name: 'Городская клиническая больница №52',
      address: 'г. Москва, ул. Пехотная, д. 3',
      workingHours: 'Пн-Пт: 8:30 - 13:00',
      phone: '+7 (499) 196-18-34'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Здесь будет запрос к API для получения списка центров
    // Пример:
    // const fetchCenters = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await fetch('api/centers');
    //     const data = await response.json();
    //     setCenters(data);
    //   } catch (error) {
    //     console.error('Ошибка при загрузке данных:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCenters();
  }, []);
  
  const filteredCenters = centers.filter(center => 
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="donation-centers-page">
      <section className="centers-hero">
        <div className="container">
          <h1 className="centers-title">Центры сдачи крови</h1>
          <p className="centers-subtitle">Найдите ближайший к вам центр сдачи крови</p>
        </div>
      </section>
      
      <section className="centers-content">
        <div className="container">
          <div className="centers-search">
            <input
              type="text"
              placeholder="Поиск по названию или адресу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="map-container">
            <div className="map-placeholder">
              <p>Здесь будет интерактивная карта с центрами сдачи крови</p>
            </div>
          </div>
          
          <h2 className="centers-list-title">Список центров сдачи крови</h2>
          
          {loading ? (
            <div className="loading">Загрузка данных...</div>
          ) : (
            <div className="centers-grid">
              {filteredCenters.length > 0 ? (
                filteredCenters.map(center => (
                  <CenterCard key={center.id} center={center} />
                ))
              ) : (
                <div className="no-results">
                  <p>По вашему запросу ничего не найдено</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DonationCenters;