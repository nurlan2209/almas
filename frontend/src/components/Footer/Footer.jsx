import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <Link to="/">
            <span className="logo-text">Өмір<span className="logo-highlight">Донор</span></span>
          </Link>
          <p className="footer-slogan">Қанның әр тамшысы өмірді құтқарады</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h4>Мәзір</h4>
            <ul>
              <li><Link to="/">Басты бет</Link></li>
              <li><Link to="/about">Біз туралы</Link></li>
              <li><Link to="/how-to-donate">Донор болу жолы</Link></li>
              <li><Link to="/contact">Байланыс</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Байланыс</h4>
            <ul>
              <li>Телефон: +7 (123) 456-78-90</li>
              <li>Email: info@donorlife.kz</li>
              <li>Мекенжай: Мәскеу қ., Донор көш., 1</li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Әлеуметтік желілер</h4>
            <div className="social-links">
              <a href="#" className="social-link">ВКонтакте</a>
              <a href="#" className="social-link">Telegram</a>
              <a href="#" className="social-link">YouTube</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 ӨмірДонор. Барлық құқықтар қорғалған.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;