import { useState, useEffect, useRef } from 'react';
import { projects } from '../../data/projects';
import './ProjectsPage.css';

export function ProjectsPage({ onSelectProject, onBack }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div className="projects-page" onMouseMove={handleMouseMove}>
      <div
        className="projects-page__background"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      >
        <img
          src="/assets/building2.jpg"
          alt="Construction Site"
          className="projects-page__bg-image"
        />
        <div className="projects-page__overlay" />
      </div>

      <div className="projects-page__content">
        <header className="projects-page__header">
          <button className="projects-page__back" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <div className="projects-page__title-block">
            <h1 className="projects-page__title">Our Projects</h1>
            <p className="projects-page__subtitle">
              Discover exceptional living spaces across our premium developments
            </p>
          </div>
        </header>

        <div className="projects-page__grid">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`project-card ${isLoaded ? 'loaded' : ''} ${project.isReal ? 'project-card--real' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectProject(project)}
            >
              <div className="project-card__image-container">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="project-card__image"
                />
                <div className="project-card__image-overlay" />
                {project.isReal && (
                  <span className="project-card__badge">Featured</span>
                )}
              </div>
              <div className="project-card__content">
                <span className="project-card__status">{project.status}</span>
                <h3 className="project-card__name">{project.name}</h3>
                <p className="project-card__tagline">{project.tagline}</p>
                <div className="project-card__details">
                  <span className="project-card__location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {project.location}
                  </span>
                  <span className="project-card__price">{project.priceRange}</span>
                </div>
              </div>
              <div className="project-card__arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}