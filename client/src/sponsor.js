import "./MSsec.css";

export default function Sponsor({ sponsors }) {
  return (
    <div className="sponsor-grid-container">
      <h2>Our Sponsors</h2>
      <div className="sponsor-grid">
        {sponsors.map((sponsor, index) => (
          <div className="sponsor-item" key={index}>
            <img
              src={sponsor.logoUrl}
              alt={`${sponsor.name} Logo`}
              className="sponsor-logo"
            />
            <p className="sponsor-name">{sponsor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
