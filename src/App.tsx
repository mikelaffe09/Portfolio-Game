import { useCallback, useMemo, useState, type CSSProperties } from "react";
import heroImage from "./assets/hero.png";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import PortfolioModal from "./components/PortfolioModal";
import {
  portfolioSections,
  stationOrder,
  type StationId,
} from "./data/portfolioData";

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<StationId | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<StationId>>(
    () => new Set()
  );

  const completedCount = completedIds.size;

  const nextStationId = useMemo(() => {
    return stationOrder.find((id) => !completedIds.has(id)) ?? null;
  }, [completedIds]);

  const nextStation =
    portfolioSections.find((section) => section.id === nextStationId) ?? null;

  const isUnlocked = useCallback(
    (sectionId: StationId) => {
      const sectionIndex = stationOrder.indexOf(sectionId);
      return sectionIndex <= completedIds.size;
    },
    [completedIds]
  );

  const openSection = useCallback(
    (sectionId: StationId) => {
      if (!isUnlocked(sectionId)) return;

      setActiveSectionId(sectionId);

      setCompletedIds((previous) => {
        if (previous.has(sectionId)) return previous;

        const next = new Set(previous);
        next.add(sectionId);
        return next;
      });
    },
    [isUnlocked]
  );

  const activeSection =
    portfolioSections.find((section) => section.id === activeSectionId) ?? null;

  const projectsCount =
    portfolioSections.find((section) => section.id === "projects")?.projects
      ?.length ?? 0;

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
          </div>
        </aside>
      </section>

      <PortfolioModal
        section={activeSection}
        onClose={() => setActiveSectionId(null)}
      />

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