import { Link } from 'react-router-dom';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Өмірді құтқаруға дайынсыз ба?</h2>
          <p className="cta-text">
            Еліміздің түкпір-түкпіріндегі мыңдаған донорларға қосылыңыз және қазір қан донорлығына мұқтаж жандарға көмектесіңіз.
          </p>
          <Link to="/how-to-donate" className="btn btn-primary cta-btn">Бүгін донор болу</Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;