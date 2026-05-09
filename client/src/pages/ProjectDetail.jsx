import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projectsData';
import '../styles/ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="project-detail-wrapper">
        <div className="project-detail-container">
          <div className="project-detail-error">
            <h2>Project not found</h2>
            <button className="back-button" onClick={() => navigate('/projects')}>
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-wrapper">
      <div className="project-detail-container">
        <button className="back-button" onClick={() => navigate('/projects')}>
          ← Back
        </button>

        <div className="project-detail-header">
          <div className="project-detail-icon">
            {project.icon}
          </div>
          <div className="project-detail-header-text">
            <h1 className="project-detail-title">{project.title}</h1>
            <span className={`project-status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="project-detail-content">
          <div className="project-info-grid">
            <div className="project-info-item">
              <span className="project-info-label">Timeline</span>
              <span className="project-info-value">{project.timeline}</span>
            </div>
            <div className="project-info-item">
              <span className="project-info-label">Team Size</span>
              <span className="project-info-value">{project.teamSize} members</span>
            </div>
          </div>

          <div className="project-section">
            <h3>About This Project</h3>
            <p>{project.fullDescription}</p>
          </div>

          <div className="project-section">
            <h3>Key Objectives</h3>
            <ul className="project-objectives-list">
              {project.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
