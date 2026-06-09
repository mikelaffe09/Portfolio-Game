type ControlKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Enter";

type ControlButton = {
  label: string;
  keyName: ControlKey;
  className: string;
  ariaLabel: string;
};

const controls: ControlButton[] = [
  {
    label: "▲",
    keyName: "ArrowUp",
    className: "mobile-game-control-up",
    ariaLabel: "Move up",
  },
  {
    label: "◀",
    keyName: "ArrowLeft",
    className: "mobile-game-control-left",
    ariaLabel: "Move left",
  },
  {
    label: "▶",
    keyName: "ArrowRight",
    className: "mobile-game-control-right",
    ariaLabel: "Move right",
  },
  {
    label: "▼",
    keyName: "ArrowDown",
    className: "mobile-game-control-down",
    ariaLabel: "Move down",
  },
];

function emitKeyboardEvent(type: "keydown" | "keyup", key: ControlKey) {
  const event = new KeyboardEvent(type, {
    key,
    code: key,
    bubbles: true,
    cancelable: true,
  });

  window.dispatchEvent(event);
  document.dispatchEvent(event);
}

function pressKey(key: ControlKey) {
  emitKeyboardEvent("keydown", key);
}

function releaseKey(key: ControlKey) {
  emitKeyboardEvent("keyup", key);
}

function releaseMovementKeys() {
  controls.forEach((control) => {
    releaseKey(control.keyName);
  });
}

export default function MobileGameControls() {
  return (
    <div className="mobile-game-controls" aria-label="Mobile game controls">
      <div className="mobile-game-dpad" aria-label="Movement controls">
        {controls.map((control) => (
          <button
            key={control.keyName}
            type="button"
            className={`mobile-game-control ${control.className}`}
            aria-label={control.ariaLabel}
            onPointerDown={(event) => {
              event.preventDefault();
              pressKey(control.keyName);
            }}
            onPointerUp={(event) => {
              event.preventDefault();
              releaseKey(control.keyName);
            }}
            onPointerCancel={(event) => {
              event.preventDefault();
              releaseKey(control.keyName);
            }}
            onPointerLeave={() => {
              releaseKey(control.keyName);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          >
            {control.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mobile-game-action"
        aria-label="Open nearby portfolio station"
        onPointerDown={(event) => {
          event.preventDefault();
          pressKey("Enter");
        }}
        onPointerUp={(event) => {
          event.preventDefault();
          releaseKey("Enter");
        }}
        onPointerCancel={(event) => {
          event.preventDefault();
          releaseKey("Enter");
        }}
        onPointerLeave={() => {
          releaseKey("Enter");
        }}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        Interact
      </button>

      <button
        type="button"
        className="mobile-game-release"
        onClick={releaseMovementKeys}
      >
        Stop
      </button>
    </div>
  );
}