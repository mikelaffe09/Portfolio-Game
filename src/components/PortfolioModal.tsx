import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  courseItems,
  educationItems,
  experienceItems,
  getPortfolioProjectLinks,
  getProjectPreviewAlt,
  getProjectPreviewImage,
  languageItems,
  portfolioProfile,
  skillGroups,
  type ContactMethod,
  type PortfolioProject,
  type PortfolioSection,
} from "../data/portfolioData";
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
        style={{ "--section-accent": section.accent } as CSSProperties}
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
          <SectionDetail section={section} descriptionId={descriptionId} />
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

type SectionDetailProps = {
  section: PortfolioSection;
  descriptionId: string;
};

function SectionDetail({ section, descriptionId }: SectionDetailProps) {
  if (section.id === "about") {
    return (
      <section className="modal-section-content" id={descriptionId}>
        <p className="modal-body">{section.body}</p>

        <div className="professional-summary-card">
          <span>Profile</span>
          <strong>
            {portfolioProfile.role} - {portfolioProfile.location}
          </strong>
          <p>{portfolioProfile.summary}</p>
        </div>

        <div className="modal-highlight-grid">
          {portfolioProfile.strengths.map((strength) => (
            <article key={strength}>
              <span>Strength</span>
              <p>{strength}</p>
            </article>
          ))}
        </div>

        <div className="modal-subsection">
          <span>Experience</span>
          <div className="experience-timeline">
            {experienceItems.map((item) => (
              <article key={`${item.company}-${item.role}`}>
                <small>{item.dates}</small>
                <strong>{item.company}</strong>
                <p>
                  {item.role} - {item.location}
                </p>
                <ul>
                  {item.highlights.slice(0, 2).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="modal-subsection">
          <span>Education, Courses, Languages</span>
          <div className="modal-info-grid">
            <article>
              <strong>{educationItems[0].institution}</strong>
              <p>
                {educationItems[0].credential} - {educationItems[0].dates}
              </p>
              {educationItems[0].details.map((detail) => (
                <small key={detail}>{detail}</small>
              ))}
            </article>

            <article>
              <strong>Courses</strong>
              <ul>
                {courseItems.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </article>

            <article>
              <strong>Languages</strong>
              <ul>
                {languageItems.map((item) => (
                  <li key={item.language}>
                    {item.language} - {item.level}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    );
  }

  if (section.id === "skills") {
    return (
      <section className="modal-section-content" id={descriptionId}>
        <p className="modal-body">{section.body}</p>

        <div className="skill-group-grid">
          {skillGroups.map((group) => (
            <article className="skill-group-card" key={group.title}>
              <span>{group.title}</span>
              <p>{group.description}</p>
              <div className="tech-list">
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.id === "contact") {
    return (
      <section className="modal-section-content" id={descriptionId}>
        <p className="modal-body">{section.body}</p>

        <div className="contact-method-grid">
          {portfolioProfile.contactMethods.map((method) => (
            <ContactMethodCard key={method.id} method={method} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="modal-section-content" id={descriptionId}>
      <p className="modal-body">{section.body}</p>

      <div className="modal-highlight-grid">
        {section.highlights.map((highlight) => (
          <article key={highlight}>
            <span>Signal</span>
            <p>{highlight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type ContactMethodCardProps = {
  method: ContactMethod;
};

function ContactMethodCard({ method }: ContactMethodCardProps) {
  const content = (
    <>
      <span>{method.label}</span>
      <strong>{method.value}</strong>
      {method.pending && <em>Link pending</em>}
    </>
  );

  if (method.href) {
    return (
      <a className="contact-method-card" href={method.href}>
        {content}
      </a>
    );
  }

  return <div className="contact-method-card is-pending">{content}</div>;
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

  const previewImage = getProjectPreviewImage(activeProject);
  const projectLinks = getPortfolioProjectLinks(activeProject);
  const proofBlocks = [
    ["Problem", activeProject.problem],
    ["Solution", activeProject.solution],
    ["My Role", activeProject.role],
    ["Best Feature", activeProject.bestFeature],
  ].filter((item): item is [string, string] => Boolean(item[1]));

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
            <strong>Full-stack</strong>
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

              {previewImage ? (
                <img
                  src={previewImage}
                  alt={getProjectPreviewAlt(activeProject)}
                />
              ) : (
                <div className="preview-content">
                  <p>Screenshot</p>
                  <strong>{activeProject.title}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="project-detail-content">
            <p className="detail-kicker">Featured Project</p>
            <h3 id={`project-${activeProject.id}-title`}>
              {activeProject.title}
            </h3>

            <div className="project-badges">
              {activeProject.status && (
                <span>{activeProject.status.replace("-", " ")}</span>
              )}
              {activeProject.category && (
                <span>{activeProject.category.replace("-", " ")}</span>
              )}
            </div>

            <p className="project-description">{activeProject.description}</p>

            <div className="proof-grid">
              {proofBlocks.map(([title, text]) => (
                <ProofBlock key={title} title={title} text={text} />
              ))}
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

              {activeProject.demoUrl && (
                <a href={activeProject.demoUrl} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              )}

              {projectLinks.map((link) => (
                <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}

              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>

            <ProjectAvailabilityNotes project={activeProject} />
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

function ProjectAvailabilityNotes({ project }: { project: PortfolioProject }) {
  if (!project.demoNote && (project.githubUrl || !project.repositoryNote)) {
    return null;
  }

  return (
    <div className="project-availability-notes">
      {project.demoNote && (
        <p className="project-availability-note">
          <strong>Demo:</strong> {project.demoNote}
        </p>
      )}

      {!project.githubUrl && project.repositoryNote && (
        <p className="project-availability-note">
          <strong>Repository:</strong> {project.repositoryNote}
        </p>
      )}
    </div>
  );
}
