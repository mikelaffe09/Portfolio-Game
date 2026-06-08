import type { KaboomCtx, Vec2 } from "kaboom";
import { portfolioSections } from "../../data/portfolioData";

type OpenSectionHandler = (sectionId: string) => void;
type Rgb = [number, number, number];

const WIDTH = 960;
const HEIGHT = 540;
const PLAY_MIN_X = 34;
const PLAY_MAX_X = 894;
const PLAY_MIN_Y = 138;
const PLAY_MAX_Y = 454;

export function createMainScene(
  k: KaboomCtx,
  onOpenSection: OpenSectionHandler
) {
  const visitedSections = new Set<string>();
  const totalStations = portfolioSections.length;
  let sparkCount = 0;
  let nearbySection: string | null = null;
  let nearbyLabel = "";
  let promptTimer = 0;
  let finalePlayed = false;

  const rgb = (color: Rgb) => k.rgb(color[0], color[1], color[2]);
  const dim = k.rgb(45, 55, 70);

  k.add([k.rect(WIDTH, HEIGHT), k.pos(0, 0), k.color(5, 8, 13)]);
  drawWorld();

  const stationsText = k.add([
    k.text("Stations 0/4", { size: 15 }),
    k.pos(44, 28),
    k.color(233, 238, 246),
    k.z(20),
  ]);

  const sparkText = k.add([
    k.text("Sparks 0/8", { size: 15 }),
    k.pos(44, 52),
    k.color(156, 172, 191),
    k.z(20),
  ]);

  k.add([
    k.rect(220, 5, { radius: 999 }),
    k.pos(44, 78),
    k.color(25, 34, 45),
    k.opacity(0.9),
    k.z(20),
  ]);

  const progressFill = k.add([
    k.rect(1, 5, { radius: 999 }),
    k.pos(44, 78),
    k.color(45, 212, 191),
    k.opacity(0.95),
    k.z(21),
  ]);

  const objectiveText = k.add([
    k.text("Find the first station", { size: 14, width: 300, align: "right" }),
    k.pos(895, 32),
    k.anchor("topright"),
    k.color(156, 172, 191),
    k.z(20),
  ]);

  const portalStates = new Map<string, ReturnType<typeof createPortal>>();
  const portalLayout = [
    { id: "about", x: 74, y: 196, code: "01" },
    { id: "skills", x: 291, y: 196, code: "02" },
    { id: "projects", x: 508, y: 196, code: "03" },
    { id: "contact", x: 725, y: 196, code: "04" },
  ];

  portalLayout.forEach((layout, index) => {
    const section = portfolioSections.find((item) => item.id === layout.id);
    if (!section) return;

    const portal = createPortal(
      layout.x,
      layout.y,
      section.title,
      section.subtitle,
      section.id,
      section.sceneColor,
      layout.code,
      index
    );

    portalStates.set(section.id, portal);
  });

  const promptBox = k.add([
    k.rect(430, 42, { radius: 999 }),
    k.pos(265, 479),
    k.color(9, 13, 20),
    k.outline(1, k.rgb(74, 88, 110)),
    k.opacity(0),
    k.z(30),
  ]);

  const promptText = k.add([
    k.text("", { size: 15, width: 390, align: "center" }),
    k.pos(480, 500),
    k.anchor("center"),
    k.color(233, 238, 246),
    k.opacity(0),
    k.z(31),
  ]);

  const finalePanel = k.add([
    k.rect(430, 58, { radius: 8 }),
    k.pos(265, 124),
    k.color(10, 16, 24),
    k.outline(1, k.rgb(45, 212, 191)),
    k.opacity(0),
    k.z(30),
  ]);

  const finaleText = k.add([
    k.text("Route complete. Portfolio signal unlocked.", {
      size: 17,
      width: 390,
      align: "center",
    }),
    k.pos(480, 153),
    k.anchor("center"),
    k.color(235, 255, 248),
    k.opacity(0),
    k.z(31),
  ]);

  const playerGlow = k.add([
    k.circle(42),
    k.pos(480, 430),
    k.anchor("center"),
    k.color(65, 166, 255),
    k.opacity(0.1),
    k.z(9),
  ]);

  const shadow = k.add([
    k.circle(24),
    k.pos(480, 468),
    k.anchor("center"),
    k.scale(1.35, 0.28),
    k.color(0, 0, 0),
    k.opacity(0.38),
    k.z(10),
  ]);

  const player = k.add([
    k.rect(32, 38, { radius: 8 }),
    k.pos(464, 418),
    k.color(72, 166, 255),
    k.area({ scale: 0.78 }),
    k.rotate(0),
    k.z(12),
    "player",
  ]);

  const head = k.add([
    k.circle(14),
    k.pos(480, 406),
    k.anchor("center"),
    k.color(142, 231, 255),
    k.z(13),
  ]);

  const visor = k.add([
    k.rect(18, 5, { radius: 999 }),
    k.pos(471, 402),
    k.color(6, 14, 22),
    k.opacity(0.8),
    k.z(14),
  ]);

  const drone = k.add([
    k.circle(7),
    k.pos(514, 406),
    k.anchor("center"),
    k.color(248, 197, 55),
    k.opacity(0.95),
    k.z(14),
  ]);

  let velocity = k.vec2(0, 0);
  let facing = 1;

  createSparks();
  updateHud();

  player.onUpdate(() => {
    const dir = k.vec2(0, 0);

    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

    const moving = dir.x !== 0 || dir.y !== 0;
    const boost = k.isKeyDown("shift") ? 72 : 0;
    const sparkBoost = Math.min(sparkCount * 6, 42);
    const target = moving
      ? dir.unit().scale(225 + boost + sparkBoost)
      : k.vec2(0, 0);

    velocity = velocity.lerp(target, moving ? 0.2 : 0.3);
    player.move(velocity);

    player.pos.x = k.clamp(player.pos.x, PLAY_MIN_X, PLAY_MAX_X);
    player.pos.y = k.clamp(player.pos.y, PLAY_MIN_Y, PLAY_MAX_Y);

    if (Math.abs(velocity.x) > 5) facing = velocity.x > 0 ? 1 : -1;

    const bob = moving ? Math.sin(k.time() * 12) * 2 : Math.sin(k.time() * 3) * 1;
    player.angle = moving ? Math.sin(k.time() * 10) * 2.2 : 0;
    playerGlow.opacity = moving ? 0.18 : 0.1;
    playerGlow.pos = player.pos.add(16, 20);

    head.pos.x = player.pos.x + 16;
    head.pos.y = player.pos.y - 9 + bob;

    visor.pos.x = head.pos.x - 9 + facing * 4;
    visor.pos.y = head.pos.y - 4;

    shadow.pos.x = player.pos.x + 16;
    shadow.pos.y = player.pos.y + 43;
    shadow.scaleTo(1.2 + Math.abs(velocity.x) / 550, 0.25);

    const orbit = k.time() * 2.4;
    drone.pos.x = player.pos.x + 16 + Math.cos(orbit) * 34;
    drone.pos.y = player.pos.y + 4 + Math.sin(orbit * 1.2) * 18;
    drone.opacity = k.wave(0.62, 1, k.time() * 4);
  });

  player.onCollide("portal", (portal) => {
    nearbySection = portal.sectionId ?? null;
    nearbyLabel = portal.label ?? "";
    showPrompt(`E / Enter: open ${nearbyLabel}`);
  });

  player.onCollideEnd("portal", () => {
    nearbySection = null;
    nearbyLabel = "";
    hidePrompt();
  });

  player.onCollide("spark", (spark) => {
    if (spark.collected) return;

    spark.collected = true;
    sparkCount += 1;
    spawnBurst(spark.pos, spark.tint, 14);
    k.destroy(spark.glow);
    k.destroy(spark);
    updateHud(`Spark ${sparkCount}/8 synced`);
  });

  k.onKeyPress("e", () => {
    if (nearbySection) openStation(nearbySection, nearbyLabel);
  });

  k.onKeyPress("enter", () => {
    if (nearbySection) openStation(nearbySection, nearbyLabel);
  });

  k.onUpdate(() => {
    if (promptTimer > 0) {
      promptTimer -= k.dt();

      if (promptTimer <= 0 && !nearbySection) {
        hidePrompt();
      }
    }
  });

  function drawWorld() {
    for (let y = 0; y < HEIGHT; y += 36) {
      k.add([
        k.rect(WIDTH, 1),
        k.pos(0, y),
        k.color(18, 27, 38),
        k.opacity(y % 72 === 0 ? 0.55 : 0.25),
      ]);
    }

    for (let x = 0; x < WIDTH; x += 48) {
      k.add([
        k.rect(1, HEIGHT),
        k.pos(x, 0),
        k.color(18, 27, 38),
        k.opacity(x % 96 === 0 ? 0.5 : 0.22),
      ]);
    }

    for (let i = 0; i < 70; i += 1) {
      const x = (i * 139) % WIDTH;
      const y = 112 + ((i * 83) % 388);
      const size = i % 8 === 0 ? 2 : 1;

      k.add([
        k.rect(size, size),
        k.pos(x, y),
        k.color(i % 3 === 0 ? 45 : 32, i % 4 === 0 ? 212 : 145, 191),
        k.opacity(0.18 + (i % 5) * 0.05),
      ]);
    }

    k.add([k.rect(900, 2), k.pos(30, 112), k.color(dim), k.opacity(0.8)]);
    k.add([k.rect(900, 2), k.pos(30, 486), k.color(dim), k.opacity(0.8)]);
    k.add([k.rect(2, 374), k.pos(30, 112), k.color(dim), k.opacity(0.8)]);
    k.add([k.rect(2, 374), k.pos(928, 112), k.color(dim), k.opacity(0.8)]);

    k.add([
      k.text("SIGNAL RUN", { size: 30 }),
      k.pos(480, 36),
      k.anchor("center"),
      k.color(240, 246, 255),
    ]);

    k.add([
      k.text("Portfolio route active", { size: 14 }),
      k.pos(480, 68),
      k.anchor("center"),
      k.color(145, 164, 188),
    ]);

    k.add([k.rect(762, 5, { radius: 999 }), k.pos(99, 342), k.color(18, 38, 50), k.opacity(0.85)]);

    [148, 365, 582, 799].forEach((x) => {
      k.add([
        k.rect(4, 84, { radius: 999 }),
        k.pos(x, 316),
        k.color(18, 38, 50),
        k.opacity(0.7),
      ]);
    });
  }

  function createPortal(
    x: number,
    y: number,
    label: string,
    subtitle: string,
    sectionId: string,
    color: Rgb,
    code: string,
    index: number
  ) {
    const center = k.vec2(x + 74, y + 72);

    const ring = k.add([
      k.circle(72),
      k.pos(center),
      k.anchor("center"),
      k.color(color[0], color[1], color[2]),
      k.opacity(0.12),
      k.scale(1),
      k.z(3),
    ]);

    const zone = k.add([
      k.rect(148, 140, { radius: 8 }),
      k.pos(x, y),
      k.color(10, 14, 22),
      k.outline(1, rgb(color)),
      k.area(),
      k.opacity(0.92),
      k.z(6),
      { sectionId, label, completed: false },
      "portal",
    ]);

    k.add([
      k.rect(118, 52, { radius: 8 }),
      k.pos(x + 15, y + 18),
      k.color(color[0], color[1], color[2]),
      k.opacity(0.12),
      k.z(7),
    ]);

    k.add([
      k.text(code, { size: 28 }),
      k.pos(x + 28, y + 30),
      k.color(color[0], color[1], color[2]),
      k.z(8),
    ]);

    k.add([
      k.text(subtitle.toUpperCase(), { size: 9, width: 74, align: "right" }),
      k.pos(x + 129, y + 30),
      k.anchor("topright"),
      k.color(165, 177, 195),
      k.z(8),
    ]);

    const title = k.add([
      k.text(label.toUpperCase(), { size: 17, width: 118, align: "center" }),
      k.pos(x + 74, y + 91),
      k.anchor("center"),
      k.color(236, 241, 248),
      k.z(8),
    ]);

    const badge = k.add([
      k.text("READY", { size: 10 }),
      k.pos(x + 74, y + 118),
      k.anchor("center"),
      k.color(150, 168, 190),
      k.z(8),
    ]);

    zone.onClick(() => openStation(sectionId, label));
    zone.onUpdate(() => {
      const active = nearbySection === sectionId;
      const pulse = k.wave(0.96, active ? 1.1 : 1.02, k.time() * 2.4 + index);

      ring.scaleTo(pulse);
      ring.opacity = active ? 0.28 : zone.completed ? 0.18 : 0.1;
      title.color = zone.completed ? rgb(color) : k.rgb(236, 241, 248);
      badge.text = zone.completed ? "LOGGED" : active ? "OPEN" : "READY";
      badge.color = zone.completed ? rgb(color) : k.rgb(150, 168, 190);
    });

    return { center, color, zone, badge, title, ring };
  }

  function createSparks() {
    const sparkPositions = [
      k.vec2(78, 148),
      k.vec2(220, 426),
      k.vec2(340, 146),
      k.vec2(468, 428),
      k.vec2(620, 146),
      k.vec2(740, 426),
      k.vec2(882, 152),
      k.vec2(884, 438),
    ];

    sparkPositions.forEach((position, index) => {
      const tint = portfolioSections[index % totalStations].sceneColor;
      const glow = k.add([
        k.circle(21),
        k.pos(position),
        k.anchor("center"),
        k.color(tint[0], tint[1], tint[2]),
        k.opacity(0.1),
        k.z(4),
      ]);

      const spark = k.add([
        k.circle(7),
        k.pos(position),
        k.anchor("center"),
        k.color(tint[0], tint[1], tint[2]),
        k.area(),
        k.rotate(0),
        k.z(8),
        {
          baseY: position.y,
          collected: false,
          glow,
          phase: index * 0.65,
          tint,
        },
        "spark",
      ]);

      spark.onUpdate(() => {
        spark.pos.y = spark.baseY + Math.sin(k.time() * 2.8 + spark.phase) * 5;
        spark.angle += 80 * k.dt();
        glow.pos = spark.pos;
        glow.opacity = k.wave(0.06, 0.2, k.time() * 3 + spark.phase);
      });
    });
  }

  function openStation(sectionId: string, label: string) {
    const portal = portalStates.get(sectionId);

    if (!visitedSections.has(sectionId)) {
      visitedSections.add(sectionId);

      if (portal) {
        portal.zone.completed = true;
        spawnBurst(portal.center, portal.color, 22);
      }
    } else if (portal) {
      spawnBurst(portal.center, portal.color, 8);
    }

    updateHud(`${label} logged`);
    onOpenSection(sectionId);
  }

  function updateHud(message?: string) {
    stationsText.text = `Stations ${visitedSections.size}/${totalStations}`;
    sparkText.text = `Sparks ${sparkCount}/8`;
    progressFill.width = Math.max(1, 220 * (visitedSections.size / totalStations));

    const nextSection = portfolioSections.find(
      (section) => !visitedSections.has(section.id)
    );

    if (nextSection) {
      objectiveText.text = `Next: ${nextSection.title}`;
    } else {
      objectiveText.text = "Route complete";
    }

    if (message) showTimedPrompt(message);

    if (visitedSections.size === totalStations && !finalePlayed) {
      finalePlayed = true;
      finalePanel.opacity = 0.94;
      finaleText.opacity = 1;
      spawnBurst(k.vec2(480, 160), [45, 212, 191], 36);
    }
  }

  function showPrompt(text: string) {
    promptTimer = 0;
    promptBox.opacity = 0.94;
    promptText.opacity = 1;
    promptText.text = text;
  }

  function showTimedPrompt(text: string) {
    promptTimer = 1.25;
    promptBox.opacity = 0.94;
    promptText.opacity = 1;
    promptText.text = text;
  }

  function hidePrompt() {
    if (promptTimer > 0) return;

    promptBox.opacity = 0;
    promptText.opacity = 0;
    promptText.text = "";
  }

  function spawnBurst(origin: Vec2, color: Rgb, amount: number) {
    for (let i = 0; i < amount; i += 1) {
      const angle = (360 / amount) * i + k.rand(-14, 14);
      const speed = k.rand(70, 190);
      const particle = k.add([
        k.circle(k.rand(2, 4)),
        k.pos(origin.x, origin.y),
        k.anchor("center"),
        k.color(color[0], color[1], color[2]),
        k.opacity(0.86),
        k.lifespan(0.65, { fade: 0.45 }),
        k.z(35),
        { vel: k.Vec2.fromAngle(angle).scale(speed) },
      ]);

      particle.onUpdate(() => {
        particle.move(particle.vel);
        particle.vel.y += 180 * k.dt();
      });
    }
  }
}
