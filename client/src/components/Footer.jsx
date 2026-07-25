import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <h3 className="contact-title">Contact Us</h3>
        <p className="contact-subtitle">Get in touch with the Mach V Rocketry Team</p>

        <div className="contact-cards">
          {/* Email */}
          <a href="mailto:rocketry@iitpkd.ac.in" className="contact-card" id="contact-email">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <span className="contact-label">Email</span>
            <span className="contact-value">rocketry@iitpkd.ac.in</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/mach-v-rocketry-team-iit-palakkad-324016410"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
            id="contact-linkedin"
          >
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span className="contact-label">LinkedIn</span>
            <span className="contact-value">Mach V Rocketry Team</span>
          </a>

          {/* Instagram */}
          <div className="contact-card contact-card-upcoming" id="contact-instagram">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <span className="contact-label">Instagram</span>
            <span className="contact-upcoming-badge">Coming Soon</span>
          </div>
        </div>

        <p className="footer-copyright">
          © {year} Mach-V Rocketry Team, IIT Palakkad. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
