import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  pressVirtualControl,
  releaseAllVirtualControls,
  releaseVirtualControl,
} from "../game/input/virtualInput";

const movementControls = ["up", "down", "left", "right"] as const;
const joystickRadius = 34;
const joystickDeadZone = 10;
const centeredJoystick = {
  active: false,
  x: 0,
  y: 0,
};

type MovementControl = (typeof movementControls)[number];
type IconName =
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "interact"
  | "stop";

type JoystickState = typeof centeredJoystick;

const directionIconNames: Record<MovementControl, IconName> = {
  up: "arrow-up",
  down: "arrow-down",
  left: "arrow-left",
  right: "arrow-right",
};

function getJoystickOffset(event: ReactPointerEvent<HTMLDivElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const rawX = event.clientX - (bounds.left + bounds.width / 2);
  const rawY = event.clientY - (bounds.top + bounds.height / 2);
  const distance = Math.hypot(rawX, rawY);
  const clamp = distance > joystickRadius ? joystickRadius / distance : 1;

  return {
    x: rawX * clamp,
    y: rawY * clamp,
  };
}

function getMovementControls(x: number, y: number) {
  const controls: MovementControl[] = [];

  if (Math.abs(x) > joystickDeadZone) {
    controls.push(x > 0 ? "right" : "left");
  }

  if (Math.abs(y) > joystickDeadZone) {
    controls.push(y > 0 ? "down" : "up");
  }

  return controls;
}

function ControlIcon({ name }: { name: IconName }) {
  return (
    <svg
      className="mobile-game-control-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "arrow-up" && <path d="m12 5-6 6m6-6 6 6m-6-6v14" />}
      {name === "arrow-down" && <path d="m12 19-6-6m6 6 6-6m-6 6V5" />}
      {name === "arrow-left" && <path d="m5 12 6-6m-6 6 6 6m-6-6h14" />}
      {name === "arrow-right" && <path d="m19 12-6-6m6 6-6 6m6-6H5" />}
      {name === "interact" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        </>
      )}
      {name === "stop" && <rect x="7" y="7" width="10" height="10" rx="2" />}
    </svg>
  );
}

export default function MobileGameControls() {
  const [joystick, setJoystick] = useState<JoystickState>(centeredJoystick);
  const [activeDirections, setActiveDirections] = useState<
    Set<MovementControl>
  >(() => new Set());
  const [interactActive, setInteractActive] = useState(false);
  const activeDirectionsRef = useRef<Set<MovementControl>>(new Set());
  const joystickPointerIdRef = useRef<number | null>(null);

  const syncMovementControls = useCallback((nextControls: MovementControl[]) => {
    const nextDirections = new Set(nextControls);
    const directionChanged = movementControls.some((control) => {
      return (
        nextDirections.has(control) !== activeDirectionsRef.current.has(control)
      );
    });

    if (directionChanged) {
      activeDirectionsRef.current = nextDirections;
      setActiveDirections(nextDirections);
    }

    movementControls.forEach((control) => {
      if (nextDirections.has(control)) {
        pressVirtualControl(control);
        return;
      }

      releaseVirtualControl(control);
    });
  }, []);

  const resetMovementControls = useCallback(() => {
    joystickPointerIdRef.current = null;
    setJoystick(centeredJoystick);
    syncMovementControls([]);
  }, [syncMovementControls]);

  const resetAllControls = useCallback(() => {
    joystickPointerIdRef.current = null;
    activeDirectionsRef.current = new Set();
    releaseAllVirtualControls();
    setActiveDirections(new Set());
    setInteractActive(false);
    setJoystick(centeredJoystick);
  }, []);

  useEffect(() => {
    return () => {
      releaseAllVirtualControls();
    };
  }, []);

  const handleJoystickPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      joystickPointerIdRef.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);

      const offset = getJoystickOffset(event);
      setJoystick({ active: true, ...offset });
      syncMovementControls(getMovementControls(offset.x, offset.y));
    },
    [syncMovementControls]
  );

  const handleJoystickPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (joystickPointerIdRef.current !== event.pointerId) return;

      event.preventDefault();

      const offset = getJoystickOffset(event);
      setJoystick({ active: true, ...offset });
      syncMovementControls(getMovementControls(offset.x, offset.y));
    },
    [syncMovementControls]
  );

  const handleJoystickPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (joystickPointerIdRef.current !== event.pointerId) return;

      event.preventDefault();

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      resetMovementControls();
    },
    [resetMovementControls]
  );

  const handleJoystickLostCapture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (joystickPointerIdRef.current !== event.pointerId) return;

      resetMovementControls();
    },
    [resetMovementControls]
  );

  const handleInteractPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setInteractActive(true);
      pressVirtualControl("interact");
    },
    []
  );

  const handleInteractPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setInteractActive(false);
      releaseVirtualControl("interact");
    },
    []
  );

  const joystickClassName = `mobile-game-joystick${
    joystick.active ? " is-active" : ""
  }`;
  const actionClassName = `mobile-game-action${
    interactActive ? " is-active" : ""
  }`;

  return (
    <div
      className="mobile-game-controls"
      role="group"
      aria-label="Mobile game controls"
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <div
        className={joystickClassName}
        role="group"
        aria-label="Virtual joystick movement controls"
        title="Move"
        onPointerDown={handleJoystickPointerDown}
        onPointerMove={handleJoystickPointerMove}
        onPointerUp={handleJoystickPointerEnd}
        onPointerCancel={handleJoystickPointerEnd}
        onLostPointerCapture={handleJoystickLostCapture}
      >
        {movementControls.map((control) => (
          <span
            key={control}
            className={`mobile-game-joystick-direction mobile-game-joystick-direction-${control}${
              activeDirections.has(control) ? " is-active" : ""
            }`}
            aria-hidden="true"
          >
            <ControlIcon name={directionIconNames[control]} />
          </span>
        ))}
        <span
          className="mobile-game-joystick-thumb"
          style={{
            transform: `translate(calc(-50% + ${joystick.x}px), calc(-50% + ${joystick.y}px))`,
          }}
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        className={actionClassName}
        aria-label="Open nearby portfolio station"
        aria-pressed={interactActive}
        title="Open station"
        onPointerDown={handleInteractPointerDown}
        onPointerUp={handleInteractPointerEnd}
        onPointerCancel={handleInteractPointerEnd}
        onPointerLeave={handleInteractPointerEnd}
      >
        <ControlIcon name="interact" />
      </button>

      <button
        type="button"
        className="mobile-game-release"
        aria-label="Stop movement"
        title="Stop movement"
        onClick={resetAllControls}
      >
        <ControlIcon name="stop" />
      </button>
    </div>
  );
}
