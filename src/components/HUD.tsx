type Props = {
  allComplete: boolean;
  completed: number;
  collectedOrbs: number;
  progressPercent: number;
  recruiterMode: boolean;
  total: number;
  totalOrbs: number;
  nextStationTitle: string;
  onToggleRecruiterMode: () => void;
};

export default function HUD({
  allComplete,
  completed,
  collectedOrbs,
  progressPercent,
  recruiterMode,
  total,
  totalOrbs,
  nextStationTitle,
  onToggleRecruiterMode,
}: Props) {
  return (
    <header className="hud">
      <div className="hud-title">
        <span className="hud-kicker">Interactive Portfolio</span>
        <strong>Mike Allaffi Portfolio</strong>
        <small>{allComplete ? "Mission complete" : "Hub online"}</small>
      </div>

      <div className="hud-progress" aria-label="Portfolio progress">
        <span>{progressPercent}%</span>
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span>
          {completed}/{total}
        </span>
      </div>

      <div className="hud-next">
        <span>{allComplete ? "Final Signal" : "Next Mission"}</span>
        <strong>{allComplete ? "Portfolio synced" : nextStationTitle}</strong>
      </div>

      <div className="hud-orbs" aria-label="Collected signal fragments">
        <span>Fragments</span>
        <strong>
          {collectedOrbs}/{totalOrbs}
        </strong>
      </div>

      <div className="hud-controls">
        <kbd>WASD</kbd>
        <kbd>Arrows</kbd>
        <kbd>E</kbd>
        <kbd>Enter</kbd>
      </div>

      <button
        className="hud-recruiter-toggle"
        type="button"
        aria-pressed={recruiterMode}
        onClick={onToggleRecruiterMode}
      >
        {recruiterMode ? "Game + Scan" : "Recruiter Mode"}
      </button>
    </header>
  );
}
