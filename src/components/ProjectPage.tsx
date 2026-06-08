import {
  getProjectPreviewAlt,
  getProjectPreviewImage,
  type PortfolioProject,
} from "../data/portfolioData";

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
  const previewImage = getProjectPreviewImage(project);
  const proofBlocks = [
    ["Problem", project.problem],
    ["Solution", project.solution],
    ["My Role", project.role],
    ["Best Feature", project.bestFeature],
    ["Impact", project.impact],
  ].filter((item): item is [string, string] => Boolean(item[1]));

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
          <p className="project-page-short">{project.shortDescription}</p>
          <p>{project.description}</p>

          <div className="project-badges">
            {project.status && <span>{project.status.replace("-", " ")}</span>}
            {project.category && <span>{project.category.replace("-", " ")}</span>}
          </div>

          <div className="tech-list">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <div className="project-actions">
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

        {previewImage ? (
          <img
            className="project-page-preview"
            src={previewImage}
            alt={getProjectPreviewAlt(project)}
          />
        ) : (
          <div className="project-page-preview project-preview-placeholder">
            Preview coming soon
          </div>
        )}
      </section>

      <section className="project-page-proof" aria-label="Project details">
        {proofBlocks.map(([title, text]) => (
          <ProjectProofBlock key={title} title={title} text={text} />
        ))}
      </section>

      {(project.lessons?.length || project.nextImprovements?.length) && (
        <section className="project-page-learning" aria-label="Project learning">
          {project.lessons?.length && (
            <article>
              <span>Lessons</span>
              <ul>
                {project.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </article>
          )}

          {project.nextImprovements?.length && (
            <article>
              <span>Next Improvements</span>
              <ul>
                {project.nextImprovements.map((improvement) => (
                  <li key={improvement}>{improvement}</li>
                ))}
              </ul>
            </article>
          )}
        </section>
      )}

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
              {getProjectPreviewImage(item) ? (
                <img src={getProjectPreviewImage(item)} alt="" />
              ) : (
                <span className="switcher-preview-placeholder" aria-hidden="true" />
              )}
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
