import { Link } from 'react-router-dom';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Готовы спасти жизнь?</h2>
          <p className="cta-text">
            Присоединяйтесь к тысячам доноров по всей стране и помогите тем, кто нуждается в донорской крови прямо сейчас.
          </p>
          <Link to="/how-to-donate" className="btn btn-primary cta-btn">Стать донором сегодня</Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;