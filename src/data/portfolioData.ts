import chapterkeepPreview from "../assets/projects/chapterkeep-preview.png";
import portfolioGamePreview from "../assets/projects/portfolio-game-preview.png";
import salonWebsitePreview from "../assets/projects/salon-website-preview.png";

export const stationOrder = ["about", "skills", "projects", "contact"] as const;

export type StationId = (typeof stationOrder)[number];

export type ProjectStatus = "live" | "in-progress" | "private" | "case-study";
export type ProjectCategory =
  | "web"
  | "mobile"
  | "full-stack"
  | "frontend"
  | "backend";

export type SkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

export type ContactMethod = {
  id: string;
  label: string;
  value: string;
  href?: string;
  placeholder?: boolean;
};

export type PortfolioProfile = {
  name: string;
  role: string;
  location: string;
  availability: string;
  summary: string;
  professionalSummary: string;
  strengths: string[];
  currentFocus: string[];
  contactMethods: ContactMethod[];
};

export type PortfolioProject = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  problem?: string;
  solution?: string;
  role?: string;
  bestFeature?: string;
  impact: string;
  tech: string[];
  status?: ProjectStatus;
  category?: ProjectCategory;
  screenshotUrl?: string;
  previewImage?: string;
  previewAlt?: string;
  path: string;
  demoUrl?: string;
  githubUrl?: string;
  lessons?: string[];
  nextImprovements?: string[];
};

export type PortfolioSection = {
  id: StationId;
  title: string;
  subtitle: string;
  zoneTitle: string;
  mission: string;
  body: string;
  summary: string;
  highlights: string[];
  accent: string;
  sceneColor: [number, number, number];
  projects?: PortfolioProject[];
};

export const portfolioProfile: PortfolioProfile = {
  // TODO: Replace with your real name before publishing.
  name: "Your Name",
  role: "Frontend Developer",
  // TODO: Replace with your city/region or remove location if preferred.
  location: "Your City, State",
  availability: "Open to frontend roles, freelance builds, and product-focused web projects.",
  summary:
    "Frontend developer focused on building polished, responsive, and interactive web experiences with React, TypeScript, and modern CSS.",
  professionalSummary:
    "I care about the full path from idea to usable interface: clear information architecture, responsive implementation, accessible interactions, and enough product judgment to keep the experience useful for real visitors. This portfolio uses a game layer to demonstrate interaction craft while preserving a fast traditional review path for recruiters and clients.",
  strengths: [
    "Translates product goals into clear, usable frontend flows.",
    "Builds responsive React interfaces with TypeScript and maintainable CSS.",
    "Adds motion and interactivity where it improves comprehension, feedback, or delight.",
  ],
  currentFocus: [
    "Frontend roles using React, TypeScript, and modern UI systems.",
    "Interactive portfolio, dashboard, and marketing-site experiences.",
    "Accessible, recruiter-friendly product presentation.",
  ],
  contactMethods: [
    {
      id: "email",
      label: "Email",
      // TODO: Replace with your real email address before publishing.
      value: "TODO: your.email@example.com",
      placeholder: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      // TODO: Add your real LinkedIn profile URL before publishing.
      value: "TODO: LinkedIn profile",
      placeholder: true,
    },
    {
      id: "github",
      label: "GitHub",
      // TODO: Add your real GitHub profile URL before publishing.
      value: "TODO: GitHub profile",
      placeholder: true,
    },
    {
      id: "resume",
      label: "Resume",
      // TODO: Add a real resume PDF or hosted resume URL before publishing.
      value: "TODO: Resume link",
      placeholder: true,
    },
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend Engineering",
    description: "Core tools for building responsive, typed, maintainable UI.",
    skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Vite"],
  },
  {
    title: "Interface Craft",
    description: "The details that make product screens feel clear and polished.",
    skills: [
      "Responsive design",
      "Accessibility",
      "Animation timing",
      "Design systems",
      "Stateful UI",
    ],
  },
  {
    title: "Product Delivery",
    description: "Workflow and implementation habits for shipping practical work.",
    skills: ["Git", "API integration", "Frontend architecture", "Testing mindset"],
  },
  {
    title: "Interactive Experiences",
    description: "Lightweight game and canvas work for memorable web experiences.",
    skills: ["Kaboom", "Canvas UI", "Microinteractions", "Game feel"],
  },
];

