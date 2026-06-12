import calcVaultVaultOverviewScreenshot from "../assets/projects/calcvault-vault-overview.jpg";
import calcVaultVaultSectionsScreenshot from "../assets/projects/calcvault-vault-sections.jpg";
// import chapterkeepLandingScreenshot from "../assets/projects/chapterkeep-landing-page.jpg";
// import chapterkeepLibraryScreenshot from "../assets/projects/chapterkeep-library-dashboard.jpg";
import cresviaPortfolioFeaturedScreenshot from "../assets/projects/cresvia-portfolio-featured.jpg";
import cresviaPortfolioRealEstateScreenshot from "../assets/projects/cresvia-portfolio-real-estate.jpg";
import galaFlowersHomepageScreenshot from "../assets/projects/gala-flowers-homepage.jpg";
import galaFlowersServicesScreenshot from "../assets/projects/gala-flowers-services.jpg";
import mrFixHomepageScreenshot from "../assets/projects/mr-fix-homepage.jpg";
import mrFixServicesScreenshot from "../assets/projects/mr-fix-services.jpg";
import smartGarageHomeDashboardScreenshot from "../assets/projects/smartgarage-home-dashboard.jpg";

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
  pending?: boolean;
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  dates: string;
  highlights: string[];
};

export type EducationItem = {
  institution: string;
  credential: string;
  dates: string;
  details: string[];
};

