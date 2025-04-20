import ContactForm from '../../components/ContactForm/ContactForm';
import './Contact.css';

const Contact = () => {
  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'YouTube', icon: '📹', url: '#' }
  ];
  
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title">Контакты</h1>
          <p className="contact-subtitle">Свяжитесь с нами любым удобным способом</p>
        </div>
      </section>
      
      <section className="contact-info">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-details">
              <h2>Наши контакты</h2>
              <ul className="contact-list">
                <li className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">
                    <h3>Адрес</h3>
                    <p>г. Москва, ул. Донорская, д. 15</p>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-text">
                    <h3>Телефон</h3>
                    <p>+7 (495) 123-45-67</p>
                    <p>+7 (495) 765-43-21</p>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <p>info@donorlife.ru</p>
                    <p>support@donorlife.ru</p>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">🕒</div>
                  <div className="contact-text">
                    <h3>Время работы</h3>
                    <p>Пн-Пт: 9:00 - 18:00</p>
                    <p>Сб-Вс: Выходной</p>
                  </div>
                </li>
              </ul>
              
              <div className="social-links">
                <h3>Мы в социальных сетях</h3>
                <div className="social-icons">
                  {socialLinks.map((link, index) => (
                    <a href={link.url} className="social-icon" key={index} target="_blank" rel="noopener noreferrer">
                      <span>{link.icon}</span>
                      <span className="social-name">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="contact-form-section">
              <h2>Напишите нам</h2>
              <p className="form-description">
                Если у вас есть вопросы о донорстве крови или вы хотите
                получить дополнительную информацию, заполните форму ниже.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Часто задаваемые вопросы</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Как часто можно сдавать кровь?</h3>
              <p>Цельную кровь можно сдавать не чаще 1 раза в 2 месяца для мужчин и 1 раза в 3 месяца для женщин.</p>
            </div>
            <div className="faq-item">
              <h3>Нужно ли предварительно записываться для сдачи крови?</h3>
              <p>В большинстве центров сдачи крови можно сдать кровь без предварительной записи, но рекомендуем уточнить этот вопрос по телефону выбранного центра.</p>
            </div>
            <div className="faq-item">
              <h3>Какие документы нужны для сдачи крови?</h3>
              <p>При себе необходимо иметь паспорт гражданина РФ.</p>
            </div>
            <div className="faq-item">
              <h3>Какие льготы предоставляются донорам?</h3>
              <p>Донорам предоставляется освобождение от работы в день сдачи крови и дополнительный день отдыха, который можно присоединить к очередному отпуску.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;