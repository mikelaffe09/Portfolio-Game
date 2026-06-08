export type PortfolioProject = {
  title: string;
  description: string;
  impact: string;
  tech: string[];
  demoUrl?: string;
  githubUrl?: string;
};

export type PortfolioStat = {
  label: string;
  value: string;
};

export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioSection = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  summary: string;
  accent: string;
  sceneColor: [number, number, number];
  stats?: PortfolioStat[];
  bullets?: string[];
  links?: PortfolioLink[];
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
    body: "I build clean, responsive, and interactive web experiences with React, TypeScript, and modern frontend tools. I care about interfaces that feel fast, readable, and a little memorable.",
    stats: [
      { label: "Focus", value: "UI systems" },
      { label: "Style", value: "Polished and practical" },
      { label: "Mode", value: "Prototype to ship" },
    ],
    bullets: [
      "Turn rough ideas into focused product screens.",
      "Build components that stay readable as projects grow.",
      "Balance visual polish with performance and accessibility.",
    ],
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Technical toolkit",
    summary: "The tools behind the build, tuned for frontend product work.",
    accent: "#2dd4bf",
    sceneColor: [45, 212, 191],
    body: "React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, responsive design, APIs, Git, UI implementation, and frontend architecture.",
    stats: [
      { label: "Core", value: "React + TypeScript" },
      { label: "Design", value: "Responsive UI" },
      { label: "Workflow", value: "Git + APIs" },
    ],
    bullets: [
      "Component architecture and stateful interfaces.",
      "Accessible layouts for mobile and desktop screens.",
      "API-driven screens, forms, dashboards, and flows.",
    ],
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Selected work",
    summary: "A few builds with product shape, interaction, and personality.",
    accent: "#f8c537",
    sceneColor: [248, 197, 55],
    body: "These are some of the projects I have built. Add final project URLs when you are ready to publish.",
    stats: [
      { label: "Featured", value: "3 builds" },
      { label: "Stack", value: "Web + mobile" },
      { label: "Theme", value: "Interactive UI" },
    ],
    projects: [
      {
        title: "ChapterKeep",
        description: "A mobile reading tracker app with books, streaks, sessions, and reading stats.",
        impact: "Turns a daily habit into a lightweight progress loop.",
        tech: ["React Native", "Expo", "Supabase", "TypeScript"],
      },
      {
        title: "Salon Website",
        description: "A modern business website with animated hero sections and service pages.",
        impact: "Gives a service brand a clearer path from interest to booking.",
        tech: ["React", "Vite", "CSS", "Animation"],
      },
      {
        title: "Portfolio Game",
        description: "An interactive portfolio where visitors explore projects through a game-like interface.",
        impact: "Makes the portfolio itself part of the work sample.",
        tech: ["React", "TypeScript", "Kaboom"],
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
    body: "Add your real email, LinkedIn, GitHub, and resume link here before you publish. The layout is ready for a simple recruiter-friendly contact card.",
    stats: [
      { label: "Best fit", value: "Frontend roles" },
      { label: "Availability", value: "Open to talk" },
      { label: "Format", value: "Remote or hybrid" },
    ],
    links: [
      { label: "Email", href: "mailto:hello@example.com" },
      { label: "GitHub", href: "https://github.com/your-username" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/your-profile" },
      { label: "Resume", href: "#" },
    ],
  },
];
