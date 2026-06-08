import type { StationId } from "../data/portfolioData";

export type RgbColor = readonly [number, number, number];

export type ZoneKind = "terminal" | "reactor" | "gate" | "tower";

export type StationWorldConfig = {
  sectionId: StationId;
  zoneTitle: string;
  zoneSubtitle: string;
  kind: ZoneKind;
  icon: string;
  position: {
    x: number;
    y: number;
  };
  radius: number;
  accent: RgbColor;
  deepAccent: RgbColor;
  lockedHint: string;
  readyHint: string;
  completedHint: string;
  orbLabels: string[];
};

export type DroneConfig = {
  id: string;
  label: string;
  position: {
    x: number;
    y: number;
  };
  color: RgbColor;
  travel: {
    x: number;
    y: number;
  };
  speed: number;
};

export type CollectibleConfig = {
  id: string;
  label: string;
  sectionId: StationId;
  position: {
    x: number;
    y: number;
  };
  color: RgbColor;
};
