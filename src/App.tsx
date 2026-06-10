import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import MissionTracker from "./components/MissionTracker";
import MobilePortfolioMap from "./components/MobilePortfolioMap";
import PortfolioModal from "./components/PortfolioModal";
import ProgressToast, {
  type ProgressToastMessage,
  type ProgressToastTone,
} from "./components/ProgressToast";
import ProjectPage from "./components/ProjectPage";
import RecruiterMode from "./components/RecruiterMode";
import SpiralGateway from "./components/SpiralGateway";
import {
  getPortfolioProject,
  portfolioProjects,
  portfolioSectionById,
  type StationId,
} from "./data/portfolioData";
import { collectibleConfigs } from "./game/config/worldConfig";
import { usePortfolioProgress } from "./hooks/usePortfolioProgress";
import { useReducedMotion } from "./hooks/useReducedMotion";
import MobileGameControls from "./components/MobileGameControls";

const collectedOrbIdsStorageKey = "signal-run-collected-orbs-v1";

type AppRoute =
  | {
      name: "home";
    }
  | {
      name: "project";
      projectId: string;
    };

function hasCollectibleId(value: unknown) {
  return (
    typeof value === "string" &&
    collectibleConfigs.some((config) => config.id === value)
  );
}

function loadCollectedOrbIds() {
  try {
    const storedValue = window.localStorage.getItem(collectedOrbIdsStorageKey);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];

    const validIds = new Set(parsedValue.filter(hasCollectibleId));
    return collectibleConfigs
      .map((config) => config.id)
      .filter((id) => validIds.has(id));
  } catch {
    return [];
  }
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
  const [toast, setToast] = useState<ProgressToastMessage | null>(null);
  const [collectedOrbIds, setCollectedOrbIds] = useState<string[]>(
    () => loadCollectedOrbIds()
  );
  const collectedOrbIdsRef = useRef(new Set(collectedOrbIds));
  const toastIdRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const {
    allStationsComplete,
    completedCount,
    completedIdList,
    nextStation,
    progressPercent,
    recruiterMode,
    requestSectionOpen,
    stationProgress,
    totalStations,
    toggleRecruiterMode,
    unlockFullPortfolio,
    unlockedIdList,
  } = usePortfolioProgress();
  const completionToastShownRef = useRef(allStationsComplete);
  const playdeckRef = useRef<HTMLElement | null>(null);

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
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast?.id === toast.id ? null : currentToast
      );
    }, reducedMotion ? 4800 : 3400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [reducedMotion, toast]);

  useEffect(() => {
    collectedOrbIdsRef.current = new Set(collectedOrbIds);

    try {
      window.localStorage.setItem(
        collectedOrbIdsStorageKey,
        JSON.stringify(collectedOrbIds)
      );
    } catch {
      // Collected orb progress is best-effort browser state.
    }
  }, [collectedOrbIds]);

  const showToast = useCallback(
    (title: string, message: string, tone: ProgressToastTone) => {
      toastIdRef.current += 1;
      setToast({
        id: toastIdRef.current,
        title,
        message,
        tone,
      });
    },
    []
  );

  const openSection = useCallback(
    (sectionId: StationId) => {
      const result = requestSectionOpen(sectionId);
      const section = portfolioSectionById[sectionId];

      if (!result.ok) {
        showToast("Zone locked", result.reason, "warning");
        return;
      }

      setActiveSectionId(sectionId);

      if (result.allComplete && !completionToastShownRef.current) {
        completionToastShownRef.current = true;
        showToast(
          "Portfolio Run Complete",
          "Every zone is synced. Recruiter Mode and the contact route are highlighted for the next step.",
          "complete"
        );
        return;
      }

      if (result.newlyCompleted) {
        showToast(
          `${section.title} synced`,
          `${section.zoneTitle} is complete. The next signal is now easier to find.`,
          "success"
        );
      }
    },
    [requestSectionOpen, showToast]
  );

  const handleLockedSection = useCallback(
    (sectionId: StationId) => {
      const result = requestSectionOpen(sectionId);

      if (result.ok) {
        setActiveSectionId(sectionId);
        return;
      }

      showToast("Zone locked", result.reason, "warning");
    },
    [requestSectionOpen, showToast]
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
    unlockFullPortfolio();
    setActiveSectionId("projects");
    showToast(
      "Fast path unlocked",
      "All zones are available for traditional portfolio review.",
      "success"
    );
  }, [showToast, unlockFullPortfolio]);

  const handleToggleRecruiterMode = useCallback(() => {
    toggleRecruiterMode();

    if (!recruiterMode) {
      showToast(
        "Recruiter mode enabled",
        "A clean scan of the same portfolio content is now available below the game.",
        "success"
      );
    }
  }, [recruiterMode, showToast, toggleRecruiterMode]);

  const handleEnterHub = useCallback(() => {
    playdeckRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reducedMotion]);

  const handleOpenRecruiterScan = useCallback(() => {
    if (!recruiterMode) {
      toggleRecruiterMode();
      showToast(
        "Recruiter mode enabled",
        "A clean scan of the same portfolio content is now available below the game.",
        "success"
      );
    }

    window.setTimeout(() => {
      document.querySelector<HTMLElement>(".recruiter-mode")?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 0);
  }, [recruiterMode, reducedMotion, showToast, toggleRecruiterMode]);

  const handleCollectOrb = useCallback(
    (orbId: string) => {
      if (collectedOrbIdsRef.current.has(orbId)) return;

      collectedOrbIdsRef.current.add(orbId);
      setCollectedOrbIds([...collectedOrbIdsRef.current]);
      showToast(
        "Signal fragment collected",
        "Nice. The hub picked up another frontend skill marker.",
        "success"
      );
    },
    [showToast]
  );

  const activeSection =
    activeSectionId === null ? null : portfolioSectionById[activeSectionId];

  const activeProjectPage =
    route.name === "project" ? getPortfolioProject(route.projectId) : null;

  const projectsCount = portfolioSectionById.projects.projects?.length ?? 0;
  const totalOrbs = collectibleConfigs.length;
  const nextStationTitle = nextStation?.zoneTitle ?? "Mission Complete";

  const collectedOrbIdList = useMemo(
    () => [...collectedOrbIds],
    [collectedOrbIds]
  );

  if (route.name === "project") {
    if (!activeProjectPage) {
      return (
        <main className="project-page">
          <header className="project-page-top">
            <button type="button" onClick={navigateHome}>
              Back to Quest Hub
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
    <main
      className={`app-shell ${recruiterMode ? "is-recruiter-mode" : ""} ${
        allStationsComplete ? "is-run-complete" : ""
      }`}
    >
      <HUD
        allComplete={allStationsComplete}
        completed={completedCount}
        collectedOrbs={collectedOrbIds.length}
        progressPercent={progressPercent}
        recruiterMode={recruiterMode}
        total={totalStations}
        totalOrbs={totalOrbs}
        nextStationTitle={nextStationTitle}
        onToggleRecruiterMode={handleToggleRecruiterMode}
      />

      <SpiralGateway
        allComplete={allStationsComplete}
        nextStationTitle={nextStationTitle}
        progressPercent={progressPercent}
        reducedMotion={reducedMotion}
        onEnterHub={handleEnterHub}
        onOpenRecruiterScan={handleOpenRecruiterScan}
      />

      <section
        ref={playdeckRef}
        className="playdeck"
        aria-label="Interactive portfolio game"
      >
        <div className="game-wrapper">
  <GameCanvas
    onOpenSection={openSection}
    onLockedSection={handleLockedSection}
    onCollectOrb={handleCollectOrb}
    completedIds={completedIdList}
    unlockedIds={unlockedIdList}
    collectedOrbIds={collectedOrbIdList}
    reducedMotion={reducedMotion}
  />

  <MobileGameControls />
</div>

        <MissionTracker
          allComplete={allStationsComplete}
          completed={completedCount}
          total={totalStations}
          collectedOrbs={collectedOrbIds.length}
          totalOrbs={totalOrbs}
          nextStationTitle={nextStationTitle}
          projectsCount={projectsCount}
          recruiterMode={recruiterMode}
          stations={stationProgress}
          onOpenSection={openSection}
          onLockedSection={handleLockedSection}
          onViewFullPortfolio={viewFullPortfolio}
          onToggleRecruiterMode={handleToggleRecruiterMode}
        />
      </section>

      <MobilePortfolioMap
        stations={stationProgress}
        onOpenSection={openSection}
        onLockedSection={handleLockedSection}
      />

      <RecruiterMode
        visible={recruiterMode}
        onBackToGame={handleToggleRecruiterMode}
        onOpenSection={openSection}
        onOpenProjectPage={navigateToProject}
      />

      <PortfolioModal
        section={activeSection}
        onClose={() => setActiveSectionId(null)}
        onOpenProjectPage={navigateToProject}
      />

      <ProgressToast toast={toast} />
    </main>
  );
}
