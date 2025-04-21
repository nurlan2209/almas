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
      title: 'Талаптарға сәйкестігін тексеріңіз',
      description: 'Қан донорларына қойылатын талаптармен танысыңыз және сізде қарсы көрсеткіштер жоқ екеніне көз жеткізіңіз.'
    },
    {
      number: 2,
      title: 'Қан тапсыру орталығын таңдаңыз',
      description: '«Қан тапсыру орталықтары» бөлімінен өзіңізге ең жақын орталықты табыңыз.'
    },
    {
      number: 3,
      title: 'Қан тапсыруға дайындалыңыз',
      description: 'Донациядан бір күн бұрын майлы тағамдар мен алкогольден бас тартыңыз. Таңертең жеңіл таңғы ас ішіп, тәтті шай ішуге болады.'
    },
    {
      number: 4,
      title: 'Құжаттарды алыңыз',
      description: 'Өзіңізбен бірге ҚР азаматының төлқұжатын алыңыз.'
    },
    {
      number: 5,
      title: 'Медициналық тексеруден өтіңіз',
      description: 'Қан тапсыру орталығында сіз экспресс-тексеруден өтіп, трансфузиолог-дәрігердің кеңесін аласыз.'
    },
    {
      number: 6,
      title: 'Қан тапсырыңыз',
      description: 'Қан тапсыру процедурасы небәрі 7-10 минутты алады.'
    },
    {
      number: 7,
      title: 'Донациядан кейін қалпына келіңіз',
      description: 'Процедурадан кейін демалып, тәтті шай ішіңіз. Күні бойы көбірек сұйықтық ішіңіз және ауыр физикалық жүктемелерден бас тартыңыз.'
    }
  ];
  
  const requirements = [
    '18-ден 60 жасқа дейін',
    'Салмағы кемінде 50 кг',
    'ҚР азаматының төлқұжаты болуы',
    'Созылмалы аурулардың болмауы',
    'Қан тапсыру күні жақсы сезіну',
    'Соңғы 2 аптада антибиотиктер қабылдамаудың болмауы',
    'Соңғы 6 айда операциялық араласудың болмауы',
    'Бір жылдан аз уақыт бұрын жасалған татуировка немесе пирсингтің болмауы'
  ];
  
  const contraindications = [
    {
      title: 'Абсолютті қарсы көрсеткіштер',
      items: [
        'АИТВ инфекциясы және ЖИТС',
        'Мерез',
        'Вирустық гепатиттер',
        'Туберкулез',
        'Онкологиялық аурулар',
        'Қан аурулары',
        'Жүрек-қантамыр жүйесінің ауыр аурулары'
      ]
    },
    {
      title: 'Уақытша қарсы көрсеткіштер',
      items: [
        'Суық тию аурулары (толық сауыққанша)',
        'Жүктілік және лактация кезеңі',
        'Антибиотиктер қабылдау (қабылдау аяқталғаннан кейін 2 апта)',
        'Тіс жұлу (10 күн)',
        'Етеккір (5 күн)',
        'Вакцинация (10 күннен 1 айға дейін)',
        'Алкоголь (донацияға дейін кемінде 48 сағат)'
      ]
    }
  ];

  return (
    <div className="how-to-donate-page">
      <section className="donate-hero">
        <div className="container">
          <h1 className="donate-title">Донор болу жолы</h1>
          <p className="donate-subtitle">Көмектескісі келетіндер үшін қарапайым қадамдық нұсқаулық</p>
        </div>
      </section>
      
      <section className="donate-steps">
        <div className="container">
          <h2>Қадамдық нұсқаулық</h2>
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
          <h2>Донорларға қойылатын талаптар</h2>
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
          <h2>Донорлыққа қарсы көрсеткіштер</h2>
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
          <h2>Қан тапсырудан кейін</h2>
          <div className="after-donate-content">
            <div className="after-donate-text">
              <p>Қан тапсырғаннан кейін сіз аласыз:</p>
              <ul>
                <li>Жұмысқа немесе оқуға ұсыну үшін донация туралы анықтама</li>
                <li>Тамақтануға өтемақы</li>
                <li>Екі ақылы демалыс күні (оны кезекті демалысқа қосуға болады)</li>
              </ul>
              <p>Қан тапсырғаннан кейін мынаны есте сақтаңыз:</p>
              <ul>
                <li>Тәулік бойы ауыр физикалық жүктемелерден бас тартқан жөн</li>
                <li>Күні бойы көбірек сұйықтық ішу керек</li>
                <li>Донациядан кейін 2-3 сағат бойы темекі шегу ұсынылмайды</li>
                <li>Тәулік бойы алкоголь ішуге тыйым салынады</li>
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