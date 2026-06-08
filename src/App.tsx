import { useCallback, useState, type CSSProperties } from "react";
import heroImage from "./assets/hero.png";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import PortfolioModal from "./components/PortfolioModal";
import { portfolioSections } from "./data/portfolioData";

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [visitedSectionIds, setVisitedSectionIds] = useState<Set<string>>(
    () => new Set()
  );

  const activeSection =
    portfolioSections.find((section) => section.id === activeSectionId) ?? null;
  const completedSections = visitedSectionIds.size;
  const projectsCount =
    portfolioSections.find((section) => section.id === "projects")?.projects
      ?.length ?? 0;

  const openSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    setVisitedSectionIds((previousIds) => {
      if (previousIds.has(sectionId)) return previousIds;

      const nextIds = new Set(previousIds);
      nextIds.add(sectionId);
      return nextIds;
    });
  }, []);

  return (
    <main className="app-shell">
      <HUD completed={completedSections} total={portfolioSections.length} />

      <section className="playdeck" aria-label="Interactive portfolio game">
        <div className="game-wrapper">
          <GameCanvas onOpenSection={openSection} />
        </div>

        <aside className="mission-panel">
          <img className="mission-art" src={heroImage} alt="" />
          <p className="panel-label">Route Console</p>
          <h1>Signal Run</h1>
          <p>
            Explore four portfolio stations, collect sparks, and open the work
            samples as you move through the grid.
          </p>

          <div className="mission-metrics">
            <div>
              <span>Stations</span>
              <strong>
                {completedSections}/{portfolioSections.length}
              </strong>
            </div>
            <div>
              <span>Projects</span>
              <strong>{projectsCount}</strong>
            </div>
          </div>

          <div className="mission-actions">
            <button type="button" onClick={() => openSection("projects")}>
              Open Projects
            </button>
            <button type="button" onClick={() => openSection("contact")}>
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
          {portfolioSections.map((section) => (
            <button
              className="quick-card"
              key={section.id}
              type="button"
              style={
                { "--section-accent": section.accent } as CSSProperties
              }
              onClick={() => openSection(section.id)}
            >
              <span>{section.subtitle}</span>
              <strong>{section.title}</strong>
              <small>{section.summary}</small>
              {visitedSectionIds.has(section.id) && <em>Logged</em>}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
