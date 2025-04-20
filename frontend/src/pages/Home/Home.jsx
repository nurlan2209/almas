import Hero from '../../components/Hero/Hero';
import BenefitCard from '../../components/BenefitCard/BenefitCard';
import CTA from '../../components/CTA/CTA';
import './Home.css';

const Home = () => {
  const benefits = [
    {
      icon: '❤️',
      title: 'Спасаете жизни',
      description: 'Одна донация может спасти до 3 жизней людей, нуждающихся в переливании крови.'
    },
    {
      icon: '🩺',
      title: 'Бесплатное обследование',
      description: 'Каждый донор проходит медицинское обследование и получает результаты анализов.'
    },
    {
      icon: '🏆',
      title: 'Социальный вклад',
      description: 'Становясь донором, вы делаете важный вклад в здоровье общества.'
    },
    {
      icon: '🛡️',
      title: 'Укрепление здоровья',
      description: 'Регулярное донорство помогает обновлять кровь и улучшает общее состояние организма.'
    }
  ];

  return (
    <div className="home-page">
      <Hero />
      
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Преимущества донорства</h2>
          <p className="section-subtitle">Узнайте, почему важно стать донором крови</p>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <BenefitCard 
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      <CTA />
    </div>
  );
};

export default Home;