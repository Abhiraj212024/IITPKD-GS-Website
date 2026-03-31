import React from 'react';
import { useNavigate } from 'react-router-dom';
import { subsystems } from '../data/subsystemsData';
import '../styles/Subsystems.css';

export default function Subsystems() {
  const navigate = useNavigate();

  return (
    <div className="subsystems-container">
      <div className="subsystems-header">
        <h1 className="subsystems-title">Our Subsystems</h1>
        <p className="subsystems-subtitle">
          Building a rocket requires seamless collaboration across multiple engineering
          disciplines. Discover the teams that make our launches possible.
        </p>
      </div>

      <div className="subsystems-grid">
        {subsystems.map((sub) => (
          <div 
            key={sub.id} 
            className="subsystem-card"
            onClick={() => navigate(`/subsystems/${sub.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="subsystem-icon">
              {sub.icon}
            </div>
            <h2 className="subsystem-card-title">{sub.title}</h2>
            <p className="subsystem-card-desc">{sub.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
