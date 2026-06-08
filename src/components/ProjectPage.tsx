import type { PortfolioProject } from "../data/portfolioData";

type Props = {
  project: PortfolioProject;
  projects: PortfolioProject[];
  onNavigateHome: () => void;
  onNavigateProject: (projectId: string) => void;
};

export default function ProjectPage({
  project,
  projects,
  onNavigateHome,
  onNavigateProject,
}: Props) {
  return (
    <main className="project-page">
      <header className="project-page-top">
        <button type="button" onClick={onNavigateHome}>
          Back to Signal Run
        </button>
        <span>Project Page</span>
      </header>

      <section className="project-page-hero" aria-labelledby="project-title">
        <div className="project-page-copy">
          <p className="panel-label">Selected Work</p>
          <h1 id="project-title">{project.title}</h1>
          <p>{project.description}</p>

          <div className="tech-list">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <div className="project-actions">
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                Live Demo
              </a>
            ) : (
              <button type="button" disabled>
                Demo Coming Soon
              </button>
            )}

            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : (
              <button type="button" disabled>
                GitHub Coming Soon
              </button>
            )}
          </div>
        </div>

        <img
          className="project-page-preview"
          src={project.previewImage}
          alt={project.previewAlt}
        />
      </section>

      <section className="project-page-proof" aria-label="Project details">
        <ProjectProofBlock title="Problem" text={project.problem} />
        <ProjectProofBlock title="Solution" text={project.solution} />
        <ProjectProofBlock title="My Role" text={project.role} />
        <ProjectProofBlock title="Best Feature" text={project.bestFeature} />
        <ProjectProofBlock title="Impact" text={project.impact} />
      </section>

      <nav className="project-page-switcher" aria-label="More projects">
        {projects.map((item) => {
          const isCurrentProject = item.id === project.id;

          return (
            <button
              className={isCurrentProject ? "is-active" : ""}
              key={item.id}
              type="button"
              disabled={isCurrentProject}
              onClick={() => onNavigateProject(item.id)}
            >
              <img src={item.previewImage} alt="" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}

type ProjectProofBlockProps = {
  title: string;
  text: string;
};

function ProjectProofBlock({ title, text }: ProjectProofBlockProps) {
  return (
    <article className="project-proof-block">
      <span>{title}</span>
      <p>{text}</p>
    </article>
  );
}
