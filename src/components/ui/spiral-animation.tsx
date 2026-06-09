'use client';

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type SpiralAnimationProps = {
  className?: string;
  reducedMotion?: boolean;
};

class Vector2D {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Vector3D {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function createSeededRandom(seed = 1234) {
  let nextSeed = seed;

  return () => {
    nextSeed = (nextSeed * 9301 + 49297) % 233280;
    return nextSeed / 233280;
  };
}

function randomBetween(random: () => number, min: number, max: number) {
  return min + random() * (max - min);
}

class AnimationController {
  private timeline: gsap.core.Timeline | null = null;
  private time = 0;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;
  private readonly reducedMotion: boolean;
  private readonly stars: Star[] = [];
  private readonly changeEventTime = 0.32;
  private readonly cameraZ = -400;
  private readonly cameraTravelDistance = 3400;
  private readonly startDotYOffset = 28;
  private readonly viewZoom = 100;
  private readonly numberOfStars: number;
  private readonly trailLength: number;

  public constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    reducedMotion: boolean
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.reducedMotion = reducedMotion;
    this.numberOfStars = reducedMotion
      ? 320
      : Math.min(2400, Math.max(900, Math.floor((width * height) / 260)));
    this.trailLength = reducedMotion ? 28 : 80;

    this.createStars();

    if (reducedMotion) {
      this.time = 0.58;
      this.render();
      return;
    }

    this.setupTimeline();
  }

  public getCameraZ() {
    return this.cameraZ;
  }

  public getViewZoom() {
    return this.viewZoom;
  }

  private createStars() {
    const random = createSeededRandom();

    for (let i = 0; i < this.numberOfStars; i += 1) {
      this.stars.push(
        new Star(this.cameraZ, this.cameraTravelDistance, random)
      );
    }
  }

  private setupTimeline() {
    this.timeline = gsap.timeline({ repeat: -1 });
    this.timeline.to(this, {
      time: 1,
      duration: 15,
      ease: "none",
      onUpdate: () => this.render(),
    });
  }

