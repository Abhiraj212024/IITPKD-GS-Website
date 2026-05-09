import React from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projectsData';
import '../styles/Projects.css';

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1 className="projects-title">Our Projects</h1>
        <p className="projects-subtitle">
          From sounding rockets to satellite prototypes, explore the missions
          driving our team forward.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-icon">
              {project.icon}
            </div>
            <h2 className="project-card-title">{project.title}</h2>
            <p className="project-card-desc">{project.desc}</p>
            <button
              className="project-card-link"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              Learn More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
