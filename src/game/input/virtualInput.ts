export type VirtualControl = "up" | "down" | "left" | "right" | "interact";

type VirtualControlPressListener = (control: VirtualControl) => void;

const activeControls = new Set<VirtualControl>();
const pressListeners = new Set<VirtualControlPressListener>();

export function isVirtualControlDown(control: VirtualControl) {
  return activeControls.has(control);
}

export function pressVirtualControl(control: VirtualControl) {
  const wasActive = activeControls.has(control);
  activeControls.add(control);

  if (wasActive && control !== "interact") return;

  pressListeners.forEach((listener) => {
    listener(control);
  });
}

export function releaseVirtualControl(control: VirtualControl) {
  activeControls.delete(control);
}

export function releaseAllVirtualControls() {
  activeControls.clear();
}

export function onVirtualControlPress(listener: VirtualControlPressListener) {
  pressListeners.add(listener);

  return () => {
    pressListeners.delete(listener);
  };
}
