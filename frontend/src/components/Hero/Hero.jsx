import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Поделись жизнью — стань донором!</h1>
          <p className="hero-text">
            Ваша кровь может спасти чью-то жизнь. Присоединяйтесь к программе донорства крови и станьте героем для тех, кто нуждается в помощи.
          </p>
          <div className="hero-cta">
            <Link to="/how-to-donate" className="btn btn-primary">Стать донором</Link>
            <Link to="/about" className="btn btn-outline">Узнать больше</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            {/* Здесь будет изображение */}
            <div className="blood-drop"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;