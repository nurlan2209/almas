import './DonationSteps.css';

const DonationSteps = ({ steps }) => {
  return (
    <div className="donation-steps">
      {steps.map((step, index) => (
        <div className="donation-step" key={index}>
          <div className="step-number">{step.number}</div>
          <div className="step-content">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonationSteps;