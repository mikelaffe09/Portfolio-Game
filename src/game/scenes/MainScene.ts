import type { KaboomCtx } from "kaboom";
import type { StationId } from "../../data/portfolioData";
import { portfolioSections } from "../../data/portfolioData";

type CreateMainSceneOptions = {
  onOpenSection: (sectionId: StationId) => void;
  completedIds: StationId[];
  unlockedIds: StationId[];
};

export function createMainScene(k: KaboomCtx, options: CreateMainSceneOptions) {
  const { onOpenSection, completedIds, unlockedIds } = options;

  const speed = 250;
  let nearbySection: StationId | null = null;
  let nearbyLabel = "";
  let nearbyLocked = false;

  k.add([k.rect(960, 540), k.pos(0, 0), k.color(7, 7, 10)]);

  for (let x = 0; x < 960; x += 40) {
    k.add([k.rect(1, 540), k.pos(x, 0), k.color(18, 18, 24), k.opacity(0.45)]);
  }

  for (let y = 0; y < 540; y += 40) {
    k.add([k.rect(960, 1), k.pos(0, y), k.color(18, 18, 24), k.opacity(0.45)]);
  }

  k.add([
    k.text("SIGNAL RUN", { size: 32 }),
    k.pos(480, 48),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  k.add([
    k.text("Unlock each station in order", { size: 15 }),
    k.pos(480, 82),
    k.anchor("center"),
    k.color(160, 160, 175),
  ]);

  k.add([k.rect(920, 2), k.pos(20, 110), k.color(70, 70, 90)]);
  k.add([k.rect(920, 2), k.pos(20, 510), k.color(70, 70, 90)]);
  k.add([k.rect(2, 400), k.pos(20, 110), k.color(70, 70, 90)]);
  k.add([k.rect(2, 400), k.pos(940, 110), k.color(70, 70, 90)]);

  function createStationCard(
    x: number,
    y: number,
    sectionId: StationId,
    index: number
  ) {
    const section = portfolioSections.find((item) => item.id === sectionId);
    if (!section) return;

    const unlocked = unlockedIds.includes(sectionId);
    const completed = completedIds.includes(sectionId);
    const color = section.sceneColor;
    const opacity = unlocked ? 1 : 0.32;
    const status = completed ? "COMPLETE" : unlocked ? "READY" : "LOCKED";

    k.add([
      k.circle(82),
      k.pos(x + 66, y + 68),
      k.anchor("center"),
      k.color(color[0], color[1], color[2]),
      k.opacity(completed ? 0.22 : unlocked ? 0.12 : 0.04),
    ]);

    k.add([
      k.rect(132, 150, { radius: 14 }),
      k.pos(x, y),
      k.color(16, 16, 22),
      k.outline(2, k.rgb(color[0], color[1], color[2])),
      k.opacity(opacity),
      k.area(),
      {
        sectionId,
        label: section.title,
        locked: !unlocked,
      },
      "zone",
    ]);

    k.add([
      k.rect(76, 76, { radius: 12 }),
      k.pos(x + 28, y + 24),
      k.color(color[0], color[1], color[2]),
      k.opacity(unlocked ? 0.88 : 0.18),
    ]);

    k.add([
      k.text(String(index).padStart(2, "0"), { size: 28 }),
      k.pos(x + 46, y + 63),
      k.anchor("center"),
      k.color(unlocked ? 10 : 120, unlocked ? 10 : 120, unlocked ? 12 : 130),
    ]);

    k.add([
      k.text(section.subtitle.toUpperCase(), { size: 8, width: 58 }),
      k.pos(x + 80, y + 50),
      k.anchor("center"),
      k.color(210, 210, 220),
      k.opacity(opacity),
    ]);

    k.add([
      k.text(section.title.toUpperCase(), { size: 16 }),
      k.pos(x + 66, y + 112),
      k.anchor("center"),
      k.color(255, 255, 255),
      k.opacity(opacity),
    ]);

    k.add([
      k.text(status, { size: 10 }),
      k.pos(x + 66, y + 136),
      k.anchor("center"),
      k.color(
        completed ? 120 : unlocked ? 190 : 120,
        completed ? 255 : unlocked ? 190 : 120,
        completed ? 160 : unlocked ? 200 : 120
      ),
    ]);

    if (completed) {
      k.add([
        k.text("✓", { size: 26 }),
        k.pos(x + 116, y + 18),
        k.anchor("center"),
        k.color(120, 255, 160),
      ]);
    }

    if (!unlocked) {
      k.add([
        k.text("LOCK", { size: 11 }),
        k.pos(x + 66, y + 76),
        k.anchor("center"),
        k.color(200, 200, 210),
      ]);
    }
  }

  createStationCard(100, 210, "about", 1);
  createStationCard(310, 210, "skills", 2);
  createStationCard(520, 210, "projects", 3);
  createStationCard(730, 210, "contact", 4);

  const player = k.add([
    k.rect(34, 42, { radius: 8 }),
    k.pos(463, 430),
    k.color(70, 170, 255),
    k.area(),
    "player",
  ]);

  const head = k.add([
    k.circle(13),
    k.pos(player.pos.x + 17, player.pos.y - 10),
    k.color(130, 220, 255),
  ]);

  const shadow = k.add([
  k.rect(52, 14, { radius: 999 }),
  k.pos(player.pos.x - 9, player.pos.y + 39),
  k.color(0, 0, 0),
  k.opacity(0.35),
]);

  const promptBox = k.add([
    k.rect(420, 38, { radius: 999 }),
    k.pos(270, 475),
    k.color(20, 20, 28),
    k.outline(1, k.rgb(80, 80, 100)),
    k.opacity(0),
  ]);

  const promptText = k.add([
    k.text("", { size: 16 }),
    k.pos(480, 494),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  player.onUpdate(() => {
    const dir = k.vec2(0, 0);

    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

    if (dir.x !== 0 || dir.y !== 0) {
      player.move(dir.unit().scale(speed));
    }

    player.pos.x = k.clamp(player.pos.x, 30, 896);
    player.pos.y = k.clamp(player.pos.y, 145, 455);

    head.pos.x = player.pos.x + 17;
    head.pos.y = player.pos.y - 10;

    shadow.pos.x = player.pos.x - 9;
shadow.pos.y = player.pos.y + 39;
  });

  player.onCollide("zone", (zone) => {
    nearbySection = zone.sectionId ?? null;
    nearbyLabel = zone.label ?? "";
    nearbyLocked = zone.locked ?? false;

    promptBox.opacity = 1;
    promptText.text = nearbyLocked
      ? `${nearbyLabel} is locked. Complete the previous station first.`
      : `Press E to open ${nearbyLabel}`;
  });

  player.onCollideEnd("zone", () => {
    nearbySection = null;
    nearbyLabel = "";
    nearbyLocked = false;
    promptBox.opacity = 0;
    promptText.text = "";
  });

  k.onKeyPress("e", () => {
    if (nearbySection && !nearbyLocked) {
      onOpenSection(nearbySection);
    }
  });

  k.onKeyPress("enter", () => {
    if (nearbySection && !nearbyLocked) {
      onOpenSection(nearbySection);
    }
  });
}