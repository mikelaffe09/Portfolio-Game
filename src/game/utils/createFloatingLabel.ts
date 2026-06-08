import type { KaboomCtx } from "kaboom";
import type { RgbColor } from "../types";

type FloatingLabelOptions = {
  title: string;
  subtitle: string;
  x: number;
  y: number;
  color: RgbColor;
  reducedMotion: boolean;
};

export function createFloatingLabel(k: KaboomCtx, options: FloatingLabelOptions) {
  const panel = k.add([
    k.rect(168, 42, { radius: 8 }),
    k.pos(options.x, options.y),
    k.anchor("center"),
    k.color(9, 14, 22),
    k.outline(1, k.rgb(options.color[0], options.color[1], options.color[2])),
    k.opacity(0.9),
    k.z(28),
    "ambient",
  ]);

  const title = k.add([
    k.text(options.title.toUpperCase(), { size: 11, width: 150 }),
    k.pos(options.x, options.y - 8),
    k.anchor("center"),
    k.color(245, 250, 255),
    k.z(29),
    "ambient",
  ]);

  const subtitle = k.add([
    k.text(options.subtitle.toUpperCase(), { size: 8, width: 150 }),
    k.pos(options.x, options.y + 10),
    k.anchor("center"),
    k.color(options.color[0], options.color[1], options.color[2]),
    k.z(29),
    "ambient",
  ]);

  if (!options.reducedMotion) {
    const phase = options.x * 0.018;

    k.onUpdate(() => {
      const bob = Math.sin(k.time() * 2 + phase) * 3;
      panel.pos.y = options.y + bob;
      title.pos.y = options.y - 8 + bob;
      subtitle.pos.y = options.y + 10 + bob;
    });
  }

  return {
    panel,
    title,
    subtitle,
  };
}
