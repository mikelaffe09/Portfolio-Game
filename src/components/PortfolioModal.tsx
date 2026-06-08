import { useMemo, useState } from "react";
import type { PortfolioProject, PortfolioSection } from "../data/portfolioData";
import "../styles/project-showcase.css";

type Props = {
  section: PortfolioSection | null;
  onClose: () => void;
};

export default function PortfolioModal({ section, onClose }: Props) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    if (!section?.projects?.length) return null;

    return (
      section.projects.find((project) => project.id === activeProjectId) ??
      section.projects[0]
    );
  }, [section, activeProjectId]);

  if (!section) return null;

  const isProjectsSection = section.id === "projects" && section.projects;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card ${
          isProjectsSection ? "projects-boss-modal" : ""
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="modal-subtitle">{section.subtitle}</p>
            <h2>{section.title}</h2>
          </div>

          <button className="icon-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {!isProjectsSection && <p className="modal-body">{section.body}</p>}

        {isProjectsSection && activeProject && (
          <ProjectsBossRoom
            section={section}
            activeProject={activeProject}
            onSelectProject={setActiveProjectId}
          />
        )}
      </div>
    </div>
  );
}

type ProjectsBossRoomProps = {
  section: PortfolioSection;
  activeProject: PortfolioProject;
  onSelectProject: (projectId: string) => void;
};

function ProjectsBossRoom({
  section,
  activeProject,
  onSelectProject,
}: ProjectsBossRoomProps) {
  if (!section.projects) return null;

  return (
    <div className="projects-boss-room">
      <section className="boss-hero">
        <div>
          <p className="boss-kicker">Boss Room</p>
          <h3>Selected Work Console</h3>
          <p>{section.body}</p>
        </div>

        <div className="boss-stats">
          <div>
            <span>Projects</span>
            <strong>{section.projects.length}</strong>
          </div>
          <div>
            <span>Focus</span>
            <strong>Frontend</strong>
          </div>
        </div>
      </section>

      <div className="projects-layout">
        <aside className="project-list-panel">
          {section.projects.map((project, index) => {
            const isActive = project.id === activeProject.id;

            return (
              <button
                className={`project-selector ${isActive ? "is-active" : ""}`}
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{project.title}</strong>
                  <small>{project.impact}</small>
                </div>
              </button>
            );
          })}
        </aside>

        <article className="project-detail-panel">
          <div className="project-preview">
            <div className="preview-window">
              <div className="preview-topbar">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-content">
                <p>{activeProject.title}</p>
                <strong>{activeProject.bestFeature}</strong>
              </div>
            </div>
          </div>

          <div className="project-detail-content">
            <p className="detail-kicker">Featured Project</p>
            <h3>{activeProject.title}</h3>
            <p className="project-description">{activeProject.description}</p>

            <div className="proof-grid">
              <ProofBlock title="Problem" text={activeProject.problem} />
              <ProofBlock title="Solution" text={activeProject.solution} />
              <ProofBlock title="My Role" text={activeProject.role} />
              <ProofBlock title="Best Feature" text={activeProject.bestFeature} />
            </div>

            <div className="tech-list boss-tech-list">
              {activeProject.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="project-actions">
              {activeProject.demoUrl ? (
                <a href={activeProject.demoUrl} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              ) : (
                <button type="button" disabled>
                  Demo Coming Soon
                </button>
              )}

              {activeProject.githubUrl ? (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : (
                <button type="button" disabled>
                  GitHub Coming Soon
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

type ProofBlockProps = {
  title: string;
  text: string;
};

function ProofBlock({ title, text }: ProofBlockProps) {
  return (
    <div className="proof-block">
      <span>{title}</span>
      <p>{text}</p>
    </div>
  );
}