export const portfolioSections: PortfolioSection[] = [
  {
    id: "about",
    title: "About Me",
    subtitle: "Frontend developer",
    zoneTitle: "Origin Terminal",
    mission: "Start the route and learn how I think about product-minded UI.",
    summary: "Human-centered interfaces with a playful technical edge.",
    accent: "#ff6b6b",
    sceneColor: [255, 107, 107],
    body: portfolioProfile.professionalSummary,
    highlights: [
      ...portfolioProfile.strengths,
    ],
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Technical toolkit",
    zoneTitle: "Skill Reactor",
    mission: "Scan the core tools I use to ship polished frontend work.",
    summary: "The tools behind the build.",
    accent: "#2dd4bf",
    sceneColor: [45, 212, 191],
    body: "A practical frontend toolkit organized around engineering fundamentals, interface quality, delivery habits, and interactive web experiences.",
    highlights: [
      ...skillGroups.map((group) => `${group.title}: ${group.skills.join(", ")}.`),
    ],
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Selected work",
    zoneTitle: "Project Gate",
    mission: "Enter the showcase and review selected work with context.",
    summary: "A few builds with product shape and personality.",
    accent: "#f8c537",
    sceneColor: [248, 197, 55],
    body: "Selected projects that show product thinking, frontend execution, interaction design, and the ability to turn an idea into a working product.",
    highlights: [
      "Case-study style project details for fast review.",
      "Screenshots, impact statements, tech tags, and role summaries.",
      "A mix of mobile, service-business, and interactive portfolio work.",
    ],
    projects: [
      {
        id: "chapterkeep",
        title: "ChapterKeep",
        shortDescription:
          "A mobile reading habit tracker focused on quick session logging and visible progress.",
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
        status: "case-study",
        category: "mobile",
        screenshotUrl: chapterkeepPreview,
        previewImage: chapterkeepPreview,
        previewAlt:
          "ChapterKeep mobile reading tracker preview with progress, streak, and session dashboard screens.",
        path: "/projects/chapterkeep",
        lessons: [
          "Habit loops need quick feedback more than dense tracking controls.",
          "Mobile flows benefit from short, focused data-entry moments.",
        ],
        nextImprovements: [
          "Add persistent sync and richer reading-goal analytics.",
          "Prototype social or recommendation features after the core loop is proven.",
        ],
      },
      {
        id: "salon-website",
        title: "Salon Website",
        shortDescription:
          "A premium service-business website concept designed around trust, polish, and booking intent.",
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
        status: "case-study",
        category: "web",
        screenshotUrl: salonWebsitePreview,
        previewImage: salonWebsitePreview,
        previewAlt:
          "Salon website preview shown in a laptop browser with a polished hero area and service cards.",
        path: "/projects/salon-website",
        lessons: [
          "Service websites need trust, clarity, and booking intent above novelty.",
          "Small motion details can make a simple marketing site feel more premium.",
        ],
        nextImprovements: [
          "Add a booking flow prototype and testimonials section.",
          "Refine service comparison content for faster decision-making.",
        ],
      },
      {
        id: "portfolio-game",
        title: "Portfolio Game",
        shortDescription:
          "An interactive portfolio hub with a playable game route and a fast recruiter review mode.",
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
        status: "in-progress",
        category: "frontend",
        screenshotUrl: portfolioGamePreview,
        previewImage: portfolioGamePreview,
        previewAlt:
          "Signal Run portfolio game preview with a glowing route map, station nodes, and project panels.",
        path: "/projects/portfolio-game",
        lessons: [
          "Interactive portfolios still need a fast traditional path.",
          "Game state and React UI state should have a clear ownership boundary.",
        ],
        nextImprovements: [
          "Add more world polish without adding unnecessary dependencies.",
          "Expand project filtering once more work is added.",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Work with me",
    zoneTitle: "Signal Tower",
    mission: "Finish the run and find the next-step contact launch pad.",
    summary: "A clear launch pad for the next conversation.",
    accent: "#a78bfa",
    sceneColor: [167, 139, 250],
    body: "Use this section as the direct next step for hiring managers, collaborators, and clients. Replace the placeholder contact details before publishing.",
    highlights: [
      "Replace placeholder contact details before publishing.",
      "Keep the next action direct for recruiters and collaborators.",
      "Use this section as the final conversion point after the game route.",
    ],
  },
];

export const portfolioSectionById = Object.fromEntries(
  portfolioSections.map((section) => [section.id, section])
) as Record<StationId, PortfolioSection>;

export const portfolioProjects =
  portfolioSectionById.projects.projects ?? [];

export function getPortfolioProject(projectId: string) {
  return portfolioProjects.find((project) => project.id === projectId) ?? null;
}

export function getProjectPreviewImage(project: PortfolioProject) {
  return project.screenshotUrl ?? project.previewImage ?? "";
}

export function getProjectPreviewAlt(project: PortfolioProject) {
  return project.previewAlt ?? `${project.title} project preview.`;
}
