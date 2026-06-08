export const stationOrder = ["about", "skills", "projects", "contact"] as const;

export type StationId = (typeof stationOrder)[number];

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  role: string;
  bestFeature: string;
  impact: string;
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
};

export type PortfolioSection = {
  id: StationId;
  title: string;
  subtitle: string;
  body: string;
  summary: string;
  accent: string;
  sceneColor: [number, number, number];
  projects?: PortfolioProject[];
};

export const portfolioSections: PortfolioSection[] = [
  {
    id: "about",
    title: "About Me",
    subtitle: "Frontend developer",
    summary: "Human-centered interfaces with a playful technical edge.",
    accent: "#ff6b6b",
    sceneColor: [255, 107, 107],
    body: "I build clean, responsive, and interactive web experiences with React, TypeScript, and modern frontend tools. This portfolio is designed to show both technical ability and product creativity.",
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Technical toolkit",
    summary: "The tools behind the build.",
    accent: "#2dd4bf",
    sceneColor: [45, 212, 191],
    body: "React, TypeScript, JavaScript, HTML, CSS, responsive design, APIs, Git, frontend architecture, UI implementation, and interactive web experiences.",
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Selected work",
    summary: "A few builds with product shape and personality.",
    accent: "#f8c537",
    sceneColor: [248, 197, 55],
    body: "Selected projects that show product thinking, frontend execution, interaction design, and the ability to turn an idea into a working product.",
    projects: [
      {
        id: "chapterkeep",
        title: "ChapterKeep",
        description:
          "A mobile reading tracker app with books, reading sessions, streaks, stats, and progress tracking.",
        problem:
          "Readers often lose track of what they are reading, how consistent they are, and whether they are actually building a habit.",
        solution:
          "ChapterKeep turns reading into a structured progress system with sessions, streaks, book tracking, and personal reading stats.",
        role: "Frontend/mobile development, UI flow planning, feature structure, Supabase integration planning.",
        bestFeature:
          "Reading session tracking with progress, streak motivation, and personal reading insights.",
        impact:
          "Turns reading into a measurable habit instead of a vague goal.",
        tech: ["React Native", "Expo", "TypeScript", "Supabase"],
      },
      {
        id: "salon-website",
        title: "Salon Website",
        description:
          "A modern service-business website with an animated hero section, service cards, and polished visual structure.",
        problem:
          "Many local business websites look generic, outdated, and fail to make the business feel premium.",
        solution:
          "The website uses stronger layout, animation, and visual hierarchy to make the brand feel more professional and trustworthy.",
        role: "Frontend development, visual redesign, animation improvement, layout cleanup.",
        bestFeature:
          "Animated hero section designed to feel more custom and less template-generated.",
        impact:
          "Improves the first impression and makes the business easier to trust.",
        tech: ["React", "Vite", "CSS", "Animation"],
      },
      {
        id: "portfolio-game",
        title: "Portfolio Game",
        description:
          "An interactive portfolio where visitors explore sections through a small game-like interface.",
        problem:
          "Most portfolios are boring, static, and forgettable. They list skills instead of proving them.",
        solution:
          "This portfolio turns navigation into an interactive experience while still keeping recruiter-friendly content available.",
        role: "Concept, frontend development, game interaction, UI systems, project structure.",
        bestFeature:
          "Guided station progression that unlocks portfolio sections in order.",
        impact:
          "The portfolio itself becomes a work sample, not just a container for work samples.",
        tech: ["React", "TypeScript", "Kaboom", "CSS"],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Work with me",
    summary: "A clear launch pad for the next conversation.",
    accent: "#a78bfa",
    sceneColor: [167, 139, 250],
    body: "Add your real email, LinkedIn, GitHub, and resume link here before publishing. This should be simple, direct, and impossible to miss.",
  },
];