import { useEffect } from "react";
import {
  pressVirtualControl,
  releaseAllVirtualControls,
  releaseVirtualControl,
  type VirtualControl,
} from "../game/input/virtualInput";

type ControlButton = {
  label: string;
  control: VirtualControl;
  className: string;
  ariaLabel: string;
};

const controls: ControlButton[] = [
  {
    label: "^",
    control: "up",
    className: "mobile-game-control-up",
    ariaLabel: "Move up",
  },
  {
    label: "<",
    control: "left",
    className: "mobile-game-control-left",
    ariaLabel: "Move left",
  },
  {
    label: ">",
    control: "right",
    className: "mobile-game-control-right",
    ariaLabel: "Move right",
  },
  {
    label: "v",
    control: "down",
    className: "mobile-game-control-down",
    ariaLabel: "Move down",
  },
];

export default function MobileGameControls() {
  useEffect(() => releaseAllVirtualControls, []);

  return (
    <div className="mobile-game-controls" aria-label="Mobile game controls">
      <div className="mobile-game-dpad" aria-label="Movement controls">
        {controls.map((control) => (
          <button
            key={control.control}
            type="button"
            className={`mobile-game-control ${control.className}`}
            aria-label={control.ariaLabel}
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              pressVirtualControl(control.control);
            }}
            onPointerUp={(event) => {
              event.preventDefault();
              releaseVirtualControl(control.control);
            }}
            onPointerCancel={(event) => {
              event.preventDefault();
              releaseVirtualControl(control.control);
            }}
            onPointerLeave={() => {
              releaseVirtualControl(control.control);
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
          event.currentTarget.setPointerCapture(event.pointerId);
          pressVirtualControl("interact");
        }}
        onPointerUp={(event) => {
          event.preventDefault();
          releaseVirtualControl("interact");
        }}
        onPointerCancel={(event) => {
          event.preventDefault();
          releaseVirtualControl("interact");
        }}
        onPointerLeave={() => {
          releaseVirtualControl("interact");
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
        onClick={releaseAllVirtualControls}
      >
        Stop
      </button>
    </div>
  );
}
