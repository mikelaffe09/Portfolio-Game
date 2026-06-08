type Props = {
  completed: number;
  total: number;
};

export default function HUD({ completed, total }: Props) {
  return (
    <header className="hud">
      <div className="hud-title">
        <span className="hud-kicker">Interactive Portfolio</span>
        <strong>Signal Run</strong>
      </div>

      <div className="hud-progress" aria-label="Portfolio progress">
        <span>{completed}</span>
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
        <span>{total}</span>
      </div>

      <div className="hud-controls" aria-label="Game controls">
        <kbd>WASD</kbd>
        <kbd>Arrows</kbd>
        <kbd>E</kbd>
        <kbd>Enter</kbd>
      </div>
    </header>
  );
}
