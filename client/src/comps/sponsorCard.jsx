import "../styles/MSsec.css";

export default function SponsorCard({ sponsors }) {
  if (!sponsors || sponsors.length === 0) {
    return (
      <div className="sponsor-grid-container"> 
        <p>No sponsors available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="sponsor-grid-container">
      <h2>Our Sponsors</h2>
      <div className="sponsor-grid">
        {sponsors.map((sponsor, index) => {
          const sponsorName = sponsor.name ;
          const fallbackLogo = `https://placehold.co/320x140/0f172a/ffffff?text=${encodeURIComponent(sponsorName)}`;
          const logoUrl = sponsor.logoUrl?.trim() || fallbackLogo;

          return (
            <div className="sponsor-item" key={index}>
              <div className="sponsor-logo-wrapper">
                <img
                  src={logoUrl}
                  alt={`${sponsorName} Logo`}
                  className="sponsor-logo"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackLogo;
                  }}
                />
              </div>
              <p className="sponsor-name">{sponsorName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
