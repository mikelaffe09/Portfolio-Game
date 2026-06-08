import heroImage from "../assets/hero.png";
import type { StationId } from "../data/portfolioData";
import type { StationProgressItem } from "../hooks/usePortfolioProgress";

type Props = {
  allComplete: boolean;
  completed: number;
  total: number;
  collectedOrbs: number;
  totalOrbs: number;
  nextStationTitle: string;
  projectsCount: number;
  recruiterMode: boolean;
  stations: StationProgressItem[];
  onOpenSection: (sectionId: StationId) => void;
  onLockedSection: (sectionId: StationId) => void;
  onViewFullPortfolio: () => void;
  onToggleRecruiterMode: () => void;
};

export default function MissionTracker({
  allComplete,
  completed,
  total,
  collectedOrbs,
  totalOrbs,
  nextStationTitle,
  projectsCount,
  recruiterMode,
  stations,
  onOpenSection,
  onLockedSection,
  onViewFullPortfolio,
  onToggleRecruiterMode,
}: Props) {
  return (
    <aside className="mission-panel" aria-labelledby="mission-title">
      <div className="mission-identity">
        <img className="mission-art" src={heroImage} alt="" />
        <div>
          <p className="panel-label">Quest Console</p>
          <h1 id="mission-title">Neon Portfolio Quest</h1>
          <p>
            Explore the hub, activate each zone, or switch to a traditional
            portfolio scan when speed matters.
          </p>
        </div>
      </div>

      <div className="mission-current">
        <span>{allComplete ? "Final State" : "Current Mission"}</span>
        <strong>
          {allComplete ? "All portfolio signals synced" : nextStationTitle}
        </strong>
      </div>

      <div className="mission-metrics" aria-label="Mission stats">
        <div>
          <span>Stations</span>
          <strong>
            {completed}/{total}
          </strong>
        </div>
        <div>
          <span>Fragments</span>
          <strong>
            {collectedOrbs}/{totalOrbs}
          </strong>
        </div>
        <div>
          <span>Projects</span>
          <strong>{projectsCount}</strong>
        </div>
      </div>

      <div className="mission-route" aria-label="Station route status">
        {stations.map(({ section, completed: isCompleted, unlocked }) => (
          <button
            key={section.id}
            type="button"
            className={`mission-route-node ${isCompleted ? "is-completed" : ""}`}
            aria-disabled={!unlocked}
            onClick={() => {
              if (unlocked) {
                onOpenSection(section.id);
                return;
              }

              onLockedSection(section.id);
            }}
          >
            <span style={{ backgroundColor: section.accent }} />
            <strong>{section.title}</strong>
            <small>
              {isCompleted ? "Complete" : unlocked ? "Ready" : "Locked"}
            </small>
          </button>
        ))}
      </div>

      <div className="mission-actions">
        <button type="button" onClick={() => onOpenSection("projects")}>
          Open Projects
        </button>
        <button type="button" onClick={onViewFullPortfolio}>
          View Full Portfolio
        </button>
        <button
          className="fast-path-button"
          type="button"
          aria-pressed={recruiterMode}
          onClick={onToggleRecruiterMode}
        >
          {recruiterMode ? "Hide Recruiter Mode" : "Recruiter Mode"}
        </button>
      </div>
    </aside>
  );
}
