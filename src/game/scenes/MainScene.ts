import type { KaboomCtx } from "kaboom";

type OpenSectionHandler = (sectionId: string) => void;

export function createMainScene(
  k: KaboomCtx,
  onOpenSection: OpenSectionHandler
) {
  const speed = 250;
  let nearbySection: string | null = null;
  let nearbyLabel = "";

  k.add([k.rect(960, 540), k.pos(0, 0), k.color(7, 7, 10)]);

  for (let x = 0; x < 960; x += 40) {
    k.add([k.rect(1, 540), k.pos(x, 0), k.color(18, 18, 24), k.opacity(0.45)]);
  }

  for (let y = 0; y < 540; y += 40) {
    k.add([k.rect(960, 1), k.pos(0, y), k.color(18, 18, 24), k.opacity(0.45)]);
  }

  k.add([
    k.text("INTERACTIVE PORTFOLIO", { size: 30 }),
    k.pos(480, 44),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  k.add([
    k.text("Explore the portfolio like a small game world", { size: 15 }),
    k.pos(480, 78),
    k.anchor("center"),
    k.color(160, 160, 175),
  ]);

  // outer frame
  k.add([k.rect(920, 2), k.pos(20, 110), k.color(70, 70, 90)]);
  k.add([k.rect(920, 2), k.pos(20, 510), k.color(70, 70, 90)]);
  k.add([k.rect(2, 400), k.pos(20, 110), k.color(70, 70, 90)]);
  k.add([k.rect(2, 400), k.pos(940, 110), k.color(70, 70, 90)]);

  function createPortal(
    x: number,
    y: number,
    label: string,
    sectionId: string,
    color: [number, number, number],
    icon: string
  ) {
    // glow
    k.add([
      k.circle(78),
      k.pos(x + 60, y + 58),
      k.anchor("center"),
      k.color(color[0], color[1], color[2]),
      k.opacity(0.12),
    ]);

    // card base
    k.add([
      k.rect(132, 150, { radius: 14 }),
      k.pos(x, y),
      k.color(16, 16, 22),
      k.outline(2, k.rgb(color[0], color[1], color[2])),
      k.area(),
      { sectionId, label },
      "zone",
    ]);

    // inner icon box
    k.add([
      k.rect(76, 76, { radius: 12 }),
      k.pos(x + 28, y + 24),
      k.color(color[0], color[1], color[2]),
      k.opacity(0.9),
    ]);

    k.add([
      k.text(icon, { size: 34 }),
      k.pos(x + 66, y + 63),
      k.anchor("center"),
      k.color(10, 10, 12),
    ]);

    k.add([
      k.text(label, { size: 17 }),
      k.pos(x + 66, y + 122),
      k.anchor("center"),
      k.color(255, 255, 255),
    ]);
  }

  createPortal(100, 210, "About", "about", [255, 95, 110], "A");
  createPortal(310, 210, "Skills", "skills", [95, 255, 165], "S");
  createPortal(520, 210, "Projects", "projects", [255, 215, 95], "P");
  createPortal(730, 210, "Contact", "contact", [170, 105, 255], "C");

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
    k.ellipse(26, 8),
    k.pos(player.pos.x + 17, player.pos.y + 45),
    k.anchor("center"),
    k.color(0, 0, 0),
    k.opacity(0.35),
  ]);

  const promptBox = k.add([
    k.rect(360, 38, { radius: 999 }),
    k.pos(300, 475),
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

    shadow.pos.x = player.pos.x + 17;
    shadow.pos.y = player.pos.y + 45;
  });

  player.onCollide("zone", (zone) => {
    nearbySection = zone.sectionId ?? null;
    nearbyLabel = zone.label ?? "";
    promptBox.opacity = 1;
    promptText.text = `Press E to open ${nearbyLabel}`;
  });

  player.onCollideEnd("zone", () => {
    nearbySection = null;
    nearbyLabel = "";
    promptBox.opacity = 0;
    promptText.text = "";
  });

  k.onKeyPress("e", () => {
    if (nearbySection) onOpenSection(nearbySection);
  });
}