export type LanguageItem = {
  language: string;
  level: string;
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

export type ProjectLink = {
  label: string;
  href: string;
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
  galleryImages?: {
    src: string;
    alt: string;
    label: string;
    caption: string;
  }[];
  path: string;
  demoUrl?: string;
  demoNote?: string;
  githubUrl?: string;
  repositoryNote?: string;
  links?: ProjectLink[];
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
  name: "Mike Allaffi",
  role: "Junior Software Developer | React Native & Web Developer",
  location: "Naqqache, Lebanon",
  availability:
    "Open to junior software developer, frontend, React Native, and backend/API roles.",
  summary:
    "Computer Science student focused on frontend, mobile, practical full-stack development, and AI/RAG workflows.",
  professionalSummary:
    "I build deployed software that turns a product idea into a usable flow: responsive web interfaces, mobile screens, API-backed dashboards, and AI-assisted experiences. My work combines React, React Native, TypeScript, ASP.NET Core, Supabase, Python, and OpenAI tooling with the operational discipline I developed managing real maintenance workflows, client follow-up, scheduling, and handoffs.",
  strengths: [
    "Builds polished React and React Native interfaces with responsive UI and clear user flows.",
    "Connects frontend work to real backend, database, authentication, and deployment concerns.",
    "Brings operations experience from project coordination into software delivery: task ownership, documentation, prioritization, and follow-through.",
  ],
  currentFocus: [
    "Junior software developer roles spanning frontend, mobile, backend/API, and practical full-stack delivery.",
    "React, React Native, TypeScript, Supabase, ASP.NET Core, FastAPI, and deployment-focused product builds.",
    "AI/RAG workflows, vehicle and service-business tools, dashboards, and user-facing automation.",
  ],
  contactMethods: [
    {
      id: "phone",
      label: "Phone",
      value: "+961 78 919 757",
      href: "tel:+96178919757",
    },
    {
      id: "email-primary",
      label: "Email",
      value: "mikelaffe@gmail.com",
      href: "mailto:mikelaffe@gmail.com",
    },
    {
      id: "email-secondary",
      label: "Alternate Email",
      value: "mikeallaffi@outlook.com",
      href: "mailto:mikeallaffi@outlook.com",
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/mikelaffe09",
      href: "https://github.com/mikelaffe09",
    },
    {
      id: "portfolio",
      label: "Live Project",
      value: "smartgarage.website",
      href: "https://www.smartgarage.website/",
    },
    {
      id: "resume",
      label: "Resume",
      value: "Mike_Allaffi_CV.pdf",
      href: "/Mike_Allaffi_CV.pdf",
    },
  ],
};

export const experienceItems: ExperienceItem[] = [
  {
    company: "Unity Management",
    role: "Project Manager",
    location: "Remote",
    dates: "Dec 2023 - Present",
    highlights: [
      "Manage facility-maintenance workflows across client onboarding, retention, vendor hiring, technician dispatching, scheduling, and job follow-up.",
      "Coordinate around 80 work orders per month while keeping client requests and technician updates visible through ClickUp.",
      "Apply delivery habits that translate directly to software work: clean handoff, task ownership, documentation, prioritization, and follow-through.",
    ],
  },
  {
    company: "Facilitate",
    role: "Project Coordinator",
    location: "On-site",
    dates: "Sep 2022 - Aug 2023",
    highlights: [
      "Coordinated maintenance work orders through a custom CRM and ClickUp, including dispatch, data entry, scheduling, technician follow-up, and client communication.",
      "Handled around 55 work orders per month while developing strong communication, problem-solving, and remote task-tracking skills.",
    ],
  },
  {
    company: "Gilgamesh Restaurant",
    role: "Waiter & Cashier",
    location: "Lebanon",
    dates: "Jun 2016 - Sep 2019",
    highlights: [
      "Handled customer service, cash transactions, and daily restaurant operations in a fast-paced environment.",
    ],
  },
];

export const educationItems: EducationItem[] = [
  {
    institution: "Notre Dame University (NDU)",
    credential: "Bachelor in Computer Science",
    dates: "2023 - Expected 2026",
    details: [
      "Relevant coursework: Data Structures, Database Systems, Software Engineering, Artificial Intelligence, Operating Systems, and OOD.",
    ],
  },
  {
    institution: "Saint Joseph University of Beirut (USJ)",
    credential: "Electrical Engineering Coursework",
    dates: "2019 - 2022",
    details: [],
  },
  {
    institution: "Saint Rita School",
    credential: "General Science",
    dates: "2019",
    details: [],
  },
];

export const courseItems = [
  "Web Development Bootcamp - Angela Yu (Udemy)",
  "Self-directed React, JavaScript, Python, ML, and deep learning study",
];

export const languageItems: LanguageItem[] = [
  { language: "Arabic", level: "Native" },
  { language: "English", level: "Fluent" },
  { language: "French", level: "Professional" },
  { language: "Spanish", level: "Basic" },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming",
    description: "Core languages used across web, mobile, backend, and data work.",
    skills: ["TypeScript", "JavaScript", "Python", "C#", "C++", "SQL", "HTML/CSS"],
  },
  {
    title: "Frontend / Mobile",
    description: "Tools for responsive web apps and mobile interfaces.",
    skills: ["React", "React Native", "Expo", "Tailwind CSS", "Vite", "Responsive UI"],
  },
  {
    title: "Backend / API",
    description: "API and integration work for practical product features.",
    skills: ["ASP.NET Core", "FastAPI", "REST APIs", "Swagger", "API Integration"],
  },
  {
    title: "Database / Auth",
    description: "Data foundations used in deployed app workflows.",
    skills: ["Supabase", "MySQL", "Authentication Flows", "Data Modeling"],
  },
  {
    title: "AI / Data",
    description: "AI, RAG, and analysis tools used in project work.",
    skills: ["RAG", "Embeddings", "Pinecone", "OpenAI API", "Pandas", "NumPy", "Scikit-learn"],
  },
  {
    title: "Tools / Deployment",
    description: "Daily delivery, deployment, and coordination tooling.",
    skills: ["GitHub", "VS Code", "Visual Studio", "Netlify", "Railway", "ClickUp"],
  },
];

