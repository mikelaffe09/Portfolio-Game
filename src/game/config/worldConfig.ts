import type { CollectibleConfig, DroneConfig, StationWorldConfig } from "../types";

export const worldSize = {
  width: 960,
  height: 540,
};

export const stationWorldConfig: StationWorldConfig[] = [
  {
    sectionId: "about",
    zoneTitle: "Origin Terminal",
    zoneSubtitle: "About",
    kind: "terminal",
    icon: "</>",
    position: { x: 202, y: 272 },
    radius: 72,
    accent: [255, 107, 107],
    deepAccent: [92, 37, 56],
    lockedHint: "Origin Terminal is waiting for route sync.",
    readyHint: "Press E / Enter to enter the Origin Terminal.",
    completedHint: "Origin Terminal archived.",
    orbLabels: ["React", "UI"],
  },
  {
    sectionId: "skills",
    zoneTitle: "Skill Reactor",
    zoneSubtitle: "Skills",
    kind: "reactor",
    icon: "{}",
    position: { x: 460, y: 208 },
    radius: 76,
    accent: [45, 212, 191],
    deepAccent: [18, 83, 82],
    lockedHint: "Complete the Origin Terminal to stabilize the reactor.",
    readyHint: "Press E / Enter to enter the Skill Reactor.",
    completedHint: "Skill Reactor calibrated.",
    orbLabels: ["TypeScript", "CSS", "APIs"],
  },
  {
    sectionId: "projects",
    zoneTitle: "Project Gate",
    zoneSubtitle: "Projects",
    kind: "gate",
    icon: ">>",
    position: { x: 728, y: 276 },
    radius: 78,
    accent: [248, 197, 55],
    deepAccent: [96, 72, 26],
    lockedHint: "Calibrate the Skill Reactor to unlock the Project Gate.",
    readyHint: "Press E / Enter to enter the Project Gate.",
    completedHint: "Project Gate cleared.",
    orbLabels: ["Case Study", "Impact"],
  },
  {
    sectionId: "contact",
    zoneTitle: "Signal Tower",
    zoneSubtitle: "Contact",
    kind: "tower",
    icon: "@",
    position: { x: 510, y: 390 },
    radius: 70,
    accent: [167, 139, 250],
    deepAccent: [62, 50, 109],
    lockedHint: "Clear the Project Gate to raise the Signal Tower.",
    readyHint: "Press E / Enter to enter the Signal Tower.",
    completedHint: "Signal Tower broadcasting.",
    orbLabels: ["Contact", "Next Step"],
  },
];

export const droneConfigs: DroneConfig[] = [
  {
    id: "drone-ui",
    label: "UI",
    position: { x: 146, y: 158 },
    color: [45, 212, 191],
    travel: { x: 52, y: 18 },
    speed: 0.52,
  },
  {
    id: "drone-ts",
    label: "TS",
    position: { x: 818, y: 126 },
    color: [96, 165, 250],
    travel: { x: -64, y: 26 },
    speed: 0.44,
  },
  {
    id: "drone-a11y",
    label: "A11Y",
    position: { x: 842, y: 442 },
    color: [167, 139, 250],
    travel: { x: -44, y: -34 },
    speed: 0.38,
  },
];

export const collectibleConfigs: CollectibleConfig[] = [
  {
    id: "orb-react",
    label: "React",
    sectionId: "skills",
    position: { x: 322, y: 340 },
    color: [45, 212, 191],
  },
  {
    id: "orb-typescript",
    label: "TypeScript",
    sectionId: "skills",
    position: { x: 592, y: 146 },
    color: [96, 165, 250],
  },
  {
    id: "orb-css",
    label: "CSS",
    sectionId: "skills",
    position: { x: 296, y: 150 },
    color: [248, 197, 55],
  },
  {
    id: "orb-accessibility",
    label: "A11y",
    sectionId: "about",
    position: { x: 830, y: 402 },
    color: [255, 107, 107],
  },
  {
    id: "orb-product",
    label: "Product",
    sectionId: "projects",
    position: { x: 86, y: 350 },
    color: [167, 139, 250],
  },
  {
    id: "orb-vite",
    label: "Vite",
    sectionId: "projects",
    position: { x: 866, y: 158 },
    color: [248, 197, 55],
  },
];

export const routePoints = [
  { x: 112, y: 420 },
  stationWorldConfig[0].position,
  stationWorldConfig[1].position,
  stationWorldConfig[2].position,
  stationWorldConfig[3].position,
];
