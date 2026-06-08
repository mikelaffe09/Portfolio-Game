import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import { createMainScene } from "../game/scenes/MainScene";

type Props = {
  onOpenSection: (sectionId: string) => void;
};

export default function GameCanvas({ onOpenSection }: Props) {
  const gameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    gameRef.current.innerHTML = "";

    const k = kaboom({
      width: 960,
      height: 540,
      background: [9, 9, 11],
      global: false,
      scale: 1,
      root: gameRef.current,
    });

    createMainScene(k, onOpenSection);

    return () => {
      k.quit();
    };
  }, [onOpenSection]);

  return <div ref={gameRef} className="game-canvas" />;
}