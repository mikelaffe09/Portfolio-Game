import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { PortfolioProject, PortfolioSection } from "../data/portfolioData";
import "../styles/project-showcase.css";

type Props = {
  section: PortfolioSection | null;
  onClose: () => void;
  onOpenProjectPage: (projectId: string) => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}

export default function PortfolioModal({
  section,
  onClose,
  onOpenProjectPage,
}: Props) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isOpen = Boolean(section);

  const activeProject = useMemo(() => {
    if (!section?.projects?.length) return null;

    return (
      section.projects.find((project) => project.id === activeProjectId) ??
      section.projects[0]
    );
  }, [section, activeProjectId]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const animationFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);

      if (
        previousFocusRef.current &&
        document.contains(previousFocusRef.current)
      ) {
        previousFocusRef.current.focus();
      }

      previousFocusRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !modalRef.current) return;

    const focusableElements = getFocusableElements(modalRef.current);

    if (focusableElements.length === 0) {
      event.preventDefault();
      modalRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    const focusIsOutsideModal =
      !activeElement || !modalRef.current.contains(activeElement);

    if (
      event.shiftKey &&
      (activeElement === firstElement || focusIsOutsideModal)
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (
      !event.shiftKey &&
      (activeElement === lastElement || focusIsOutsideModal)
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!section) return null;

  const isProjectsSection =
    section.id === "projects" && Boolean(section.projects?.length);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card ${
          isProjectsSection ? "projects-boss-modal" : ""
        }`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="modal-header">
          <div>
            <p className="modal-subtitle">{section.subtitle}</p>
            <h2 id={titleId}>{section.title}</h2>
          </div>

          <button
            className="icon-button"
            ref={closeButtonRef}
            aria-label="Close portfolio modal"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {!isProjectsSection && (
          <p className="modal-body" id={descriptionId}>
            {section.body}
          </p>
        )}

        {isProjectsSection && activeProject && (
          <ProjectsBossRoom
            section={section}
            activeProject={activeProject}
            descriptionId={descriptionId}
            onOpenProjectPage={onOpenProjectPage}
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
  descriptionId: string;
  onOpenProjectPage: (projectId: string) => void;
  onSelectProject: (projectId: string) => void;
};

function ProjectsBossRoom({
  section,
  activeProject,
  descriptionId,
  onOpenProjectPage,
  onSelectProject,
}: ProjectsBossRoomProps) {
  if (!section.projects) return null;

  return (
    <div className="projects-boss-room">
      <section className="boss-hero">
        <div>
          <p className="boss-kicker">Boss Room</p>
          <h3>Selected Work Console</h3>
          <p id={descriptionId}>{section.body}</p>
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
        <aside className="project-list-panel" aria-label="Project selection">
          {section.projects.map((project, index) => {
            const isActive = project.id === activeProject.id;

            return (
              <button
                className={`project-selector ${isActive ? "is-active" : ""}`}
                key={project.id}
                aria-pressed={isActive}
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

        <article
          className="project-detail-panel"
          aria-labelledby={`project-${activeProject.id}-title`}
        >
          <div className="project-preview">
            <div className="preview-window">
              <div className="preview-topbar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <img src={activeProject.previewImage} alt={activeProject.previewAlt} />
            </div>
          </div>

          <div className="project-detail-content">
            <p className="detail-kicker">Featured Project</p>
            <h3 id={`project-${activeProject.id}-title`}>
              {activeProject.title}
            </h3>
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
              <a
                href={activeProject.path}
                onClick={(event) => {
                  event.preventDefault();
                  onOpenProjectPage(activeProject.id);
                }}
              >
                Project Page
              </a>

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
