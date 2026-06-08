import type { PortfolioSection } from "../data/portfolioData";

type Props = {
  section: PortfolioSection | null;
  onClose: () => void;
};

export default function PortfolioModal({ section, onClose }: Props) {
  if (!section) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-subtitle">{section.subtitle}</p>
            <h2>{section.title}</h2>
          </div>

          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="modal-body">{section.body}</p>

        {section.projects && (
          <div className="project-list">
            {section.projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <div className="tech-list">
                  {project.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-actions">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank">
                      Live Demo
                    </a>
                  )}

                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank">
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}