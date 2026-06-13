import {
  courseItems,
  educationItems,
  experienceItems,
  getPortfolioProjectLinks,
  getProjectPreviewAlt,
  getProjectPreviewImage,
  languageItems,
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

      <section className="recruiter-section" aria-labelledby="experience-title">
        <div className="section-heading">
          <p className="panel-label">Experience</p>
          <h3 id="experience-title">Operations and delivery background</h3>
        </div>

        <div className="recruiter-experience-grid">
          {experienceItems.map((item) => (
            <article className="experience-card" key={`${item.company}-${item.role}`}>
              <span>{item.dates}</span>
              <h4>{item.company}</h4>
              <strong>
                {item.role} - {item.location}
              </strong>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="recruiter-section" aria-labelledby="education-title">
        <div className="section-heading">
          <p className="panel-label">Education</p>
          <h3 id="education-title">Education, courses, and languages</h3>
        </div>

        <div className="recruiter-education-grid">
          <article className="education-card">
            <span>Education</span>
            {educationItems.map((item) => (
              <div key={`${item.institution}-${item.dates}`}>
                <strong>{item.institution}</strong>
                <p>
                  {item.credential} - {item.dates}
                </p>
                {item.details.map((detail) => (
                  <small key={detail}>{detail}</small>
                ))}
              </div>
            ))}
          </article>

          <article className="education-card">
            <span>Courses</span>
            <ul>
              {courseItems.map((course) => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          </article>

          <article className="education-card">
            <span>Languages</span>
            <div className="language-list">
              {languageItems.map((item) => (
                <p key={item.language}>
                  <strong>{item.language}</strong>
                  <small>{item.level}</small>
                </p>
              ))}
            </div>
          </article>
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
            Direct contact details from Mike's CV, plus GitHub, the live
            SmartGarage project, and a downloadable resume.
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
  const projectLinks = getPortfolioProjectLinks(project);
  const status = formatProjectMeta(project.status);
  const category = formatProjectMeta(project.category);

  return (
    <article
      className={`recruiter-project-card ${featured ? "is-featured" : ""}`}
    >
      {previewImage ? (
        <img
          src={previewImage}
          alt={getProjectPreviewAlt(project)}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <div className="project-preview-empty">Screenshot unavailable</div>
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
          {projectLinks.map((link) => (
            <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>

        <ProjectAvailabilityNotes project={project} />
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