export const portfolioSections: PortfolioSection[] = [
  {
    id: "about",
    title: "About Mike",
    subtitle: "Developer profile",
    zoneTitle: "Origin Terminal",
    mission: "Start the route and learn how Mike thinks about product-minded software.",
    summary: "Frontend, mobile, full-stack, and AI/RAG work grounded in real operations.",
    accent: "#ff6b6b",
    sceneColor: [255, 107, 107],
    body: portfolioProfile.professionalSummary,
    highlights: [...portfolioProfile.strengths],
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Technical toolkit",
    zoneTitle: "Skill Reactor",
    mission: "Scan the tools Mike uses to ship frontend, mobile, backend, and AI-assisted products.",
    summary: "A practical stack for deployed web, mobile, API, and data work.",
    accent: "#2dd4bf",
    sceneColor: [45, 212, 191],
    body: "A practical developer toolkit organized around programming, frontend/mobile delivery, backend APIs, database/auth flows, AI/data work, and deployment habits.",
    highlights: [
      ...skillGroups.map((group) => `${group.title}: ${group.skills.join(", ")}.`),
    ],
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Selected work",
    zoneTitle: "Project Gate",
    mission: "Enter the showcase and review CV projects plus recent live web and mobile work.",
    summary: "Senior project, deployed apps, client sites, and mobile security.",
    accent: "#f8c537",
    sceneColor: [248, 197, 55],
    body: "Selected projects from Mike's CV and recent work: SmartGarage, business websites, service-business sites, and a mobile encrypted storage app.",
    highlights: [
      "CV-backed project details with role, stack, impact, and live links where available.",
      "Project galleries use compressed screenshots from the live or private project surfaces.",
      // "ChapterKeep keeps its current images while the text is tightened around the live product story.",
    ],
    projects: [
      {
        id: "smartgarage",
        title: "SmartGarage",
        shortDescription:
          "AI vehicle management system for tracking cars, maintenance, expenses, reminders, and mechanic guidance.",
        description:
          "SmartGarage is Mike's senior project: a vehicle manager and AI mechanic experience with mobile/web interfaces, vehicle profiles, reminders, expenses, maintenance recommendations, authentication, and admin workflows.",
        problem:
          "Drivers often track vehicle records, maintenance history, expenses, and troubleshooting notes across disconnected apps or paper records. The project needed one place for personal vehicle management plus AI-assisted support.",
        solution:
          "The app organizes each vehicle into dashboards for profile details, maintenance reminders, service history, expenses, and AI mechanic chat. Backend APIs, deployed services, and RAG workflows support the user-facing experience.",
        role: "Worked in a group of two with ownership across frontend mobile/web screens, backend API work, admin dashboard flows, and AI/RAG integration.",
        bestFeature:
          "The AI mechanic assistant combines document embeddings, vector search, and OpenAI responses to guide vehicle troubleshooting inside the same product where drivers manage their cars.",
        impact:
          "A complete senior-project product showing full-stack, mobile, dashboard, deployment, and AI workflow capability.",
        tech: [
          "React",
          "React Native",
          "TypeScript",
          "ASP.NET Core",
          "Supabase",
          "OpenAI API",
          "RAG",
          "Pinecone",
          "Railway",
          "Netlify",
        ],
        status: "live",
        category: "full-stack",
        screenshotUrl: smartGarageHomeDashboardScreenshot,
        previewImage: smartGarageHomeDashboardScreenshot,
        previewAlt:
          "SmartGarage landing page showing vehicle dashboard and AI mechanic assistant.",
        galleryImages: [
          {
            src: smartGarageHomeDashboardScreenshot,
            alt: "SmartGarage landing page with vehicle management dashboard, maintenance reminders, and AI mechanic assistant.",
            label: "Live Landing and Dashboard",
            caption:
              "Public project page showing the main value proposition, dashboard cards, and AI mechanic support.",
          },
        ],
        path: "/projects/smartgarage",
        demoUrl: "https://www.smartgarage.website/",
        repositoryNote:
          "Repository is private because this is a senior-project codebase with team coursework and deployment configuration history.",
        lessons: [
          "Vehicle tools need fast access to routine records and enough structure for long-term service history.",
          "AI features are stronger when they live inside the product workflow instead of as a detached chatbot.",
        ],
        nextImprovements: [
          "Capture a dedicated signed-in mobile screen once the production demo account is ready to share.",
          "Surface stronger product metrics and architecture notes after the senior-project submission is finalized.",
        ],
      },
  /*     {
        id: "chapterkeep",
        title: "ChapterKeep",
        shortDescription:
          "A deployed reading-life web app for book tracking, goals, streaks, collections, and reader discovery.",
        description:
          "ChapterKeep gives readers one polished place to log every book they have read, are reading, or want to read. The live product story focuses on book tracking, goals, streaks, reading challenges, analytics, calendar views, collections, series tracking, and community discovery.",
        problem:
          "Readers often split their reading life across wish lists, screenshots, notes, spreadsheets, and social platforms. The challenge was to make tracking feel organized without making the product feel cold.",
        solution:
          "The product pairs a clear landing page with a cover-led library dashboard, searchable shelves, reading statuses, progress views, goals, analytics, challenges, and community-oriented discovery.",
        role: "Built and shaped the responsive product presentation and reading-management UI around clean user flows, dashboard-style insights, and deployed web polish.",
        bestFeature:
          "The library dashboard gives readers an immediate overview of their books, statuses, progress, ratings, and search/filter options.",
        impact:
          "Positions ChapterKeep as a polished Goodreads alternative with a free entry point and a reader-first product identity.",
        tech: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Responsive UI"],
        status: "live",
        category: "full-stack",
        screenshotUrl: chapterkeepLandingScreenshot,
        previewImage: chapterkeepLandingScreenshot,
        previewAlt:
          "ChapterKeep public landing page with a reading-focused call to action.",
        galleryImages: [
          {
            src: chapterkeepLandingScreenshot,
            alt: "ChapterKeep landing page hero promoting reading tracking and beta signup.",
            label: "Public Landing",
            caption:
              "A clear marketing surface for the book tracker, free plan, goals, challenges, and community value.",
          },
          {
            src: chapterkeepLibraryScreenshot,
            alt: "ChapterKeep library dashboard showing search, book filters, cover cards, progress, and ratings.",
            label: "Library Dashboard",
            caption:
              "The core app surface for searchable shelves, reading statuses, progress, ratings, and cover-led browsing.",
          },
        ],
        path: "/projects/chapterkeep",
        demoUrl: "https://chapterkeepp.cresvia.co/",
        repositoryNote:
          "Repository is private while product and Supabase implementation details are still being iterated.",
        lessons: [
          "Reader products need warmth and structure at the same time.",
          "A stronger case study shows both the landing-page promise and the actual app surface.",
        ],
        nextImprovements: [
          "Add more live app screenshots for analytics, calendar tracking, challenges, and community once those screens are ready to publish.",
        ],
      }, */
      {
        id: "gala-flowers",
        title: "Gala Flowers",
        shortDescription:
          "Luxury floral website for custom bouquets, weddings, events, indoor plants, and seasonal arrangements.",
        description:
          "Gala Flowers is a live luxury floral website for a Naqqache, Lebanon floral brand. The site presents custom bouquets, weddings and events, indoor plants, Christmas and seasonal work, a portfolio gallery, and a WhatsApp-first quote flow.",
        problem:
          "A premium floral business needs visitors to understand the service range quickly while the visuals communicate trust, taste, and event readiness.",
        solution:
          "The site uses an image-led hero, clear service categories, portfolio filtering, testimonial-style trust content, and direct WhatsApp actions for quote requests.",
        role: "Built the responsive frontend presentation, structured the service and portfolio sections, and organized calls to action around quote intent.",
        bestFeature:
          "The portfolio and service sections let visitors scan bouquets, weddings, events, indoor plants, and seasonal offerings without losing the luxury brand feel.",
        impact:
          "Turns Gala Flowers into a polished online storefront with a clear path from inspiration to WhatsApp inquiry.",
        tech: ["React", "Vite", "Tailwind CSS", "Responsive UI", "SEO"],
        status: "live",
        category: "web",
        screenshotUrl: galaFlowersHomepageScreenshot,
        previewImage: galaFlowersHomepageScreenshot,
        previewAlt: "Gala Flowers luxury floral website screenshot.",
        galleryImages: [
          {
            src: galaFlowersHomepageScreenshot,
            alt: "Gala Flowers homepage screenshot.",
            label: "Homepage",
            caption:
              "Luxury floral hero and WhatsApp quote call to action for a Naqqache floral brand.",
          },
          {
            src: galaFlowersServicesScreenshot,
            alt: "Gala Flowers services or portfolio screenshot.",
            label: "Services",
            caption:
              "Service and portfolio presentation for bouquets, weddings, events, indoor plants, and seasonal work.",
          },
        ],
        path: "/projects/gala-flowers",
        demoUrl: "https://galaflowers.cresvia.co/",
        repositoryNote:
          "Repository is private for client-site work; production screenshots and live deployment are public.",
        lessons: [
          "Visual service businesses need product-quality imagery, fast category scanning, and direct inquiry actions.",
          "A focused WhatsApp flow can be more useful than a heavy booking system for a local floral brand.",
        ],
        nextImprovements: [
          "Add performance notes around image optimization as final business photography is selected.",
        ],
      },
      {
        id: "mr-fix",
        title: "Mr Fix",
        shortDescription:
          "Handyman service website for Portland and Vancouver with quote flow, service pages, and admin tracking.",
        description:
          "Mr Fix is a professional handyman website serving Portland, OR and Vancouver, WA. The site presents home repair, plumbing, electrical, carpentry, painting, gutter cleaning, pressure washing, assembly, installation, and general improvement services.",
        problem:
          "Local service visitors need fast proof that the business covers their job type, their area, and a reliable way to request help or call immediately.",
        solution:
          "The site combines SEO-ready service messaging, phone and WhatsApp calls to action, a quote form, Supabase-backed contact submissions, and an admin dashboard for tracking leads.",
        role: "Built the responsive service-business experience, contact flow, Supabase submission storage, and admin dashboard interface.",
        bestFeature:
          "The quote workflow connects a polished public site to an internal submissions dashboard so inquiries are not just collected, they are manageable.",
        impact:
          "Gives the business a professional acquisition channel with clear service coverage, local SEO metadata, direct calls, and lead follow-up support.",
        tech: ["React", "Vite", "Tailwind CSS", "Supabase", "SEO", "Responsive UI"],
        status: "live",
        category: "full-stack",
        screenshotUrl: mrFixHomepageScreenshot,
        previewImage: mrFixHomepageScreenshot,
        previewAlt: "Mr Fix handyman service website screenshot.",
        galleryImages: [
          {
            src: mrFixHomepageScreenshot,
            alt: "Mr Fix homepage or services screenshot.",
            label: "Homepage",
            caption:
              "Public service site for Portland and Vancouver handyman offerings with direct contact actions.",
          },
          {
            src: mrFixServicesScreenshot,
            alt: "Mr Fix services page screenshot.",
            label: "Services",
            caption:
              "Service-category cards for repairs, painting, installation, and general home improvement work.",
          },
        ],
        path: "/projects/mr-fix",
        demoUrl: "https://mrfix.cresvia.co/",
        repositoryNote:
          "Repository is private for client-site and lead-management implementation details.",
        lessons: [
          "Service websites need clear location coverage, direct contact options, and trust signals before visual polish matters.",
          "Lead storage and admin review make a landing page more operationally useful.",
        ],
        nextImprovements: [
          "Add conversion notes after the quote form is used with real leads.",
        ],
      },
      {
        id: "calcvault",
        title: "CalcVault",
        shortDescription:
          "Mobile app that looks like a calculator while protecting local encrypted storage behind it.",
        description:
          "CalcVault is a mobile app concept and build where the visible calculator interface acts as the front door to private local encrypted storage.",
        problem:
          "Some private notes or files need a local-first storage pattern where the interface feels simple, familiar, and discreet.",
        solution:
          "The app uses a calculator front for everyday interaction and stores protected content locally with encryption, keeping sensitive material on the device rather than relying on a cloud account.",
        role: "Designed and built the mobile app flow, calculator front, private vault interaction, and local encrypted-storage model.",
        bestFeature:
          "The calculator-first entry point makes the app feel familiar while still separating ordinary calculator behavior from the protected vault flow.",
        impact:
          "Shows mobile UI thinking, local data protection, and security-minded product design in a compact React Native-style app.",
        tech: ["React Native", "Expo", "TypeScript", "Local Storage", "Encryption"],
        status: "private",
        category: "mobile",
        screenshotUrl: calcVaultVaultOverviewScreenshot,
        previewImage: calcVaultVaultOverviewScreenshot,
        previewAlt: "CalcVault calculator and encrypted vault mobile app screenshot.",
        galleryImages: [
          {
            src: calcVaultVaultOverviewScreenshot,
            alt: "CalcVault private vault overview screenshot.",
            label: "Vault Overview",
            caption:
              "Local-first encrypted storage overview for files, images, notes, contacts, text snippets, folders, and trash.",
          },
          {
            src: calcVaultVaultSectionsScreenshot,
            alt: "CalcVault vault sections screenshot.",
            label: "Vault Sections",
            caption:
              "Private vault sections for files, images, notes, and contacts behind the calculator entry flow.",
          },
        ],
        path: "/projects/calcvault",
        demoNote:
          "Private mobile build; walkthrough available during an interview or code review.",
        repositoryNote:
          "Repository is private because the project focuses on local encrypted storage and mobile privacy patterns.",
        lessons: [
          "Privacy products need simple interaction patterns and clear separation between public and protected flows.",
          "Local-first mobile storage changes the UX tradeoffs around backup, recovery, and device trust.",
        ],
        nextImprovements: [
          "Add a public demo video or sanitized Expo build when the vault data model is ready to share safely.",
          "Clarify the encryption library or native secure-storage approach used in the final build.",
        ],
      },
      {
        id: "selected-web-work",
        title: "Selected Web Work",
        shortDescription:
          "Responsive business websites and landing pages for service-oriented brands through Cresvia work.",
        description:
          "A collection of business websites and landing pages for service-oriented brands, emphasizing messaging, layout, responsiveness, and conversion-focused presentation.",
        problem:
          "Small businesses need fast, credible websites that explain services clearly and turn attention into inquiries without unnecessary complexity.",
        solution:
          "The work focuses on responsive structure, clear service messaging, polished visuals, and direct calls to action across Cresvia and Cresvia Lebanon web properties.",
        role: "Designed and deployed responsive websites and landing pages, shaping content hierarchy, sections, and conversion paths for service-business audiences.",
        bestFeature:
          "The reusable service-business pattern: strong first impression, concise service explanation, trust cues, and a direct next action.",
        impact:
          "Shows repeated delivery across business websites, not just one-off interface experiments.",
        tech: ["React", "Vite", "Tailwind CSS", "Responsive UI", "Deployment"],
        status: "live",
        category: "web",
        screenshotUrl: cresviaPortfolioFeaturedScreenshot,
        previewImage: cresviaPortfolioFeaturedScreenshot,
        previewAlt:
          "Selected business website and landing page screenshot.",
        galleryImages: [
          {
            src: cresviaPortfolioFeaturedScreenshot,
            alt: "Selected Web Work screenshot for Cresvia website.",
            label: "Featured Portfolio",
            caption:
              "Representative business website screenshot from the Cresvia web work collection.",
          },
          {
            src: cresviaPortfolioRealEstateScreenshot,
            alt: "Selected Web Work screenshot for Cresvia Lebanon website.",
            label: "Real Estate Collection",
            caption:
              "Portfolio filtering screen showing real estate website work delivered for service-business audiences.",
          },
        ],
        path: "/projects/selected-web-work",
        demoUrl: "https://www.cresvia.co/",
        repositoryNote:
          "Repositories are private for client and agency work; live deployments and screenshots are public where available.",
        links: [
          {
            label: "Cresvia Lebanon",
            href: "https://www.cresvialb.com/",
          },
        ],
        lessons: [
          "Business sites need clear messaging and conversion paths more than decorative complexity.",
          "Reusable layout patterns help ship faster while still tailoring each site to its service category.",
        ],
        nextImprovements: [
          "Split this collection into individual case studies when each site has dedicated metrics or before/after evidence.",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Work with Mike",
    zoneTitle: "Signal Tower",
    mission: "Finish the run and find Mike's direct contact launch pad.",
    summary: "Phone, email, GitHub, live project, and downloadable CV.",
    accent: "#a78bfa",
    sceneColor: [167, 139, 250],
    body: "Use these links for hiring, collaboration, project review, or direct follow-up. Mike is based in Naqqache, Lebanon and is open to junior software developer, frontend, mobile, and backend/API roles.",
    highlights: [
      "Primary email: mikelaffe@gmail.com.",
      "Phone: +961 78 919 757.",
      "GitHub: github.com/mikelaffe09.",
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

export function getPortfolioProjectLinks(project: PortfolioProject) {
  return project.links ?? [];
}

export function getProjectPreviewImage(project: PortfolioProject) {
  return project.screenshotUrl ?? project.previewImage ?? "";
}

export function getProjectPreviewAlt(project: PortfolioProject) {
  return project.previewAlt ?? `${project.title} project preview.`;
}
