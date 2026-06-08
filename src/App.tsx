import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import heroImage from "./assets/hero.png";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import PortfolioModal from "./components/PortfolioModal";
import ProjectPage from "./components/ProjectPage";
import {
  getPortfolioProject,
  portfolioSections,
  portfolioProjects,
  stationOrder,
  type StationId,
} from "./data/portfolioData";

type AppRoute =
  | {
      name: "home";
    }
  | {
      name: "project";
      projectId: string;
    };

const legacyCompletedStationsStorageKey = "signal-run-completed-stations";
const completedStationsStorageKey = "signal-run-completed-stations-v2";

function isStationId(value: string): value is StationId {
  return stationOrder.includes(value as StationId);
}

function parseCompletedStations(savedValue: string | null, isLegacyValue = false) {
  if (!savedValue) return new Set<StationId>();

  const savedIds = JSON.parse(savedValue);
  if (!Array.isArray(savedIds)) return new Set<StationId>();

  const completedStations = new Set<StationId>(
    savedIds.filter((id): id is StationId => {
      return typeof id === "string" && isStationId(id);
    })
  );

  if (
    isLegacyValue &&
    stationOrder.every((sectionId) => completedStations.has(sectionId))
  ) {
    return new Set<StationId>();
  }

  return completedStations;
}

function loadCompletedStations() {
  try {
    const savedValue = window.localStorage.getItem(completedStationsStorageKey);
    if (savedValue) return parseCompletedStations(savedValue);

    return parseCompletedStations(
      window.localStorage.getItem(legacyCompletedStationsStorageKey),
      true
    );
  } catch {
    return new Set<StationId>();
  }
}

function isProgressionUnlocked(
  sectionId: StationId,
  completedStations: Set<StationId>
) {
  const sectionIndex = stationOrder.indexOf(sectionId);
  return stationOrder
    .slice(0, sectionIndex)
    .every((previousSectionId) => completedStations.has(previousSectionId));
}

