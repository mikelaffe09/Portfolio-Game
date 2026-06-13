import type { KaboomCtx } from "kaboom";
import {
  portfolioSectionById,
  stationOrder,
  type StationId,
} from "../../data/portfolioData";
import {
  collectibleConfigs,
  droneConfigs,
  routePoints,
  stationWorldConfig,
  worldSize,
} from "../config/worldConfig";
import {
  isVirtualControlDown,
  onVirtualControlPress,
} from "../input/virtualInput";
import {
  createSparkBurst,
  createAmbientSparks,
  createPortalShimmer,
  createRingPulse,
} from "../utils/createParticles";
import { createFloatingLabel } from "../utils/createFloatingLabel";
import type { RgbColor, StationWorldConfig } from "../types";

type CreateMainSceneOptions = {
  onOpenSection: (sectionId: StationId) => void;
  onLockedSection: (sectionId: StationId) => void;
  onCollectOrb: (orbId: string) => void;
  completedIds: StationId[];
  unlockedIds: StationId[];
  collectedOrbIds: string[];
  reducedMotion: boolean;
  initialPlayerPosition: PlayerPosition | null;
  onPlayerPositionChange: (position: PlayerPosition) => void;
};

type Direction = {
  x: number;
  y: number;
};

type PlayerPosition = {
  x: number;
  y: number;
};

function hasStationId(value: unknown): value is StationId {
  return typeof value === "string" && stationOrder.includes(value as StationId);
}

function getNextObjectiveConfig(
  completedIds: StationId[],
  unlockedIds: StationId[]
) {
  const completed = new Set(completedIds);
  const unlocked = new Set(unlockedIds);
  const nextUnlockedId =
    stationOrder.find((sectionId) => {
      return !completed.has(sectionId) && unlocked.has(sectionId);
    }) ?? null;
  const nextIncompleteId =
    nextUnlockedId ??
    stationOrder.find((sectionId) => !completed.has(sectionId)) ??
    null;

  if (!nextIncompleteId) return null;

  return (
    stationWorldConfig.find((config) => {
      return config.sectionId === nextIncompleteId;
    }) ?? null
  );
}

function getRgb(k: KaboomCtx, color: RgbColor) {
  return k.rgb(color[0], color[1], color[2]);
}

function drawRouteSegment(
  k: KaboomCtx,
  start: { x: number; y: number },
  end: { x: number; y: number },
  index: number,
  reducedMotion: boolean
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const midX = start.x + dx / 2;
  const midY = start.y + dy / 2;

  const base = k.add([
    k.rect(length, 5, { radius: 999 }),
    k.pos(midX, midY),
    k.anchor("center"),
    k.rotate(angle),
    k.color(33, 45, 62),
    k.opacity(0.52),
    k.z(3),
    "ambient",
  ]);

  const energy = k.add([
    k.rect(length * 0.78, 2, { radius: 999 }),
    k.pos(midX, midY),
    k.anchor("center"),
    k.rotate(angle),
    k.color(45, 212, 191),
    k.opacity(0.22),
    k.z(4),
    "ambient",
  ]);

  if (!reducedMotion) {
    base.onUpdate(() => {
      base.opacity = 0.42 + Math.sin(k.time() * 1.5 + index) * 0.08;
      energy.opacity = 0.2 + Math.sin(k.time() * 2.4 + index) * 0.13;
    });
  }
}

function createGridLights(k: KaboomCtx, reducedMotion: boolean) {
  const lights = [
    { x: 92, y: 372, color: [45, 212, 191] as RgbColor },
    { x: 260, y: 132, color: [255, 107, 107] as RgbColor },
    { x: 624, y: 116, color: [96, 165, 250] as RgbColor },
    { x: 828, y: 324, color: [248, 197, 55] as RgbColor },
    { x: 430, y: 452, color: [167, 139, 250] as RgbColor },
  ];

  lights.forEach((light, index) => {
    const node = k.add([
      k.rect(10, 10, { radius: 3 }),
      k.pos(light.x, light.y),
      k.anchor("center"),
      k.color(light.color[0], light.color[1], light.color[2]),
      k.opacity(0.2),
      k.scale(1),
      k.z(5),
      "ambient",
    ]);

    if (reducedMotion) return;

    node.onUpdate(() => {
      const pulse = Math.max(0, Math.sin(k.time() * 1.8 + index * 0.7));
      node.opacity = 0.12 + pulse * 0.32;
      node.scale = k.vec2(0.92 + pulse * 0.18);
    });
  });
}

