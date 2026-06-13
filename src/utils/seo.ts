import {
  portfolioProfile,
  type PortfolioProject,
} from "../data/portfolioData";

type SeoMetadata = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  type: "website" | "article";
};

const siteBaseUrl = "https://mikelaffe09.github.io/portfolio-game";
const defaultTitle = "Mike Allaffi - Developer Portfolio";
const defaultDescription =
  "Interactive developer portfolio with React, React Native, full-stack, AI/RAG, experience, selected projects, and contact details.";
const defaultImageUrl = `${siteBaseUrl}/social-preview.webp`;
const defaultImageAlt =
  "Mike Allaffi interactive developer portfolio preview.";

function getCanonicalUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath === "/") {
    return `${siteBaseUrl}/`;
  }

  return `${siteBaseUrl}${normalizedPath}`;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

export function getHomeSeo(): SeoMetadata {
  return {
    title: defaultTitle,
    description: defaultDescription,
    url: getCanonicalUrl(),
    image: defaultImageUrl,
    imageAlt: defaultImageAlt,
    type: "website",
  };
}

export function getProjectSeo(
  project: PortfolioProject | null,
  projectId: string
): SeoMetadata {
  if (!project) {
    return {
      title: `Project Not Found | ${portfolioProfile.name}`,
      description: defaultDescription,
      url: getCanonicalUrl(`/projects/${projectId}`),
      image: defaultImageUrl,
      imageAlt: defaultImageAlt,
      type: "website",
    };
  }

  return {
    title: `${project.title} Case Study | ${portfolioProfile.name}`,
    description: project.shortDescription,
    url: getCanonicalUrl(project.path),
    image: defaultImageUrl,
    imageAlt: `${project.title} case study from Mike Allaffi's developer portfolio.`,
    type: "article",
  };
}

export function updateDocumentMetadata(metadata: SeoMetadata) {
  document.title = metadata.title;
  setCanonical(metadata.url);

  setMeta("name", "description", metadata.description);
  setMeta("name", "robots", "index, follow");

  setMeta("property", "og:title", metadata.title);
  setMeta("property", "og:description", metadata.description);
  setMeta("property", "og:type", metadata.type);
  setMeta("property", "og:url", metadata.url);
  setMeta("property", "og:image", metadata.image);
  setMeta("property", "og:image:secure_url", metadata.image);
  setMeta("property", "og:image:type", "image/webp");
  setMeta("property", "og:image:width", "1672");
  setMeta("property", "og:image:height", "941");
  setMeta("property", "og:image:alt", metadata.imageAlt);

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", metadata.title);
  setMeta("name", "twitter:description", metadata.description);
  setMeta("name", "twitter:image", metadata.image);
  setMeta("name", "twitter:image:alt", metadata.imageAlt);
}
