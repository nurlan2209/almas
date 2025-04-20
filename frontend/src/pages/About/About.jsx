import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">О нас</h1>
          <p className="about-subtitle">Узнайте больше о нашей миссии и ценностях</p>
        </div>
      </section>
      
      <section className="about-mission">
        <div className="container">
          <div className="about-mission-content">
            <div className="mission-text">
              <h2>Наша миссия</h2>
              <p>
                Миссия проекта "ДонорЖизни" заключается в создании развитой культуры добровольного донорства крови в России. 
                Мы работаем над тем, чтобы каждый человек, нуждающийся в переливании крови, мог получить необходимую помощь вовремя.
              </p>
              <p>
                Наша команда стремится повысить осведомленность общества о важности донорства крови,обеспечить комфортные условия для доноров и создать эффективную систему взаимодействия между донорами и медицинскими учреждениями.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder"></div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-values">
        <div className="container">
          <h2 className="values-title">Наши ценности</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Жизнь</h3>
              <p>Мы ценим каждую человеческую жизнь и делаем всё возможное, чтобы помочь тем, кто нуждается в донорской крови.</p>
            </div>
            <div className="value-card">
              <h3>Добровольность</h3>
              <p>Мы поддерживаем принцип добровольного безвозмездного донорства, основанного на желании помочь другим людям.</p>
            </div>
            <div className="value-card">
              <h3>Ответственность</h3>
              <p>Мы ответственно подходим к организации процесса донации и обеспечению безопасности как доноров, так и реципиентов.</p>
            </div>
            <div className="value-card">
              <h3>Информированность</h3>
              <p>Мы верим в важность распространения достоверной информации о донорстве крови для принятия осознанных решений.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-history">
        <div className="container">
          <h2>История проекта</h2>
          <div className="history-timeline">
            <div className="timeline-item">
              <div className="timeline-date">2020</div>
              <div className="timeline-content">
                <h3>Основание проекта</h3>
                <p>Проект "ДонорЖизни" был основан группой энтузиастов, осознавших важность развития системы донорства крови в России.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2021</div>
              <div className="timeline-content">
                <h3>Первая кампания</h3>
                <p>Мы провели первую масштабную кампанию по привлечению доноров, которая охватила более 10 городов России.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2022</div>
              <div className="timeline-content">
                <h3>Развитие сети центров</h3>
                <p>Начало сотрудничества с региональными центрами крови для создания единой информационной сети.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>Образовательная программа</h3>
                <p>Запуск образовательной программы для школ и вузов о важности донорства крови.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-team">
        <div className="container">
          <h2>Наша команда</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Александр Петров</h3>
              <p className="member-role">Основатель проекта</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Елена Смирнова</h3>
              <p className="member-role">Медицинский координатор</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Дмитрий Иванов</h3>
              <p className="member-role">Руководитель волонтёров</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Ольга Козлова</h3>
              <p className="member-role">PR-специалист</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;