function createDrones(k: KaboomCtx, reducedMotion: boolean) {
  droneConfigs.forEach((config, index) => {
    const body = k.add([
      k.rect(34, 18, { radius: 8 }),
      k.pos(config.position.x, config.position.y),
      k.anchor("center"),
      k.color(9, 15, 25),
      k.outline(1, getRgb(k, config.color)),
      k.opacity(0.82),
      k.z(18),
      "ambient",
    ]);

    const eye = k.add([
      k.rect(14, 4, { radius: 999 }),
      k.pos(config.position.x, config.position.y),
      k.anchor("center"),
      k.color(config.color[0], config.color[1], config.color[2]),
      k.opacity(0.78),
      k.z(19),
      "ambient",
    ]);

    const label = k.add([
      k.text(config.label, { size: 7 }),
      k.pos(config.position.x, config.position.y + 19),
      k.anchor("center"),
      k.color(210, 230, 245),
      k.opacity(0.7),
      k.z(19),
      "ambient",
    ]);

    if (reducedMotion) return;

    let trailTimer = index * 0.1;
    const phase = index * 1.4;

    body.onUpdate(() => {
      const t = k.time() * config.speed + phase;
      const driftX = Math.sin(t) * config.travel.x;
      const driftY = Math.sin(t * 0.72) * config.travel.y;
      body.pos.x = config.position.x + driftX;
      body.pos.y = config.position.y + driftY;
      eye.pos.x = body.pos.x + Math.cos(t) * 3;
      eye.pos.y = body.pos.y;
      label.pos.x = body.pos.x;
      label.pos.y = body.pos.y + 19;

      trailTimer -= k.dt();
      if (trailTimer <= 0) {
        trailTimer = 0.36;
        k.add([
          k.rect(10, 2, { radius: 999 }),
          k.pos(body.pos.x - Math.cos(t) * 18, body.pos.y),
          k.anchor("center"),
          k.color(config.color[0], config.color[1], config.color[2]),
          k.opacity(0.24),
          k.z(17),
          k.lifespan(0.58, { fade: 0.44 }),
          "ambient",
        ]);
      }
    });
  });
}

function createBackground(k: KaboomCtx, reducedMotion: boolean) {
  k.add([
    k.rect(worldSize.width, worldSize.height),
    k.pos(0, 0),
    k.color(4, 7, 12),
    k.z(0),
  ]);

  k.add([
    k.rect(worldSize.width, 78),
    k.pos(0, 0),
    k.color(8, 14, 24),
    k.opacity(0.82),
    k.z(1),
  ]);

  k.add([
    k.rect(worldSize.width, 1),
    k.pos(0, 78),
    k.color(45, 212, 191),
    k.opacity(0.26),
    k.z(2),
  ]);

  for (let x = 0; x <= worldSize.width; x += 48) {
    const line = k.add([
      k.rect(1, worldSize.height),
      k.pos(x, 0),
      k.color(43, 53, 72),
      k.opacity(0.28),
      k.z(1),
      "ambient",
    ]);

    if (!reducedMotion) {
      line.onUpdate(() => {
        line.opacity = 0.16 + Math.sin(k.time() * 1.2 + x * 0.03) * 0.08;
      });
    }
  }

  for (let y = 72; y <= worldSize.height; y += 48) {
    const line = k.add([
      k.rect(worldSize.width, 1),
      k.pos(0, y),
      k.color(43, 53, 72),
      k.opacity(0.24),
      k.z(1),
      "ambient",
    ]);

    if (!reducedMotion) {
      line.onUpdate(() => {
        line.opacity = 0.14 + Math.sin(k.time() * 1.4 + y * 0.025) * 0.08;
      });
    }
  }

  createAmbientSparks(k, {
    color: [103, 232, 249],
    height: worldSize.height,
    reducedMotion,
    width: worldSize.width,
  });

  createGridLights(k, reducedMotion);
  createDrones(k, reducedMotion);

  routePoints.slice(0, -1).forEach((point, index) => {
    drawRouteSegment(k, point, routePoints[index + 1], index, reducedMotion);
  });

  k.add([
    k.text("NEON PORTFOLIO QUEST", { size: 19 }),
    k.pos(28, 22),
    k.color(245, 250, 255),
    k.z(8),
  ]);

  k.add([
    k.text("Collect fragments. Activate each zone.", {
      size: 10,
    }),
    k.pos(29, 50),
    k.color(154, 168, 186),
    k.z(8),
  ]);
}

