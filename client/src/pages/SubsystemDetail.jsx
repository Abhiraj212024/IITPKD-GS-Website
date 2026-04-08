import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subsystems } from '../data/subsystemsData';
import '../styles/SubsystemDetail.css';

export default function SubsystemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const subsystem = subsystems.find(sub => sub.id === id);

  if (!subsystem) {
    return (
      <div className="subsystem-detail-container">
        <div className="subsystem-detail-error">
          <h2>Subsystem not found</h2>
          <button className="back-button" onClick={() => navigate('/subsystems')}>
            ← Back to Subsystems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subsystem-detail-wrapper">
      <div className="subsystem-detail-container">
        <button className="back-button" onClick={() => navigate('/subsystems')}>
          ← Back
        </button>
        
        <div className="subsystem-detail-header">
          <div className="subsystem-detail-icon">
            {subsystem.icon}
          </div>
          <h1 className="subsystem-detail-title">{subsystem.title}</h1>
        </div>
        
        <div className="subsystem-detail-content">
          <p className="subsystem-detail-desc">{subsystem.desc}</p>
          
          <div className="subsystem-additional-info">
            <h3>Overview</h3>
            <p>
              The {subsystem.title} subsystem is a critical component of our rocketry 
              operations. The team works diligently to ensure that all requirements are met 
              for a successful launch and recovery.
            </p>
            {/* Add more placeholder or specific details based on design */}
          </div>
        </div>
      </div>
    </div>
  );
}
