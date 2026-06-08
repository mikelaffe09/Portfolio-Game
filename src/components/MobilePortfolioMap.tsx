import type { CSSProperties } from "react";
import type { StationId } from "../data/portfolioData";
import type { StationProgressItem } from "../hooks/usePortfolioProgress";

type Props = {
  stations: StationProgressItem[];
  onOpenSection: (sectionId: StationId) => void;
  onLockedSection: (sectionId: StationId) => void;
};

export default function MobilePortfolioMap({
  stations,
  onOpenSection,
  onLockedSection,
}: Props) {
  return (
    <section className="mission-map" aria-labelledby="mission-map-title">
      <div className="section-heading">
        <p className="panel-label">Quick Navigation</p>
        <h2 id="mission-map-title">Mission Map</h2>
      </div>

      <div className="mission-map-grid">
        {stations.map(({ section, index, completed, unlocked }) => {
          const status = completed ? "Complete" : unlocked ? "Ready" : "Locked";

          return (
            <button
              className={`mission-map-card ${completed ? "is-completed" : ""} ${
                !unlocked ? "is-locked" : ""
              }`}
              key={section.id}
              type="button"
              aria-disabled={!unlocked}
              style={{ "--section-accent": section.accent } as CSSProperties}
              onClick={() => {
                if (unlocked) {
                  onOpenSection(section.id);
                  return;
                }

                onLockedSection(section.id);
              }}
            >
              <span className="mission-map-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mission-map-status">{status}</span>
              <strong>{section.zoneTitle}</strong>
              <small>{section.summary}</small>
              {!unlocked && <em>Complete earlier zones first</em>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
