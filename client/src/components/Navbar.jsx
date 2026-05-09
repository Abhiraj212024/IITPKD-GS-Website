import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link className={location.pathname === "/" ? "nav-btn active" : "nav-btn"} to="/">
        Home
      </Link>
      <Link className={location.pathname === "/subsystems" ? "nav-btn active" : "nav-btn"} to="/subsystems">
        Subsystems
      </Link>
      <Link className={location.pathname.startsWith("/projects") ? "nav-btn active" : "nav-btn"} to="/projects">
        Projects
      </Link>
      <Link className={location.pathname === "/team" ? "nav-btn active" : "nav-btn"} to="/team">
        Team & Sponsors
      </Link>
    </nav>
  );
};

export default Navbar;