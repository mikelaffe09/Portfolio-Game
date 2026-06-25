import {
  courseItems,
  educationItems,
  experienceItems,
  getPortfolioProjectLinks,
  languageItems,
  portfolioProfile,
  portfolioProjects,
  skillGroups,
  type ContactMethod,
  type PortfolioProject,
} from "../data/portfolioData";

type Props = {
  visible: boolean;
  onBackToGame: () => void;
  onOpenProjectPage: (projectId: string) => void;
};

const resumeMethod = portfolioProfile.contactMethods.find(
  (method) => method.id === "resume"
);
const resumeHeaderContactIds = new Set(["phone", "email-primary", "github"]);

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
  onOpenProjectPage,
}: Props) {
  if (!visible) return null;

  const headerContactMethods = portfolioProfile.contactMethods.filter((method) =>
    resumeHeaderContactIds.has(method.id)
  );

  return (
    <section
      className="recruiter-mode resume-view"
      aria-labelledby="resume-view-title"
    >
      <div className="resume-document">
        <header className="resume-header">
          <div>
            <p className="panel-label">Resume View</p>
            <h2 id="resume-view-title">{portfolioProfile.name}</h2>
            <p className="resume-role">{portfolioProfile.role}</p>
            <p className="resume-availability">
              {portfolioProfile.availability}
            </p>
          </div>

          <div className="resume-header-actions">
            {resumeMethod?.href && (
              <a href={resumeMethod.href} download>
                Download PDF
              </a>
            )}
            <button type="button" onClick={onBackToGame}>
              Back to Game View
            </button>
          </div>

          <ul className="resume-contact-line" aria-label="Primary contact">
            <li>{portfolioProfile.location}</li>
            {headerContactMethods.map((method) => (
              <li key={method.id}>
                {method.href ? (
                  <a href={method.href}>{method.value}</a>
                ) : (
                  method.value
                )}
              </li>
            ))}
          </ul>
        </header>

        <section className="resume-section" aria-labelledby="summary-title">
          <div className="resume-section-heading">
            <p className="panel-label">01</p>
            <h3 id="summary-title">Summary</h3>
          </div>

          <div className="resume-summary-content">
            <p className="resume-summary-lead">
              {portfolioProfile.professionalSummary}
            </p>
            <ul className="resume-bullet-list">
              {portfolioProfile.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="resume-section" aria-labelledby="skills-title">
          <div className="resume-section-heading">
            <p className="panel-label">02</p>
            <h3 id="skills-title">Skills</h3>
          </div>

          <div className="resume-skill-list">
            {skillGroups.map((group) => (
              <div className="resume-skill-row" key={group.title}>
                <strong>{group.title}</strong>
                <p>{group.skills.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="projects-title">
          <div className="resume-section-heading">
            <p className="panel-label">03</p>
            <h3 id="projects-title">Projects</h3>
          </div>

          <div className="resume-entry-list">
            {portfolioProjects.map((project) => (
              <ResumeProjectEntry
                key={project.id}
                project={project}
                onOpenProjectPage={onOpenProjectPage}
              />
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="experience-title">
          <div className="resume-section-heading">
            <p className="panel-label">04</p>
            <h3 id="experience-title">Experience</h3>
          </div>

          <div className="resume-entry-list">
            {experienceItems.map((item) => (
              <article
                className="resume-entry"
                key={`${item.company}-${item.role}`}
              >
                <div className="resume-entry-head">
                  <div>
                    <h4>{item.company}</h4>
                    <p className="resume-entry-subtitle">
                      {item.role} - {item.location}
                    </p>
                  </div>
                  <span>{item.dates}</span>
                </div>

                <ul className="resume-bullet-list">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="education-title">
          <div className="resume-section-heading">
            <p className="panel-label">05</p>
            <h3 id="education-title">Education</h3>
          </div>

          <div className="resume-education-grid">
            <article className="resume-education-block">
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

            <article className="resume-education-block">
              <span>Courses</span>
              <ul className="resume-bullet-list">
                {courseItems.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </article>

            <article className="resume-education-block">
              <span>Languages</span>
              <div className="resume-language-list">
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

        <section className="resume-section" aria-labelledby="contact-title">
          <div className="resume-section-heading">
            <p className="panel-label">06</p>
            <h3 id="contact-title">Contact</h3>
          </div>

          <div className="resume-contact-panel">
            <p>
              Direct contact details, GitHub, live project link, and downloadable
              resume.
            </p>
            <div className="contact-method-grid">
              {portfolioProfile.contactMethods.map((method) => (
                <ContactMethodCard key={method.id} method={method} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

type ResumeProjectEntryProps = {
  project: PortfolioProject;
  onOpenProjectPage: (projectId: string) => void;
};

function ResumeProjectEntry({
  project,
  onOpenProjectPage,
}: ResumeProjectEntryProps) {
  const projectLinks = getPortfolioProjectLinks(project);
  const status = formatProjectMeta(project.status);
  const category = formatProjectMeta(project.category);
  const metaItems = [status, category].filter(
    (item): item is string => Boolean(item)
  );

  return (
    <article className="resume-entry">
      <div className="resume-entry-head">
        <div>
          <h4>{project.title}</h4>
          {metaItems.length > 0 && (
            <p className="resume-entry-meta">{metaItems.join(" - ")}</p>
          )}
        </div>
        <span>{project.tech.slice(0, 6).join(", ")}</span>
      </div>

      <p>{project.shortDescription}</p>
      <strong>{project.impact}</strong>

      <div className="resume-project-links">
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
