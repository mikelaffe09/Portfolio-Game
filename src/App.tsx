import { useCallback, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import PortfolioModal from "./components/PortfolioModal";
import { portfolioSections } from "./data/portfolioData";

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const activeSection =
    portfolioSections.find((section) => section.id === activeSectionId) ?? null;

  const openSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  return (
    <main className="app-shell">
      <HUD />

      <section className="game-wrapper">
        <GameCanvas onOpenSection={openSection} />
      </section>

      <PortfolioModal
        section={activeSection}
        onClose={() => setActiveSectionId(null)}
      />

      <section className="classic-fallback">
        <h1>Classic Portfolio</h1>
        <p>
          For recruiters who do not want to play, this section will show the
          normal version of the portfolio.
        </p>
      </section>
    </main>
  );
}