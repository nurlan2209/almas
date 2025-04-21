import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import DonationSteps from '../../components/DonationSteps/DonationSteps';
import CTA from '../../components/CTA/CTA'; // Импортируем CTA

const Home = () => {
  const benefits = [
    { icon: '❤️', title: 'Өмірді құтқару', description: '' },
    { icon: '🩺', title: 'Денсаулықты жақсарту', description: '' },
    { icon: '🏆', title: 'Мақтаныш сезімі', description: '' },
    { icon: '🤝', title: 'Әлеуметтік қолдау', description: '' },
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Өмірмен бөліс — донор бол!</h1>
          <p className="hero-description">
            Сіздің қаныңыз біреудің өмірін құтқара алады. Қан донорлығы бағдарламасына қосылыңыз және көмекке мұқтаж жандар үшін қаһарман болыңыз.
          </p>
          <div className="hero-buttons">
            <Link to="/how-to-donate" className="hero-button primary">Донор болу</Link>
            <Link to="/about" className="hero-button secondary">Көбірек білу</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="blood-drop"></div>
        </div>
      </section>

      <section className="benefits-section">
        <h2 className="benefits-title">Донорлықтың артықшылықтары</h2>
        <p className="benefits-description">Қан доноры болу неліктен маңызды екенін біліңіз</p>
        <div className="benefits-cards">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTA /> {/* Добавляем CTA сюда */}
    </div>
  );
};

export default Home;