  public ease(p: number, g: number) {
    if (p < 0.5) {
      return 0.5 * Math.pow(2 * p, g);
    }

    return 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  public easeOutElastic(x: number) {
    const c4 = (2 * Math.PI) / 4.5;

    if (x <= 0) return 0;
    if (x >= 1) return 1;

    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  public map(
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
  ) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  public constrain(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  public lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t;
  }

  public spiralPath(p: number) {
    const easedP = this.ease(this.constrain(1.2 * p, 0, 1), 1.8);
    const numberOfSpiralTurns = 6;
    const theta = 2 * Math.PI * numberOfSpiralTurns * Math.sqrt(easedP);
    const radius = 170 * Math.sqrt(easedP);

    return new Vector2D(
      radius * Math.cos(theta),
      radius * Math.sin(theta) + this.startDotYOffset
    );
  }

  public rotate(
    v1: Vector2D,
    v2: Vector2D,
    p: number,
    orientation: boolean
  ) {
    const middle = new Vector2D((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
    const dx = v1.x - middle.x;
    const dy = v1.y - middle.y;
    const angle = Math.atan2(dy, dx);
    const orientationMultiplier = orientation ? -1 : 1;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p);

    return new Vector2D(
      middle.x +
        radius *
          (1 + bounce) *
          Math.cos(angle + orientationMultiplier * Math.PI * this.easeOutElastic(p)),
      middle.y +
        radius *
          (1 + bounce) *
          Math.sin(angle + orientationMultiplier * Math.PI * this.easeOutElastic(p))
    );
  }

  public showProjectedDot(position: Vector3D, sizeFactor: number) {
    const t2 = this.constrain(
      this.map(this.time, this.changeEventTime, 1, 0, 1),
      0,
      1
    );
    const newCameraZ =
      this.cameraZ +
      this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;

    if (position.z <= newCameraZ) return;

    const dotDepthFromCamera = position.z - newCameraZ;
    const x = (this.viewZoom * position.x) / dotDepthFromCamera;
    const y = (this.viewZoom * position.y) / dotDepthFromCamera;
    const radius = this.constrain((360 * sizeFactor) / dotDepthFromCamera, 0.35, 5);

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawStartDot() {
    if (this.time <= this.changeEventTime) return;

    const dy = (this.cameraZ * this.startDotYOffset) / this.viewZoom;
    const position = new Vector3D(0, dy, this.cameraTravelDistance);
    this.showProjectedDot(position, 3);
  }

  public render() {
    const ctx = this.ctx;
    const sceneScale = Math.min(this.width, this.height) / 430;
    const gradient = ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.5,
      12,
      this.width * 0.5,
      this.height * 0.5,
      Math.max(this.width, this.height) * 0.68
    );

    gradient.addColorStop(0, "rgba(45, 212, 191, 0.2)");
    gradient.addColorStop(0.42, "rgba(7, 16, 29, 0.98)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(sceneScale, sceneScale);

    const t1 = this.constrain(
      this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1),
      0,
      1
    );
    const t2 = this.constrain(
      this.map(this.time, this.changeEventTime, 1, 0, 1),
      0,
      1
    );

    ctx.rotate(-Math.PI * this.ease(t2, 2.7));
    this.drawTrail(t1);

    ctx.fillStyle = "rgba(238, 246, 255, 0.9)";
    for (const star of this.stars) {
      star.render(t1, this);
    }

    ctx.fillStyle = "rgba(248, 197, 55, 0.95)";
    this.drawStartDot();

    ctx.restore();
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i += 1) {
      const falloff = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const strokeWidth =
        (1.3 * (1 - t1) + 3 * Math.sin(Math.PI * t1)) * falloff;
      const pathTime = t1 - 0.00015 * i;
      const position = this.spiralPath(pathTime);
      const offset = new Vector2D(position.x + 5, position.y + 5);
      const rotated = this.rotate(
        position,
        offset,
        Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5,
        i % 2 === 0
      );

      this.ctx.fillStyle =
        i % 3 === 0 ? "rgba(45, 212, 191, 0.95)" : "rgba(255, 255, 255, 0.92)";
      this.ctx.beginPath();
      this.ctx.arc(rotated.x, rotated.y, Math.max(strokeWidth / 2, 0.3), 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  public pause() {
    this.timeline?.pause();
  }

  public resume() {
    if (!this.reducedMotion) {
      this.timeline?.play();
    }
  }

  public destroy() {
    this.timeline?.kill();
    this.timeline = null;
  }
}

class Star {
  private readonly dx: number;
  private readonly dy: number;
  private readonly spiralLocation: number;
  private readonly strokeWeightFactor: number;
  private readonly z: number;
  private readonly angle: number;
  private readonly distance: number;
  private readonly rotationDirection: number;
  private readonly expansionRate: number;
  private readonly finalScale: number;

  public constructor(
    cameraZ: number,
    cameraTravelDistance: number,
    random: () => number
  ) {
    this.angle = random() * Math.PI * 2;
    this.distance = 30 * random() + 15;
    this.rotationDirection = random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + random() * 0.8;
    this.finalScale = 0.7 + random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - random(), 3)) / 1.3;
    this.strokeWeightFactor = Math.pow(random(), 2);

    const initialZ = randomBetween(
      random,
      0.5 * cameraZ,
      cameraTravelDistance + cameraZ
    );

    this.z =
      initialZ * (1 - 0.3 * this.spiralLocation) +
      (cameraTravelDistance / 2) * (0.3 * this.spiralLocation);
  }

  public render(p: number, controller: AnimationController) {
    const spiralPos = controller.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;

    if (q <= 0) return;

    const displacementProgress = controller.constrain(4 * q, 0, 1);
    const linearEasing = displacementProgress;
    const elasticEasing = controller.easeOutElastic(displacementProgress);
    const powerEasing = Math.pow(displacementProgress, 2);
    let easing: number;

    if (displacementProgress < 0.3) {
      easing = controller.lerp(linearEasing, powerEasing, displacementProgress / 0.3);
    } else if (displacementProgress < 0.7) {
      const t = (displacementProgress - 0.3) / 0.4;
      easing = controller.lerp(powerEasing, elasticEasing, t);
    } else {
      easing = elasticEasing;
    }

    let screenX: number;
    let screenY: number;

    if (displacementProgress < 0.3) {
      screenX = controller.lerp(
        spiralPos.x,
        spiralPos.x + this.dx * 0.3,
        easing / 0.3
      );
      screenY = controller.lerp(
        spiralPos.y,
        spiralPos.y + this.dy * 0.3,
        easing / 0.3
      );
    } else if (displacementProgress < 0.7) {
      const midProgress = (displacementProgress - 0.3) / 0.4;
      const curveStrength =
        Math.sin(midProgress * Math.PI) * this.rotationDirection * 1.5;
      const baseX = spiralPos.x + this.dx * 0.3;
      const baseY = spiralPos.y + this.dy * 0.3;
      const targetX = spiralPos.x + this.dx * 0.7;
      const targetY = spiralPos.y + this.dy * 0.7;
      const perpX = -this.dy * 0.4 * curveStrength;
      const perpY = this.dx * 0.4 * curveStrength;

      screenX = controller.lerp(baseX, targetX, midProgress) + perpX * midProgress;
      screenY = controller.lerp(baseY, targetY, midProgress) + perpY * midProgress;
    } else {
      const finalProgress = (displacementProgress - 0.7) / 0.3;
      const baseX = spiralPos.x + this.dx * 0.7;
      const baseY = spiralPos.y + this.dy * 0.7;
      const targetDistance = this.distance * this.expansionRate * 1.5;
      const spiralTurns = 1.2 * this.rotationDirection;
      const spiralAngle = this.angle + spiralTurns * finalProgress * Math.PI;
      const targetX = spiralPos.x + targetDistance * Math.cos(spiralAngle);
      const targetY = spiralPos.y + targetDistance * Math.sin(spiralAngle);

      screenX = controller.lerp(baseX, targetX, finalProgress);
      screenY = controller.lerp(baseY, targetY, finalProgress);
    }

    const vx =
      ((this.z - controller.getCameraZ()) * screenX) / controller.getViewZoom();
    const vy =
      ((this.z - controller.getCameraZ()) * screenY) / controller.getViewZoom();
    const position = new Vector3D(vx, vy, this.z);
    const sizeMultiplier =
      displacementProgress < 0.6
        ? 1 + displacementProgress * 0.2
        : this.getFinalSizeMultiplier(displacementProgress);

    controller.showProjectedDot(
      position,
      8.5 * this.strokeWeightFactor * sizeMultiplier
    );
  }

  private getFinalSizeMultiplier(displacementProgress: number) {
    const t = (displacementProgress - 0.6) / 0.4;

    return 1.2 * (1 - t) + this.finalScale * t;
  }
}

export function SpiralAnimation({
  className,
  reducedMotion,
}: SpiralAnimationProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<AnimationController | null>(null);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const shouldReduceMotion = reducedMotion ?? systemReducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setSystemReducedMotion(query.matches);

    handleChange();
    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;

    if (!host || !canvas) return;

    let resizeFrame = 0;

    const destroyController = () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };

    const setupCanvas = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      destroyController();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      controllerRef.current = new AnimationController(
        ctx,
        width,
        height,
        shouldReduceMotion
      );
    };

    const scheduleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(setupCanvas);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        controllerRef.current?.pause();
        return;
      }

      controllerRef.current?.resume();
    };

    setupCanvas();

    const observer = new ResizeObserver(scheduleResize);
    observer.observe(host);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.cancelAnimationFrame(resizeFrame);
      destroyController();
    };
  }, [shouldReduceMotion]);

  return (
    <div
      ref={hostRef}
      className={`spiral-animation-root ${className ?? ""}`.trim()}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="spiral-animation-canvas"
        role="presentation"
      />
    </div>
  );
}
