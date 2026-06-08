import chapterkeepPreview from "../assets/projects/chapterkeep-preview.png";
import portfolioGamePreview from "../assets/projects/portfolio-game-preview.png";
import salonWebsitePreview from "../assets/projects/salon-website-preview.png";

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
  previewImage: string;
  previewAlt: string;
  path: string;
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
          "A mobile reading tracker that turns books, reading sessions, streaks, and personal stats into a simple habit-building flow.",
        problem:
          "Readers often start with motivation but lose the thread across multiple books, inconsistent sessions, and vague goals. The core product challenge was making progress feel visible without turning reading into admin work.",
        solution:
          "ChapterKeep organizes the habit around lightweight session logging, book-level progress, streak feedback, and dashboard stats. The interface prioritizes quick entry, scannable progress, and encouraging signals after every session.",
        role: "Planned the mobile flow, structured the app screens, designed the reading-session interaction, and mapped the frontend data model for future Supabase persistence.",
        bestFeature:
          "The reading session flow: a focused timer/progress interaction that gives readers an immediate sense of momentum after logging time.",
        impact:
          "Turns a vague goal like 'read more' into a measurable loop of sessions, streaks, and completed books.",
        tech: ["React Native", "Expo", "TypeScript", "Supabase"],
        previewImage: chapterkeepPreview,
        previewAlt:
          "ChapterKeep mobile reading tracker preview with progress, streak, and session dashboard screens.",
        path: "/projects/chapterkeep",
      },
      {
        id: "salon-website",
        title: "Salon Website",
        description:
          "A premium service-business website concept with a polished hero, service discovery, appointment-oriented calls to action, and a cleaner visual hierarchy.",
        problem:
          "Local service websites often bury the reason to book: the page looks generic, services blur together, and the first impression does not match the quality of the business.",
        solution:
          "The redesign uses a stronger hero composition, service cards with clearer hierarchy, smoother motion, and a more refined palette to make the business feel trustworthy before a visitor reads every detail.",
        role: "Led the frontend implementation, tightened the visual system, improved animation timing, and reorganized page sections around booking intent.",
        bestFeature:
          "A custom-feeling hero and service preview system that quickly communicates polish, specialty, and next action.",
        impact:
          "Improves perceived quality and gives visitors a clearer path from landing on the site to choosing a service.",
        tech: ["React", "Vite", "CSS", "Animation"],
        previewImage: salonWebsitePreview,
        previewAlt:
          "Salon website preview shown in a laptop browser with a polished hero area and service cards.",
        path: "/projects/salon-website",
      },
      {
        id: "portfolio-game",
        title: "Portfolio Game",
        description:
          "An interactive portfolio experience where visitors explore sections through a guided mini-game while still having fast, recruiter-friendly access to the full content.",
        problem:
          "Most junior portfolio sites rely on static cards and generic claims. The challenge was to make the portfolio itself demonstrate frontend execution, interaction design, and product judgment without frustrating visitors who just need the facts.",
        solution:
          "Signal Run turns navigation into a station-based route with unlockable sections, modal case studies, mobile fallback navigation, and dedicated project pages for deeper review.",
        role: "Owned the concept, React architecture, Kaboom scene integration, responsive UI, modal accessibility, preview asset workflow, and route handling.",
        bestFeature:
          "The dual-mode experience: visitors can play through the route or jump straight into the full portfolio when speed matters.",
        impact:
          "Makes the portfolio a live work sample while preserving the scanning speed that recruiters and collaborators need.",
        tech: ["React", "TypeScript", "Kaboom", "CSS"],
        previewImage: portfolioGamePreview,
        previewAlt:
          "Signal Run portfolio game preview with a glowing route map, station nodes, and project panels.",
        path: "/projects/portfolio-game",
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

export const portfolioProjects =
  portfolioSections.find((section) => section.id === "projects")?.projects ?? [];

export function getPortfolioProject(projectId: string) {
  return portfolioProjects.find((project) => project.id === projectId) ?? null;
}
