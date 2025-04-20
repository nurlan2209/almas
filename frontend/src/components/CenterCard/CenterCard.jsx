import './CenterCard.css';

const CenterCard = ({ center }) => {
  return (
    <div className="center-card">
      <div className="center-info">
        <h3 className="center-name">{center.name}</h3>
        <p className="center-address">{center.address}</p>
        <p className="center-worktime">
          <span className="label">Время работы:</span> {center.workingHours}
        </p>
        <p className="center-phone">
          <span className="label">Телефон:</span> {center.phone}
        </p>
      </div>
      <div className="center-actions">
        <button className="btn btn-outline">Подробнее</button>
      </div>
    </div>
  );
};

export default CenterCard;