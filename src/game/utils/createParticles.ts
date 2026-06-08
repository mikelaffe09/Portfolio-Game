import type { KaboomCtx } from "kaboom";
import type { RgbColor } from "../types";

type SparkBurstOptions = {
  x: number;
  y: number;
  color: RgbColor;
  count?: number;
  reducedMotion: boolean;
};

type RingPulseOptions = {
  x: number;
  y: number;
  color: RgbColor;
  radius?: number;
  reducedMotion: boolean;
};

type DriftOptions = {
  color: RgbColor;
  reducedMotion: boolean;
  width: number;
  height: number;
};

export function createSparkBurst(k: KaboomCtx, options: SparkBurstOptions) {
  const count = options.reducedMotion
    ? Math.min(options.count ?? 8, 4)
    : options.count ?? 14;

  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + k.rand(-0.24, 0.24);
    const speed = k.rand(42, options.reducedMotion ? 90 : 150);
    const direction = k.vec2(Math.cos(angle), Math.sin(angle));
    const particle = k.add([
      k.circle(k.rand(2, 5)),
      k.pos(options.x, options.y),
      k.anchor("center"),
      k.color(options.color[0], options.color[1], options.color[2]),
      k.opacity(0.88),
      k.z(45),
      k.lifespan(options.reducedMotion ? 0.35 : 0.62, { fade: 0.34 }),
      "ambient",
    ]);

    particle.onUpdate(() => {
      particle.move(direction.scale(speed));
    });
  }
}

export function createRingPulse(k: KaboomCtx, options: RingPulseOptions) {
  const pulse = k.add([
    k.circle(options.radius ?? 24),
    k.pos(options.x, options.y),
    k.anchor("center"),
    k.color(options.color[0], options.color[1], options.color[2]),
    k.opacity(options.reducedMotion ? 0.16 : 0.28),
    k.scale(0.55),
    k.z(44),
    k.lifespan(options.reducedMotion ? 0.28 : 0.52, { fade: 0.36 }),
    "ambient",
  ]);

  pulse.onUpdate(() => {
    pulse.scale = pulse.scale.add(k.vec2((options.reducedMotion ? 1.2 : 2.4) * k.dt()));
  });
}

export function createPortalShimmer(k: KaboomCtx, options: RingPulseOptions) {
  if (options.reducedMotion) return;

  const shimmer = k.add([
    k.circle(options.radius ?? 64),
    k.pos(options.x, options.y),
    k.anchor("center"),
    k.color(options.color[0], options.color[1], options.color[2]),
    k.opacity(0.14),
    k.scale(0.85),
    k.z(10),
    k.lifespan(0.86, { fade: 0.58 }),
    "ambient",
  ]);

  shimmer.onUpdate(() => {
    shimmer.scale = shimmer.scale.add(k.vec2(0.92 * k.dt()));
  });
}

export function createAmbientSparks(k: KaboomCtx, options: DriftOptions) {
  const sparkCount = options.reducedMotion ? 18 : 42;

  for (let index = 0; index < sparkCount; index += 1) {
    const spark = k.add([
      k.rect(k.rand(2, 4), k.rand(2, 8), { radius: 999 }),
      k.pos(k.rand(20, options.width - 20), k.rand(80, options.height - 24)),
      k.anchor("center"),
      k.color(options.color[0], options.color[1], options.color[2]),
      k.opacity(k.rand(0.1, 0.38)),
      k.z(2),
      "ambient",
    ]);

    if (options.reducedMotion) continue;

    const drift = k.rand(8, 22);
    const phase = k.rand(0, Math.PI * 2);

    spark.onUpdate(() => {
      spark.pos.y += drift * k.dt();
      spark.pos.x += Math.sin(k.time() * 1.4 + phase) * 7 * k.dt();

      if (spark.pos.y > options.height + 12) {
        spark.pos.y = 74;
        spark.pos.x = k.rand(20, options.width - 20);
      }
    });
  }
}
