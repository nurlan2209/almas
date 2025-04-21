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
          <h1 className="contact-title">Байланыс</h1>
          <p className="contact-subtitle">Бізбен өзіңізге ыңғайлы тәсілмен байланысыңыз</p>
        </div>
      </section>
      
      <section className="contact-info">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-details">
              <h2>Біздің байланыс мәліметтеріміз</h2>
              <ul className="contact-list">
                <li className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">
                    <h3>Мекенжай</h3>
                    <p>Алматы қ., Донор көш., 15</p>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-text">
                    <h3>Телефон</h3>
                    <p>+7 (727) 123-45-67</p>
                    <p>+7 (727) 765-43-21</p>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <p>info@donorlife.kz</p>
                    <p>support@donorlife.kz</p>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon">🕒</div>
                  <div className="contact-text">
                    <h3>Жұмыс уақыты</h3>
                    <p>Дс-Жм: 9:00 - 18:00</p>
                    <p>Сн-Жс: Демалыс</p>
                  </div>
                </li>
              </ul>
              
              <div className="social-links">
                <h3>Біз әлеуметтік желілерде</h3>
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
              <h2>Бізге жазыңыз</h2>
              <p className="form-description">
                Егер сізде қан донорлығы туралы сұрақтарыңыз болса немесе қосымша ақпарат алғыңыз келсе, төмендегі форманы толтырыңыз.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Жиі қойылатын сұрақтар</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Қан тапсыруды қаншалықты жиі жасауға болады?</h3>
              <p>Толық қанды ер адамдар 2 айда 1 рет, ал әйелдер 3 айда 1 рет тапсыра алады.</p>
            </div>
            <div className="faq-item">
              <h3>Қан тапсыру үшін алдын ала жазылу керек пе?</h3>
              <p>Қан тапсыру орталықтарының көпшілігінде алдын ала жазылусыз қан тапсыруға болады, бірақ таңдалған орталықтың телефоны арқылы бұл мәселені нақтылауды ұсынамыз.</p>
            </div>
            <div className="faq-item">
              <h3>Қан тапсыру үшін қандай құжаттар қажет?</h3>
              <p>Өзіңізбен бірге ҚР азаматының төлқұжатын алуыңыз қажет.</p>
            </div>
            <div className="faq-item">
              <h3>Донорларға қандай жеңілдіктер беріледі?</h3>
              <p>Донорларға қан тапсыру күні жұмыстан босатылады және қосымша демалыс күні беріледі, оны кезекті демалысқа қосуға болады.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;