import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <Link to="/" className="navbar-brand" aria-label="Mach-V Home">
        MACH<span className="navbar-brand-accent">—</span>V
      </Link>

      <div className="navbar-links">
        <Link
          className={location.pathname === "/" ? "nav-btn nav-btn--active" : "nav-btn"}
          to="/"
        >
          Home
        </Link>
        <Link
          className={location.pathname === "/subsystems" ? "nav-btn nav-btn--active" : "nav-btn"}
          to="/subsystems"
        >
          Subsystems
        </Link>
        <Link
          className={location.pathname.startsWith("/projects") ? "nav-btn nav-btn--active" : "nav-btn"}
          to="/projects"
        >
          Projects
        </Link>
        <Link
          className={location.pathname === "/team" ? "nav-btn nav-btn--active" : "nav-btn"}
          to="/team"
        >
          Team &amp; Sponsors
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;