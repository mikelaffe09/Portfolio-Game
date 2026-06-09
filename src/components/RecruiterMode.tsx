import {
  getProjectPreviewAlt,
  getProjectPreviewImage,
  portfolioProfile,
  portfolioProjects,
  skillGroups,
  type ContactMethod,
  type PortfolioProject,
  type StationId,
} from "../data/portfolioData";

type Props = {
  visible: boolean;
  onBackToGame: () => void;
  onOpenSection: (sectionId: StationId) => void;
  onOpenProjectPage: (projectId: string) => void;
};

function formatProjectMeta(value: string | undefined) {
  if (!value) return null;

  return value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RecruiterMode({
  visible,
  onBackToGame,
  onOpenSection,
  onOpenProjectPage,
}: Props) {
  if (!visible) return null;

  return (
    <section className="recruiter-mode" aria-labelledby="recruiter-title">
      <div className="recruiter-hero">
        <div>
          <p className="panel-label">Traditional Portfolio</p>
          <h2 id="recruiter-title">
            {portfolioProfile.name} - {portfolioProfile.role}
          </h2>
          <p>{portfolioProfile.professionalSummary}</p>

          <div className="recruiter-hero-actions">
            <button type="button" onClick={() => onOpenSection("projects")}>
              Review Projects
            </button>
            <button type="button" onClick={() => onOpenSection("contact")}>
              Contact
            </button>
            <button type="button" onClick={onBackToGame}>
              Back to Game Mode
            </button>
          </div>
        </div>

        <aside className="recruiter-snapshot" aria-label="Portfolio snapshot">
          <span>{portfolioProfile.location}</span>
          <strong>{portfolioProfile.availability}</strong>
          <ul>
            {portfolioProfile.currentFocus.map((focus) => (
              <li key={focus}>{focus}</li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="recruiter-section" aria-labelledby="skills-title">
        <div className="section-heading">
          <p className="panel-label">Capabilities</p>
          <h3 id="skills-title">Skills by category</h3>
        </div>

        <div className="recruiter-skill-grid">
          {skillGroups.map((group) => (
            <article className="recruiter-skill-card" key={group.title}>
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

      <section className="recruiter-section" aria-labelledby="projects-title">
        <div className="section-heading">
          <p className="panel-label">Featured Work</p>
          <h3 id="projects-title">Selected projects</h3>
        </div>

        <div className="recruiter-projects">
          {portfolioProjects.map((project, index) => (
            <RecruiterProjectCard
              key={project.id}
              project={project}
              featured={index === 0}
              onOpenProjectPage={onOpenProjectPage}
            />
          ))}
        </div>
      </section>

      <section className="recruiter-contact" aria-labelledby="contact-title">
        <div>
          <p className="panel-label">Next Step</p>
          <h3 id="contact-title">Contact and professional links</h3>
          <p>
            Replace these placeholders with real links before publishing. Missing
            URLs are shown as non-clickable placeholders so visitors never hit a
            broken link.
          </p>
        </div>

        <div className="contact-method-grid">
          {portfolioProfile.contactMethods.map((method) => (
            <ContactMethodCard key={method.id} method={method} />
          ))}
        </div>
      </section>
    </section>
  );
}

type RecruiterProjectCardProps = {
  featured: boolean;
  project: PortfolioProject;
  onOpenProjectPage: (projectId: string) => void;
};

function RecruiterProjectCard({
  featured,
  project,
  onOpenProjectPage,
}: RecruiterProjectCardProps) {
  const previewImage = getProjectPreviewImage(project);
  const status = formatProjectMeta(project.status);
  const category = formatProjectMeta(project.category);

  return (
    <article
      className={`recruiter-project-card ${featured ? "is-featured" : ""}`}
    >
      {previewImage ? (
        <img src={previewImage} alt={getProjectPreviewAlt(project)} />
      ) : (
        <div className="project-preview-placeholder">Preview</div>
      )}

      <div>
        <div className="project-badges">
          {status && <span>{status}</span>}
          {category && <span>{category}</span>}
        </div>
        <h4>{project.title}</h4>
        <p>{project.shortDescription}</p>
        <strong>{project.impact}</strong>

        <div className="tech-list">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="project-actions">
          <a
            href={project.path}
            onClick={(event) => {
              event.preventDefault();
              onOpenProjectPage(project.id);
            }}
          >
            Case Study
          </a>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
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
      {method.placeholder && <em>TODO: replace before publishing</em>}
    </>
  );

  if (method.href) {
    return (
      <a className="contact-method-card" href={method.href}>
        {content}
      </a>
    );
  }

  return <div className="contact-method-card is-placeholder">{content}</div>;
}
