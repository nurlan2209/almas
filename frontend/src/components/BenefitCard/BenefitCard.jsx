import './BenefitCard.css';

const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="benefit-card">
      <div className="benefit-icon">{icon}</div>
      <h3 className="benefit-title">{title}</h3>
      <p className="benefit-description">{description}</p>
    </div>
  );
};

export default BenefitCard;