function getCurrentRoute(): AppRoute {
  const projectMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);

  if (projectMatch) {
    return {
      name: "project",
      projectId: decodeURIComponent(projectMatch[1]),
    };
  }

  return { name: "home" };
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => getCurrentRoute());
  const [activeSectionId, setActiveSectionId] = useState<StationId | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<StationId>>(
    () => loadCompletedStations()
  );
  const [fullPortfolioUnlocked, setFullPortfolioUnlocked] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getCurrentRoute());
      setActiveSectionId(null);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        completedStationsStorageKey,
        JSON.stringify([...completedIds])
      );
    } catch {
      // Progress persistence is a nice-to-have; the game should still work.
    }
  }, [completedIds]);

  const completedCount = completedIds.size;

  const nextStationId = useMemo(() => {
    return stationOrder.find((id) => !completedIds.has(id)) ?? null;
  }, [completedIds]);

  const nextStation =
    portfolioSections.find((section) => section.id === nextStationId) ?? null;

  const isUnlocked = useCallback(
    (sectionId: StationId) => {
      return (
        fullPortfolioUnlocked ||
        isProgressionUnlocked(sectionId, completedIds)
      );
    },
    [completedIds, fullPortfolioUnlocked]
  );

  const openSection = useCallback(
    (sectionId: StationId) => {
      const sectionIsProgressionUnlocked = isProgressionUnlocked(
        sectionId,
        completedIds
      );

      if (!fullPortfolioUnlocked && !sectionIsProgressionUnlocked) return;

      setActiveSectionId(sectionId);

      if (!sectionIsProgressionUnlocked) return;

      setCompletedIds((previous) => {
        if (
          previous.has(sectionId) ||
          !isProgressionUnlocked(sectionId, previous)
        ) {
          return previous;
        }

        const next = new Set(previous);
        next.add(sectionId);
        return next;
      });
    },
    [completedIds, fullPortfolioUnlocked]
  );

  const navigateHome = useCallback(() => {
    window.history.pushState(null, "", "/");
    setRoute({ name: "home" });
    setActiveSectionId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateToProject = useCallback((projectId: string) => {
    const project = getPortfolioProject(projectId);

    window.history.pushState(null, "", project?.path ?? `/projects/${projectId}`);
    setRoute({ name: "project", projectId });
    setActiveSectionId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const viewFullPortfolio = useCallback(() => {
    setFullPortfolioUnlocked(true);
    setActiveSectionId("projects");
  }, []);

  const activeSection =
    portfolioSections.find((section) => section.id === activeSectionId) ?? null;

  const activeProjectPage =
    route.name === "project" ? getPortfolioProject(route.projectId) : null;

  const projectsCount =
    portfolioSections.find((section) => section.id === "projects")?.projects
      ?.length ?? 0;

  if (route.name === "project") {
    if (!activeProjectPage) {
      return (
        <main className="project-page">
          <header className="project-page-top">
            <button type="button" onClick={navigateHome}>
              Back to Signal Run
            </button>
            <span>Project Page</span>
          </header>

          <section className="project-page-empty">
            <p className="panel-label">Not Found</p>
            <h1>Project not found</h1>
            <p>The project page you opened does not exist in the portfolio data.</p>
          </section>
        </main>
      );
    }

    return (
      <ProjectPage
        project={activeProjectPage}
        projects={portfolioProjects}
        onNavigateHome={navigateHome}
        onNavigateProject={navigateToProject}
      />
    );
  }

  return (
    <main className="app-shell">
      <HUD
        completed={completedCount}
        total={stationOrder.length}
        nextStationTitle={nextStation?.title ?? "Complete"}
      />

      <section className="playdeck" aria-label="Interactive portfolio game">
        <div className="game-wrapper">
          <GameCanvas
            onOpenSection={openSection}
            completedIds={[...completedIds]}
            unlockedIds={stationOrder.filter((id) => isUnlocked(id))}
          />
        </div>

        <aside className="mission-panel">
          <img className="mission-art" src={heroImage} alt="" />
          <p className="panel-label">Route Console</p>
          <h1>Signal Run</h1>
          <p>
            Follow the route in order. Each station unlocks the next part of the
            portfolio.
          </p>

          <div className="mission-metrics">
            <div>
              <span>Stations</span>
              <strong>
                {completedCount}/{stationOrder.length}
              </strong>
            </div>
            <div>
              <span>Projects</span>
              <strong>{projectsCount}</strong>
            </div>
          </div>

          <div className="mission-actions">
            <button
              type="button"
              disabled={!isUnlocked("projects")}
              onClick={() => openSection("projects")}
            >
              Open Projects
            </button>

            <button
              type="button"
              disabled={!isUnlocked("contact")}
              onClick={() => openSection("contact")}
            >
              Contact
            </button>

            <button
              className="fast-path-button"
              type="button"
              onClick={viewFullPortfolio}
            >
              View full portfolio
            </button>
          </div>
        </aside>
      </section>

      <PortfolioModal
        section={activeSection}
        onClose={() => setActiveSectionId(null)}
        onOpenProjectPage={navigateToProject}
      />

      <nav className="fallback-nav" aria-labelledby="fallback-nav-title">
        <div className="fallback-nav-header">
          <p className="panel-label">Touch Route</p>
          <h2 id="fallback-nav-title">Station access</h2>
        </div>

        <div className="fallback-nav-list">
          {stationOrder.map((sectionId, index) => {
            const section = portfolioSections.find((item) => item.id === sectionId);
            if (!section) return null;

            const unlocked = isUnlocked(section.id);
            const completed = completedIds.has(section.id);

            return (
              <button
                className={`fallback-nav-item ${
                  completed ? "is-completed" : ""
                }`}
                key={section.id}
                type="button"
                disabled={!unlocked}
                style={
                  { "--section-accent": section.accent } as CSSProperties
                }
                onClick={() => openSection(section.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{section.title}</strong>
                <small>{completed ? "Completed" : unlocked ? "Ready" : "Locked"}</small>
              </button>
            );
          })}
        </div>
      </nav>

      <section className="quick-panel" aria-labelledby="quick-title">
        <div className="quick-header">
          <p className="panel-label">Quick Scan</p>
          <h2 id="quick-title">Portfolio map</h2>
        </div>

        <div className="quick-grid">
          {portfolioSections.map((section) => {
            const unlocked = isUnlocked(section.id);
            const completed = completedIds.has(section.id);

            return (
              <button
                className={`quick-card ${!unlocked ? "is-locked" : ""} ${
                  completed ? "is-completed" : ""
                }`}
                key={section.id}
                type="button"
                disabled={!unlocked}
                style={
                  { "--section-accent": section.accent } as CSSProperties
                }
                onClick={() => openSection(section.id)}
              >
                <span>{section.subtitle}</span>
                <strong>{section.title}</strong>
                <small>{section.summary}</small>
                <em>{completed ? "Completed" : unlocked ? "Unlocked" : "Locked"}</em>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
