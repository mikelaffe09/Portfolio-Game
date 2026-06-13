import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import { createMainScene } from "../game/scenes/MainScene";
import type { StationId } from "../data/portfolioData";
import { worldSize } from "../game/config/worldConfig";

type PlayerPosition = {
  x: number;
  y: number;
};

type Props = {
  onOpenSection: (sectionId: StationId) => void;
  onLockedSection: (sectionId: StationId) => void;
  onCollectOrb: (orbId: string) => void;
  completedIds: StationId[];
  unlockedIds: StationId[];
  collectedOrbIds: string[];
  reducedMotion: boolean;
};

export default function GameCanvas({
  onOpenSection,
  onLockedSection,
  onCollectOrb,
  completedIds,
  unlockedIds,
  collectedOrbIds,
  reducedMotion,
}: Props) {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const collectedOrbIdsRef = useRef(collectedOrbIds);
  const playerPositionRef = useRef<PlayerPosition | null>(null);

  useEffect(() => {
    collectedOrbIdsRef.current = collectedOrbIds;
  }, [collectedOrbIds]);

  useEffect(() => {
    if (!gameRef.current) return;

    gameRef.current.innerHTML = "";

    const k = kaboom({
      width: worldSize.width,
      height: worldSize.height,
      background: [4, 7, 12],
      global: false,
      scale: 1,
      root: gameRef.current,
    });

    const cleanupScene = createMainScene(k, {
      onOpenSection,
      onLockedSection,
      onCollectOrb,
      completedIds,
      unlockedIds,
      collectedOrbIds: collectedOrbIdsRef.current,
      reducedMotion,
      initialPlayerPosition: playerPositionRef.current,
      onPlayerPositionChange: (position) => {
        playerPositionRef.current = position;
      },
    });

    return () => {
      cleanupScene();
      k.quit();
    };
  }, [
    onCollectOrb,
    onLockedSection,
    onOpenSection,
    completedIds,
    reducedMotion,
    unlockedIds,
  ]);

  return <div ref={gameRef} className="game-canvas" />;
}