function createStationCore(
  k: KaboomCtx,
  config: StationWorldConfig,
  unlocked: boolean,
  completed: boolean,
  reducedMotion: boolean
) {
  const { x, y } = config.position;
  const accent = config.accent;
  const opacity = completed ? 0.94 : unlocked ? 0.78 : 0.34;

  if (config.kind === "terminal") {
    k.add([
      k.rect(88, 54, { radius: 8 }),
      k.pos(x, y),
      k.anchor("center"),
      k.color(10, 16, 24),
      k.outline(2, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);

    for (let index = 0; index < 3; index += 1) {
      k.add([
        k.rect(48 - index * 7, 3, { radius: 999 }),
        k.pos(x - 2, y - 14 + index * 13),
        k.anchor("center"),
        k.color(accent[0], accent[1], accent[2]),
        k.opacity(unlocked ? 0.72 : 0.24),
        k.z(16),
      ]);
    }
  }

  if (config.kind === "reactor") {
    k.add([
      k.circle(30),
      k.pos(x, y),
      k.anchor("center"),
      k.color(8, 22, 27),
      k.outline(2, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);

    config.orbLabels.forEach((label, index) => {
      const orbit = 45 + index * 9;
      const orb = k.add([
        k.circle(7),
        k.pos(x + orbit, y),
        k.anchor("center"),
        k.color(accent[0], accent[1], accent[2]),
        k.opacity(unlocked ? 0.82 : 0.22),
        k.z(16),
      ]);

      if (!reducedMotion) {
        const phase = (Math.PI * 2 * index) / config.orbLabels.length;

        orb.onUpdate(() => {
          const angle = k.time() * (0.8 + index * 0.14) + phase;
          orb.pos.x = x + Math.cos(angle) * orbit;
          orb.pos.y = y + Math.sin(angle) * (orbit * 0.58);
        });
      }

      k.add([
        k.text(label.toUpperCase(), { size: 7 }),
        k.pos(x - 42 + index * 42, y + 51),
        k.anchor("center"),
        k.color(210, 230, 235),
        k.opacity(unlocked ? 0.74 : 0.18),
        k.z(17),
      ]);
    });
  }

  if (config.kind === "gate") {
    k.add([
      k.rect(18, 82, { radius: 6 }),
      k.pos(x - 38, y),
      k.anchor("center"),
      k.color(35, 28, 14),
      k.outline(2, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);

    k.add([
      k.rect(18, 82, { radius: 6 }),
      k.pos(x + 38, y),
      k.anchor("center"),
      k.color(35, 28, 14),
      k.outline(2, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);

    k.add([
      k.rect(92, 16, { radius: 6 }),
      k.pos(x, y - 42),
      k.anchor("center"),
      k.color(35, 28, 14),
      k.outline(2, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);

    k.add([
      k.circle(24),
      k.pos(x, y - 3),
      k.anchor("center"),
      k.color(accent[0], accent[1], accent[2]),
      k.opacity(unlocked ? 0.24 : 0.08),
      k.z(14),
    ]);
  }

  if (config.kind === "tower") {
    k.add([
      k.rect(16, 92, { radius: 5 }),
      k.pos(x, y + 18),
      k.anchor("center"),
      k.color(16, 14, 31),
      k.outline(2, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);

    k.add([
      k.circle(26),
      k.pos(x, y - 42),
      k.anchor("center"),
      k.color(accent[0], accent[1], accent[2]),
      k.opacity(unlocked ? 0.28 : 0.08),
      k.z(15),
    ]);

    k.add([
      k.rect(76, 10, { radius: 999 }),
      k.pos(x, y + 66),
      k.anchor("center"),
      k.color(16, 14, 31),
      k.outline(1, getRgb(k, accent)),
      k.opacity(opacity),
      k.z(15),
    ]);
  }
}

function createStation(
  k: KaboomCtx,
  config: StationWorldConfig,
  completedIds: StationId[],
  unlockedIds: StationId[],
  reducedMotion: boolean,
  getNearbySection: () => StationId | null
) {
  const section = portfolioSectionById[config.sectionId];
  const unlocked = unlockedIds.includes(config.sectionId);
  const completed = completedIds.includes(config.sectionId);
  const { x, y } = config.position;
  const status = completed ? "COMPLETE" : unlocked ? "READY" : "LOCKED";
  const statusColor: RgbColor = completed
    ? [132, 255, 178]
    : unlocked
      ? config.accent
      : [128, 137, 153];

  const floor = k.add([
    k.circle(config.radius),
    k.pos(x, y),
    k.anchor("center"),
    k.color(config.deepAccent[0], config.deepAccent[1], config.deepAccent[2]),
    k.opacity(completed ? 0.34 : unlocked ? 0.22 : 0.1),
    k.z(6),
    "portal",
  ]);

  const ring = k.add([
    k.circle(config.radius - 8),
    k.pos(x, y),
    k.anchor("center"),
    k.color(config.accent[0], config.accent[1], config.accent[2]),
    k.outline(2, getRgb(k, config.accent)),
    k.opacity(completed ? 0.3 : unlocked ? 0.22 : 0.08),
    k.scale(1),
    k.z(7),
    "portal",
  ]);

  const innerRing = k.add([
    k.circle(config.radius - 32),
    k.pos(x, y),
    k.anchor("center"),
    k.color(config.accent[0], config.accent[1], config.accent[2]),
    k.opacity(completed ? 0.16 : unlocked ? 0.1 : 0.04),
    k.scale(1),
    k.z(8),
    "portal",
  ]);

  const nearbyRing = k.add([
    k.circle(config.radius + 14),
    k.pos(x, y),
    k.anchor("center"),
    k.color(config.accent[0], config.accent[1], config.accent[2]),
    k.outline(1, getRgb(k, config.accent)),
    k.opacity(0),
    k.scale(1),
    k.z(9),
    "portal",
  ]);

  createStationCore(k, config, unlocked, completed, reducedMotion);

  const coreWidth = completed ? 62 : 44;
  const coreLabel = completed ? "SYNCED" : config.icon;

  k.add([
    k.rect(coreWidth, 30, { radius: 8 }),
    k.pos(x, y - 2),
    k.anchor("center"),
    k.color(4, 8, 14),
    k.outline(1, getRgb(k, config.accent)),
    k.opacity(unlocked ? 0.82 : 0.38),
    k.z(23),
  ]);

  k.add([
    k.text(coreLabel, { size: completed ? 9 : 14 }),
    k.pos(x, y - 2),
    k.anchor("center"),
    k.color(
      unlocked ? config.accent[0] : 148,
      unlocked ? config.accent[1] : 154,
      unlocked ? config.accent[2] : 164
    ),
    k.opacity(unlocked ? 0.96 : 0.5),
    k.z(24),
  ]);

  k.add([
    k.text(status, { size: 9 }),
    k.pos(x, y + config.radius + 19),
    k.anchor("center"),
    k.color(statusColor[0], statusColor[1], statusColor[2]),
    k.z(22),
  ]);

  createFloatingLabel(k, {
    title: config.zoneTitle,
    subtitle: section.subtitle,
    x,
    y: y - config.radius - 32,
    color: config.accent,
    reducedMotion,
  });

  if (completed) {
    k.add([
      k.circle(config.radius + 2),
      k.pos(x, y),
      k.anchor("center"),
      k.color(132, 255, 178),
      k.opacity(0.08),
      k.z(11),
      "portal",
    ]);

    k.add([
      k.rect(38, 22, { radius: 999 }),
      k.pos(x + config.radius * 0.62, y - config.radius * 0.62),
      k.anchor("center"),
      k.color(9, 22, 16),
      k.outline(1, k.rgb(132, 255, 178)),
      k.opacity(0.94),
      k.z(26),
    ]);

    k.add([
      k.text("OK", { size: 11 }),
      k.pos(x + config.radius * 0.62, y - config.radius * 0.62 + 1),
      k.anchor("center"),
      k.color(132, 255, 178),
      k.z(27),
    ]);

  }

  if (!unlocked) {
    k.add([
      k.circle(26),
      k.pos(x + config.radius * 0.58, y - config.radius * 0.5),
      k.anchor("center"),
      k.color(10, 12, 18),
      k.outline(1, k.rgb(128, 137, 153)),
      k.opacity(0.92),
      k.z(26),
    ]);

    k.add([
      k.rect(17, 12, { radius: 3 }),
      k.pos(x + config.radius * 0.58, y - config.radius * 0.5 + 4),
      k.anchor("center"),
      k.color(74, 85, 104),
      k.opacity(0.86),
      k.z(27),
    ]);

    k.add([
      k.circle(7),
      k.pos(x + config.radius * 0.58, y - config.radius * 0.5 - 5),
      k.anchor("center"),
      k.color(10, 12, 18),
      k.outline(2, k.rgb(128, 137, 153)),
      k.opacity(0.86),
      k.z(27),
    ]);

    k.add([
      k.rect(92, 24, { radius: 999 }),
      k.pos(x, y + 2),
      k.anchor("center"),
      k.color(9, 11, 17),
      k.outline(1, k.rgb(112, 121, 136)),
      k.opacity(0.78),
      k.z(24),
    ]);

    k.add([
      k.text("LOCKED", { size: 11 }),
      k.pos(x, y + 3),
      k.anchor("center"),
      k.color(203, 213, 225),
      k.z(25),
    ]);
  }

  const hintBelowY = y + config.radius + 45;
  const hintAtSide = hintBelowY > worldSize.height - 32;
  const hintX = hintAtSide
    ? Math.min(worldSize.width - 74, x + config.radius + 76)
    : x;
  const hintY = hintAtSide ? y + 8 : hintBelowY;

  const enterHint = k.add([
    k.rect(118, 26, { radius: 999 }),
    k.pos(hintX, hintY),
    k.anchor("center"),
    k.color(5, 12, 20),
    k.outline(1, getRgb(k, config.accent)),
    k.opacity(0),
    k.scale(1),
    k.z(32),
    "ambient",
  ]);

  const enterHintText = k.add([
    k.text(unlocked ? "PRESS E / ENTER" : "LOCKED", { size: 9 }),
    k.pos(hintX, hintY + 1),
    k.anchor("center"),
    k.color(unlocked ? config.accent[0] : 255, unlocked ? config.accent[1] : 107, unlocked ? config.accent[2] : 107),
    k.opacity(0),
    k.z(33),
    "ambient",
  ]);

  k.add([
    k.circle(config.radius + 24),
    k.pos(x, y),
    k.anchor("center"),
    k.area(),
    k.opacity(0),
    k.z(30),
    {
      completed,
      hint: completed
        ? config.completedHint
        : unlocked
          ? config.readyHint
          : config.lockedHint,
      label: section.title,
      locked: !unlocked,
      sectionId: config.sectionId,
    },
    "station",
  ]);

  if (!reducedMotion) {
    const phase = x * 0.01 + y * 0.02;

    if (unlocked) {
      k.loop(2.6 + (x % 80) / 90, () => {
        createPortalShimmer(k, {
          x,
          y,
          color: completed ? [132, 255, 178] : config.accent,
          radius: config.radius - 6,
          reducedMotion,
        });
      });
    }

    ring.onUpdate(() => {
      const nearby = getNearbySection() === config.sectionId;
      const pulse = Math.sin(k.time() * 2.3 + phase);
      const boost = nearby ? 0.1 : 0;
      ring.scale = k.vec2(1 + pulse * 0.035 + boost);
      ring.opacity = (completed ? 0.32 : unlocked ? 0.2 : 0.08) + boost;
      innerRing.scale = k.vec2(1 + Math.sin(k.time() * 3 + phase) * 0.08);
      nearbyRing.opacity = nearby ? 0.24 + Math.max(0, pulse) * 0.12 : 0;
      nearbyRing.scale = k.vec2(1 + (nearby ? 0.05 + pulse * 0.02 : 0));
      enterHint.opacity = nearby ? 0.92 : 0;
      enterHint.scale = k.vec2(nearby ? 1 + Math.max(0, pulse) * 0.025 : 0.96);
      enterHintText.opacity = nearby ? 1 : 0;
      floor.opacity = completed
        ? 0.32
        : unlocked
          ? 0.2 + Math.max(0, pulse) * 0.08
          : 0.1;
    });
  } else {
    ring.onUpdate(() => {
      const nearby = getNearbySection() === config.sectionId;
      nearbyRing.opacity = nearby ? 0.18 : 0;
      enterHint.opacity = nearby ? 0.92 : 0;
      enterHintText.opacity = nearby ? 1 : 0;
    });
  }
}

function createPrompt(k: KaboomCtx) {
  const promptBox = k.add([
    k.rect(500, 40, { radius: 999 }),
    k.pos(480, 500),
    k.anchor("center"),
    k.color(8, 12, 20),
    k.outline(1, k.rgb(55, 68, 92)),
    k.opacity(0),
    k.z(70),
  ]);

  const promptText = k.add([
    k.text("", { size: 12, width: 440 }),
    k.pos(480, 501),
    k.anchor("center"),
    k.color(244, 248, 255),
    k.opacity(0),
    k.z(71),
  ]);

  return {
    hide() {
      promptBox.opacity = 0;
      promptText.opacity = 0;
      promptText.text = "";
    },
    show(message: string, color: RgbColor) {
      promptBox.opacity = 0.92;
      promptBox.outline.color = getRgb(k, color);
      promptText.opacity = 1;
      promptText.text = message;
      promptText.color = getRgb(k, color);
    },
  };
}

function createPlayer(
  k: KaboomCtx,
  reducedMotion: boolean,
  initialPosition: PlayerPosition | null,
  onPlayerPositionChange: (position: PlayerPosition) => void
) {
  const spawn = {
    x: k.clamp(initialPosition?.x ?? 112, 32, worldSize.width - 32),
    y: k.clamp(initialPosition?.y ?? 420, 96, worldSize.height - 42),
  };
  const speed = 250;
  let trailTimer = 0;
  const lastDirection: Direction = { x: 1, y: 0 };

  const shadow = k.add([
    k.rect(52, 12, { radius: 999 }),
    k.pos(spawn.x, spawn.y + 20),
    k.anchor("center"),
    k.color(0, 0, 0),
    k.opacity(0.38),
    k.scale(1),
    k.z(35),
  ]);

  const halo = k.add([
    k.circle(28),
    k.pos(spawn.x, spawn.y),
    k.anchor("center"),
    k.color(80, 190, 255),
    k.opacity(0.16),
    k.scale(1),
    k.z(36),
  ]);

  const player = k.add([
    k.circle(15),
    k.pos(spawn.x, spawn.y),
    k.anchor("center"),
    k.color(74, 181, 255),
    k.scale(1),
    k.area({ scale: 0.92 }),
    k.z(42),
    "player",
  ]);

  const core = k.add([
    k.circle(8),
    k.pos(spawn.x, spawn.y - 2),
    k.anchor("center"),
    k.color(229, 246, 255),
    k.opacity(0.92),
    k.z(43),
  ]);

  const visor = k.add([
    k.rect(18, 4, { radius: 999 }),
    k.pos(spawn.x + 5, spawn.y - 4),
    k.anchor("center"),
    k.color(4, 12, 22),
    k.opacity(0.82),
    k.z(44),
  ]);

  player.onUpdate(() => {
    const dir = k.vec2(0, 0);

    if (k.isKeyDown("left") || k.isKeyDown("a") || isVirtualControlDown("left")) {
      dir.x -= 1;
    }
    if (
      k.isKeyDown("right") ||
      k.isKeyDown("d") ||
      isVirtualControlDown("right")
    ) {
      dir.x += 1;
    }
    if (k.isKeyDown("up") || k.isKeyDown("w") || isVirtualControlDown("up")) {
      dir.y -= 1;
    }
    if (k.isKeyDown("down") || k.isKeyDown("s") || isVirtualControlDown("down")) {
      dir.y += 1;
    }

    const moving = dir.x !== 0 || dir.y !== 0;

    if (moving) {
      const unit = dir.unit();
      lastDirection.x = unit.x;
      lastDirection.y = unit.y;
      player.move(unit.scale(speed));
    }

    player.pos.x = k.clamp(player.pos.x, 32, worldSize.width - 32);
    player.pos.y = k.clamp(player.pos.y, 96, worldSize.height - 42);
    onPlayerPositionChange({ x: player.pos.x, y: player.pos.y });

    shadow.pos.x = player.pos.x;
    shadow.pos.y = player.pos.y + 20;
    halo.pos = player.pos;
    core.pos.x = player.pos.x + lastDirection.x * 2;
    core.pos.y = player.pos.y - 2 + lastDirection.y * 2;
    visor.pos.x = player.pos.x + lastDirection.x * 6;
    visor.pos.y = player.pos.y - 4 + lastDirection.y * 4;

    if (!reducedMotion) {
      const idlePulse = Math.sin(k.time() * 5) * 0.08;
      const moveLean = Math.abs(lastDirection.x) > Math.abs(lastDirection.y);
      halo.scale = k.vec2(1 + idlePulse + (moving ? 0.05 : 0));
      halo.opacity = moving ? 0.23 : 0.14 + Math.max(0, idlePulse) * 0.2;
      core.opacity = moving ? 1 : 0.86 + Math.max(0, idlePulse) * 0.14;
      player.scale = moving
        ? k.vec2(moveLean ? 1.12 : 0.94, moveLean ? 0.92 : 1.12)
        : k.vec2(1 + idlePulse * 0.32, 1 - idlePulse * 0.18);
      shadow.scale = k.vec2(moving ? 1.08 : 1, moving ? 0.92 : 1);

      trailTimer -= k.dt();
      if (moving && trailTimer <= 0) {
        trailTimer = 0.045;
        const trail = k.add([
          k.circle(8),
          k.pos(
            player.pos.x - lastDirection.x * 10,
            player.pos.y - lastDirection.y * 10
          ),
          k.anchor("center"),
          k.color(74, 181, 255),
          k.opacity(0.22),
          k.scale(1),
          k.z(34),
          k.lifespan(0.34, { fade: 0.28 }),
          "ambient",
        ]);

        trail.onUpdate(() => {
          trail.scale = trail.scale.add(k.vec2(2.8 * k.dt()));
        });
      }
    }
  });

  return player;
}

function createObjectiveMarker(
  k: KaboomCtx,
  target: StationWorldConfig,
  player: ReturnType<typeof createPlayer>,
  reducedMotion: boolean
) {
  const { x, y } = target.position;
  const badgeX = k.clamp(x, 84, worldSize.width - 84);
  const badgeY = k.clamp(y - target.radius - 58, 104, worldSize.height - 36);

  const beaconAura = k.add([
    k.circle(target.radius + 36),
    k.pos(x, y),
    k.anchor("center"),
    k.color(target.accent[0], target.accent[1], target.accent[2]),
    k.opacity(0.08),
    k.scale(1),
    k.z(12),
    "ambient",
  ]);

  const beaconRing = k.add([
    k.circle(target.radius + 20),
    k.pos(x, y),
    k.anchor("center"),
    k.color(target.accent[0], target.accent[1], target.accent[2]),
    k.outline(2, getRgb(k, target.accent)),
    k.opacity(0.22),
    k.scale(1),
    k.z(13),
    "ambient",
  ]);

  const badge = k.add([
    k.rect(78, 25, { radius: 999 }),
    k.pos(badgeX, badgeY),
    k.anchor("center"),
    k.color(5, 12, 20),
    k.outline(1, getRgb(k, target.accent)),
    k.opacity(0.94),
    k.scale(1),
    k.z(38),
    "ambient",
  ]);

  const badgeText = k.add([
    k.text("NEXT", { size: 10 }),
    k.pos(badgeX, badgeY + 1),
    k.anchor("center"),
    k.color(target.accent[0], target.accent[1], target.accent[2]),
    k.opacity(1),
    k.z(39),
    "ambient",
  ]);

  const routeDots = Array.from({ length: 6 }, (_, index) => {
    return k.add([
      k.circle(index === 5 ? 5 : 3),
      k.pos(x, y),
      k.anchor("center"),
      k.color(target.accent[0], target.accent[1], target.accent[2]),
      k.opacity(0),
      k.scale(1),
      k.z(37),
      "ambient",
    ]);
  });

  const updateGuide = () => {
    const dx = x - player.pos.x;
    const dy = y - player.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const visible = distance > target.radius + 44;

    if (!visible || distance === 0) {
      routeDots.forEach((dot) => {
        dot.opacity = 0;
      });
      return;
    }

    const unitX = dx / distance;
    const unitY = dy / distance;
    const startDistance = 34;
    const endDistance = distance - target.radius - 34;
    const guideLength = Math.max(0, endDistance - startDistance);
    const offset = reducedMotion ? 0 : (k.time() * 0.32) % 1;

    routeDots.forEach((dot, index) => {
      const baseProgress = (index + 1) / (routeDots.length + 1);
      const progress = reducedMotion
        ? baseProgress
        : (baseProgress + offset) % 1;
      const distanceAlong = startDistance + progress * guideLength;

      dot.pos.x = player.pos.x + unitX * distanceAlong;
      dot.pos.y = player.pos.y + unitY * distanceAlong;
      dot.opacity = reducedMotion ? 0.38 : 0.22 + progress * 0.48;
      dot.scale = reducedMotion
        ? k.vec2(1)
        : k.vec2(0.82 + Math.max(0, Math.sin(k.time() * 4 + index)) * 0.22);
    });
  };

  beaconAura.onUpdate(() => {
    updateGuide();

    if (reducedMotion) return;

    const pulse = Math.max(0, Math.sin(k.time() * 3.2));
    beaconAura.opacity = 0.06 + pulse * 0.09;
    beaconAura.scale = k.vec2(1 + pulse * 0.08);
    beaconRing.opacity = 0.2 + pulse * 0.14;
    beaconRing.scale = k.vec2(1 + pulse * 0.045);
    badge.scale = k.vec2(1 + pulse * 0.018);
    badgeText.opacity = 0.82 + pulse * 0.18;
  });
}

function createCollectibles(
  k: KaboomCtx,
  collectedOrbIds: string[],
  onCollectOrb: (orbId: string) => void,
  reducedMotion: boolean
) {
  const alreadyCollected = new Set(collectedOrbIds);
  const collectedInScene = new Set(collectedOrbIds);

  collectibleConfigs.forEach((config, index) => {
    if (alreadyCollected.has(config.id)) return;

    const orb = k.add([
      k.circle(12),
      k.pos(config.position.x, config.position.y),
      k.anchor("center"),
      k.color(config.color[0], config.color[1], config.color[2]),
      k.opacity(0.88),
      k.scale(1),
      k.area(),
      k.z(32),
      {
        label: config.label,
        orbId: config.id,
      },
      "collectible",
    ]);

    const glow = k.add([
      k.circle(23),
      k.pos(config.position.x, config.position.y),
      k.anchor("center"),
      k.color(config.color[0], config.color[1], config.color[2]),
      k.opacity(0.1),
      k.scale(1),
      k.z(31),
      "ambient",
    ]);

    const label = k.add([
      k.text(config.label.toUpperCase(), { size: 8 }),
      k.pos(config.position.x, config.position.y + 25),
      k.anchor("center"),
      k.color(219, 234, 254),
      k.opacity(0.72),
      k.z(33),
      "ambient",
    ]);

    if (!reducedMotion) {
      const phase = index * 0.65;

      orb.onUpdate(() => {
        const bob = Math.sin(k.time() * 2.2 + phase) * 4;
        orb.pos.y = config.position.y + bob;
        glow.pos.y = config.position.y + bob;
        label.pos.y = config.position.y + 25 + bob;
        glow.scale = k.vec2(1 + Math.sin(k.time() * 3 + phase) * 0.08);
      });
    }

    orb.onCollide("player", () => {
      if (collectedInScene.has(config.id)) return;

      collectedInScene.add(config.id);
      createSparkBurst(k, {
        x: orb.pos.x,
        y: orb.pos.y,
        color: config.color,
        count: 12,
        reducedMotion,
      });
      onCollectOrb(config.id);
      k.destroy(orb);
      k.destroy(glow);
      k.destroy(label);
    });
  });
}

function createFinaleEffect(k: KaboomCtx, reducedMotion: boolean) {
  const center = { x: 760, y: 72 };
  const pulse = k.add([
    k.circle(96),
    k.pos(center.x, center.y),
    k.anchor("center"),
    k.color(248, 197, 55),
    k.opacity(0.06),
    k.scale(1),
    k.z(9),
    "ambient",
  ]);

  k.add([
    k.rect(318, 48, { radius: 10 }),
    k.pos(center.x, center.y),
    k.anchor("center"),
    k.color(7, 12, 20),
    k.outline(1, k.rgb(248, 197, 55)),
    k.opacity(0.88),
    k.z(52),
  ]);

  k.add([
    k.text("PORTFOLIO RUN COMPLETE", { size: 15 }),
    k.pos(center.x, center.y - 8),
    k.anchor("center"),
    k.color(255, 247, 214),
    k.z(53),
  ]);

  k.add([
    k.text("All portfolio zones are synced", { size: 10 }),
    k.pos(center.x, center.y + 12),
    k.anchor("center"),
    k.color(209, 213, 219),
    k.z(53),
  ]);

  if (!reducedMotion) {
    pulse.onUpdate(() => {
      pulse.scale = k.vec2(1 + Math.sin(k.time() * 2.2) * 0.08);
      pulse.opacity = 0.08 + Math.max(0, Math.sin(k.time() * 3)) * 0.08;
    });

    for (let index = 0; index < 5; index += 1) {
      k.wait(index * 0.34, () => {
        const offset = k.vec2(k.rand(-96, 96), k.rand(-28, 28));
        createSparkBurst(k, {
          x: center.x + offset.x,
          y: center.y + offset.y,
          color: index % 2 === 0 ? [248, 197, 55] : [45, 212, 191],
          count: 16,
          reducedMotion,
        });
      });
    }
  } else {
    k.wait(0.05, () => {
      createSparkBurst(k, {
        x: center.x,
        y: center.y,
        color: [248, 197, 55],
        count: 6,
        reducedMotion,
      });
    });
  }
}

export function createMainScene(k: KaboomCtx, options: CreateMainSceneOptions) {
  const {
    onOpenSection,
    onLockedSection,
    onCollectOrb,
    completedIds,
    unlockedIds,
    collectedOrbIds,
    reducedMotion,
    initialPlayerPosition,
    onPlayerPositionChange,
  } = options;

  let nearbySection: StationId | null = null;
  let nearbyLocked = false;
  let nearbyHint = "";

  createBackground(k, reducedMotion);

  const prompt = createPrompt(k);

  stationWorldConfig.forEach((config) => {
    createStation(
      k,
      config,
      completedIds,
      unlockedIds,
      reducedMotion,
      () => nearbySection
    );
  });

  const player = createPlayer(
    k,
    reducedMotion,
    initialPlayerPosition,
    onPlayerPositionChange
  );
  const nextObjectiveConfig = getNextObjectiveConfig(completedIds, unlockedIds);

  if (nextObjectiveConfig) {
    createObjectiveMarker(k, nextObjectiveConfig, player, reducedMotion);
  }

  createCollectibles(k, collectedOrbIds, onCollectOrb, reducedMotion);

  if (completedIds.length === stationOrder.length) {
    createFinaleEffect(k, reducedMotion);
  }

  function getConfig(sectionId: StationId) {
    return stationWorldConfig.find((config) => config.sectionId === sectionId);
  }

  function attemptOpen(sectionId: StationId, locked: boolean) {
    const config = getConfig(sectionId);
    onPlayerPositionChange({ x: player.pos.x, y: player.pos.y });

    if (locked) {
      createRingPulse(k, {
        x: player.pos.x,
        y: player.pos.y,
        color: [255, 107, 107],
        radius: 18,
        reducedMotion,
      });
      prompt.show(config?.lockedHint ?? "This zone is locked.", [255, 107, 107]);
      onLockedSection(sectionId);
      return;
    }

    if (config) {
      createRingPulse(k, {
        x: player.pos.x,
        y: player.pos.y,
        color: config.accent,
        radius: 22,
        reducedMotion,
      });
      createSparkBurst(k, {
        x: config.position.x,
        y: config.position.y,
        color: config.accent,
        count: 18,
        reducedMotion,
      });
    }

    onOpenSection(sectionId);
  }

  player.onCollide("station", (station) => {
    const sectionId = hasStationId(station.sectionId) ? station.sectionId : null;
    if (!sectionId) return;

    nearbySection = sectionId;
    nearbyLocked = Boolean(station.locked);
    nearbyHint = typeof station.hint === "string" ? station.hint : "";

    const config = getConfig(sectionId);
    const color: RgbColor = nearbyLocked
      ? [255, 107, 107]
      : config?.accent ?? [45, 212, 191];
    prompt.show(nearbyHint, color);
  });

  player.onCollideEnd("station", (station) => {
    const sectionId = hasStationId(station.sectionId) ? station.sectionId : null;

    if (!sectionId || sectionId !== nearbySection) return;

    nearbySection = null;
    nearbyLocked = false;
    nearbyHint = "";
    prompt.hide();
  });

  k.onClick("station", (station) => {
    const sectionId = hasStationId(station.sectionId) ? station.sectionId : null;
    if (!sectionId) return;

    attemptOpen(sectionId, Boolean(station.locked));
  });

  k.onKeyPress("e", () => {
    if (!nearbySection) return;
    attemptOpen(nearbySection, nearbyLocked);
  });

  k.onKeyPress("enter", () => {
    if (!nearbySection) return;
    attemptOpen(nearbySection, nearbyLocked);
  });

  const unsubscribeVirtualPress = onVirtualControlPress((control) => {
    if (control !== "interact" || !nearbySection) return;

    attemptOpen(nearbySection, nearbyLocked);
  });

  return () => {
    onPlayerPositionChange({ x: player.pos.x, y: player.pos.y });
    unsubscribeVirtualPress();
  };
}
