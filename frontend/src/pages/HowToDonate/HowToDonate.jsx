import { useEffect, useState } from 'react';
import './HowToDonate.css';

const HowToDonate = () => {
  const [accordionOpen, setAccordionOpen] = useState(null);
  
  const toggleAccordion = (index) => {
    if (accordionOpen === index) {
      setAccordionOpen(null);
    } else {
      setAccordionOpen(index);
    }
  };
  
  const steps = [
    {
      number: 1,
      title: 'Проверьте соответствие требованиям',
      description: 'Ознакомьтесь с требованиями к донорам крови и убедитесь, что у вас нет противопоказаний.'
    },
    {
      number: 2,
      title: 'Выберите центр сдачи крови',
      description: 'Найдите ближайший к вам центр сдачи крови в разделе "Центры сдачи".'
    },
    {
      number: 3,
      title: 'Подготовьтесь к сдаче крови',
      description: 'За день до донации избегайте жирной пищи и алкоголя. Утром можно легко позавтракать и выпить сладкий чай.'
    },
    {
      number: 4,
      title: 'Возьмите документы',
      description: 'Возьмите с собой паспорт гражданина РФ.'
    },
    {
      number: 5,
      title: 'Пройдите медицинский осмотр',
      description: 'В центре сдачи крови вы пройдете экспресс-обследование и консультацию врача-трансфузиолога.'
    },
    {
      number: 6,
      title: 'Сдайте кровь',
      description: 'Сама процедура донации крови занимает всего 7-10 минут.'
    },
    {
      number: 7,
      title: 'Восстановитесь после донации',
      description: 'После процедуры отдохните и выпейте сладкий чай. В течение дня пейте больше жидкости и воздержитесь от тяжелых физических нагрузок.'
    }
  ];
  
  const requirements = [
    'Возраст от 18 до 60 лет',
    'Вес не менее 50 кг',
    'Наличие паспорта гражданина РФ',
    'Отсутствие хронических заболеваний',
    'Хорошее самочувствие в день сдачи крови',
    'Отсутствие приема антибиотиков в течение последних 2 недель',
    'Отсутствие оперативных вмешательств в течение последних 6 месяцев',
    'Отсутствие татуировок и пирсинга, сделанных менее года назад'
  ];
  
  const contraindications = [
    {
      title: 'Абсолютные противопоказания',
      items: [
        'ВИЧ-инфекция и СПИД',
        'Сифилис',
        'Вирусные гепатиты',
        'Туберкулез',
        'Онкологические заболевания',
        'Болезни крови',
        'Тяжелые заболевания сердечно-сосудистой системы'
      ]
    },
    {
      title: 'Временные противопоказания',
      items: [
        'Простудные заболевания (до полного выздоровления)',
        'Беременность и период лактации',
        'Прием антибиотиков (в течение 2 недель после окончания приема)',
        'Удаление зуба (10 дней)',
        'Менструация (5 дней)',
        'Вакцинация (от 10 дней до 1 месяца)',
        'Алкоголь (не менее 48 часов до донации)'
      ]
    }
  ];
  
  useEffect(() => {
    // Здесь будет запрос к API для получения данных
    // Пример:
    // const fetchRequirements = async () => {
    //   try {
    //     const response = await fetch('api/requirements');
    //     const data = await response.json();
    //     setRequirements(data.requirements);
    //     setContraindications(data.contraindications);
    //   } catch (error) {
    //     console.error('Ошибка при загрузке данных:', error);
    //   }
    // };
    // fetchRequirements();
  }, []);
  
  return (
    <div className="how-to-donate-page">
      <section className="donate-hero">
        <div className="container">
          <h1 className="donate-title">Как стать донором</h1>
          <p className="donate-subtitle">Простая пошаговая инструкция для тех, кто хочет помочь</p>
        </div>
      </section>
      
      <section className="donate-steps">
        <div className="container">
          <h2>Пошаговая инструкция</h2>
          <div className="steps-container">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="donate-requirements">
        <div className="container">
          <h2>Требования к донорам</h2>
          <div className="requirements-list">
            {requirements.map((req, index) => (
              <div className="requirement-item" key={index}>
                <span className="requirement-check">✓</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="donate-contraindications">
        <div className="container">
          <h2>Противопоказания к донорству</h2>
          <div className="accordion-container">
            {contraindications.map((category, index) => (
              <div className="accordion-item" key={index}>
                <div 
                  className={`accordion-header ${accordionOpen === index ? 'active' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <h3>{category.title}</h3>
                  <span className="accordion-icon">{accordionOpen === index ? '−' : '+'}</span>
                </div>
                <div className={`accordion-content ${accordionOpen === index ? 'open' : ''}`}>
                  <ul>
                    {category.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="donate-after">
        <div className="container">
          <h2>После сдачи крови</h2>
          <div className="after-donate-content">
            <div className="after-donate-text">
              <p>После сдачи крови вы получите:</p>
              <ul>
                <li>Справку о донации для предоставления на работу или учебу</li>
                <li>Компенсацию на питание</li>
                <li>Два оплачиваемых выходных дня (которые можно присоединить к отпуску)</li>
              </ul>
              <p>Помните, что после сдачи крови:</p>
              <ul>
                <li>Рекомендуется воздержаться от тяжелых физических нагрузок в течение суток</li>
                <li>Следует пить больше жидкости в течение дня</li>
                <li>Не рекомендуется курить в течение 2-3 часов после донации</li>
                <li>В течение суток запрещено употребление алкоголя</li>
              </ul>
            </div>
            <div className="after-donate-image">
              <div className="image-placeholder"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToDonate;