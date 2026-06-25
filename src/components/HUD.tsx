type Props = {
  allComplete: boolean;
  audioEnabled: boolean;
  audioSupported: boolean;
  completed: number;
  collectedOrbs: number;
  progressPercent: number;
  recruiterMode: boolean;
  total: number;
  totalOrbs: number;
  nextStationTitle: string;
  onToggleAudio: () => void;
  onToggleRecruiterMode: () => void;
};

export default function HUD({
  allComplete,
  audioEnabled,
  audioSupported,
  completed,
  collectedOrbs,
  progressPercent,
  recruiterMode,
  total,
  totalOrbs,
  nextStationTitle,
  onToggleAudio,
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
        className="hud-audio-toggle"
        type="button"
        aria-label={audioEnabled ? "Turn game sound off" : "Turn game sound on"}
        aria-pressed={audioEnabled}
        disabled={!audioSupported}
        onClick={onToggleAudio}
      >
        {!audioSupported ? "No Audio" : audioEnabled ? "Sound On" : "Sound Off"}
      </button>

      <button
        className="hud-recruiter-toggle"
        type="button"
        aria-label={
          recruiterMode ? "Return to game view" : "Switch to Resume View"
        }
        aria-pressed={recruiterMode}
        onClick={onToggleRecruiterMode}
      >
        {recruiterMode ? "Game View" : "Resume View"}
      </button>
    </header>
  );
}
