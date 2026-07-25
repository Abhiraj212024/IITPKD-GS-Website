import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="hero page-transition">

      <div className="hero-content">
        <p className="hero-eyebrow">IIT Palakkad · Student Rocketry</p>

        <h1 className="hero-heading">
          Mach&#8209;V
          <br />
          <span className="hero-heading-sub">Rocketry Team</span>
        </h1>

        <p className="hero-subtitle">
          We design, build, and launch high-powered rockets — pushing the
          boundaries of student aerospace engineering in India.
        </p>

        <div className="hero-cta-row">
          <Link to="/projects" className="btn-primary" id="hero-cta-primary">
            Explore Projects
          </Link>
          <Link to="/subsystems" className="btn-secondary" id="hero-cta-secondary">
            Our Subsystems
          </Link>
        </div>
      </div>

      {/* Subtle bottom gradient fade */}
      <div className="hero-fade-bottom" aria-hidden="true" />
    </div>
  );
}

export default Home;