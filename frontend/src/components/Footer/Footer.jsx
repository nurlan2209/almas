import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <Link to="/">
            <span className="logo-text">Донор<span className="logo-highlight">Жизни</span></span>
          </Link>
          <p className="footer-slogan">Каждая капля крови спасает жизнь</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h4>Меню</h4>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/how-to-donate">Как стать донором</Link></li>
              <li><Link to="/donation-centers">Центры сдачи</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Контакты</h4>
            <ul>
              <li>Телефон: +7 (123) 456-78-90</li>
              <li>Email: info@donorlife.ru</li>
              <li>Адрес: г. Москва, ул. Донорская, 1</li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h4>Соцсети</h4>
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
          <p>&copy; 2025 ДонорЖизни. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;