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
  const galleryImages =
    project.galleryImages?.length
      ? project.galleryImages
      : previewImage
        ? [
            {
              src: previewImage,
              alt: getProjectPreviewAlt(project),
              label: "Project Preview",
              caption: project.shortDescription,
            },
          ]
        : [];
  const proofBlocks = [
    ["Challenge", project.problem],
    ["Product Approach", project.solution],
    ["My Role", project.role],
    ["Standout Feature", project.bestFeature],
    ["Impact", project.impact],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const primaryProofBlocks = proofBlocks.slice(0, 2);
  const supportingProofBlocks = proofBlocks.slice(2);

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
                View Live Project
              </a>
            )}

            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
          </div>
        </div>

        <ProjectMediaGallery
          images={galleryImages}
          fallbackTitle={project.title}
        />
      </section>

      <section className="project-page-case-study" aria-label="Project details">
        <div className="project-page-section-title">
          <p className="panel-label">Case Study</p>
          <h2>How the project works</h2>
        </div>

        <div className="project-page-story-grid">
          {primaryProofBlocks.map(([title, text]) => (
            <ProjectProofBlock key={title} title={title} text={text} />
          ))}
        </div>

        {supportingProofBlocks.length > 0 && (
          <div className="project-page-proof">
            {supportingProofBlocks.map(([title, text]) => (
              <ProjectProofBlock key={title} title={title} text={text} />
            ))}
          </div>
        )}
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
          const meta = [item.status, item.category]
            .filter(Boolean)
            .map((value) => value?.replace("-", " "))
            .join(" / ");

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
              <span>
                <strong>{item.title}</strong>
                {meta && <small>{meta}</small>}
              </span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}

type ProjectMediaGalleryProps = {
  images: {
    src: string;
    alt: string;
    label: string;
    caption: string;
  }[];
  fallbackTitle: string;
};

function ProjectMediaGallery({
  images,
  fallbackTitle,
}: ProjectMediaGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="project-page-media project-page-media-empty">
        <div className="project-preview-placeholder">Preview coming soon</div>
      </div>
    );
  }

  return (
    <div className="project-page-media" aria-label={`${fallbackTitle} visuals`}>
      {images.map((image, index) => (
        <figure
          className={`project-media-frame ${
            index === 0 ? "project-media-frame-primary" : ""
          }`}
          key={`${image.label}-${image.src}`}
        >
          <img src={image.src} alt={image.alt} />
          <figcaption>
            <span>{image.label}</span>
            <strong>{image.caption}</strong>
          </figcaption>
        </figure>
      ))}
    </div>
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
