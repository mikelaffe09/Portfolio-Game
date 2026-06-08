import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import { createMainScene } from "../game/scenes/MainScene";
import type { StationId } from "../data/portfolioData";

type Props = {
  onOpenSection: (sectionId: StationId) => void;
  completedIds: StationId[];
  unlockedIds: StationId[];
};

export default function GameCanvas({
  onOpenSection,
  completedIds,
  unlockedIds,
}: Props) {
  const gameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    gameRef.current.innerHTML = "";

    const k = kaboom({
      width: 960,
      height: 540,
      background: [7, 7, 10],
      global: false,
      scale: 1,
      root: gameRef.current,
    });

    createMainScene(k, {
      onOpenSection,
      completedIds,
      unlockedIds,
    });

    return () => {
      k.quit();
    };
  }, [onOpenSection, completedIds, unlockedIds]);

  return <div ref={gameRef} className="game-canvas" />;
}