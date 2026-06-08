import type { CSSProperties } from "react";
import type { PortfolioSection } from "../data/portfolioData";

type Props = {
  section: PortfolioSection | null;
  onClose: () => void;
};

export default function PortfolioModal({ section, onClose }: Props) {
  if (!section) return null;

  const modalStyle = {
    "--section-accent": section.accent,
  } as CSSProperties;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={modalStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="modal-subtitle">{section.subtitle}</p>
            <h2>{section.title}</h2>
            <p className="modal-summary">{section.summary}</p>
          </div>

          <button className="icon-button" onClick={onClose} aria-label="Close">
            X
          </button>
        </div>

        <p className="modal-body">{section.body}</p>

        {section.stats && (
          <div className="stat-grid">
            {section.stats.map((stat) => (
              <div className="stat-pill" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        )}

        {section.bullets && (
          <ul className="detail-list">
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {section.projects && (
          <div className="project-list">
            {section.projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <strong>{project.impact}</strong>
                </div>

                <div className="tech-list">
                  {project.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-actions">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {section.links && (
          <div className="link-grid">
            {section.links.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
