import { useState, useEffect } from "react";
import {
  BallType,
  GameState,
} from "./gameLogic";

const STORAGE_KEY = "la-sfida-game-state";

export const initialGameState: GameState = {
  players: [
    { name: "Giocatore 1", enclaves: 0, ballType: null },
    { name: "Giocatore 2", enclaves: 0, ballType: null },
  ],
  challengeLevel: 0,
  challengeHistory: [],
  gamePhase: "playing",
};

function normalizeGameState(value: unknown): GameState {
  if (!value || typeof value !== "object") return initialGameState;

  const stored = value as Partial<GameState>;
  const normalizeBallType = (ballType: unknown): BallType | null =>
    ballType === "piene" || ballType === "mezze" ? ballType : null;
  const normalizePlayer = (index: 0 | 1) => {
    const player = stored.players?.[index];
    return {
      name:
        typeof player?.name === "string" && player.name.trim()
          ? player.name.trim().slice(0, 40)
          : initialGameState.players[index].name,
      enclaves:
        typeof player?.enclaves === "number"
          ? Math.max(0, Math.min(2, Math.trunc(player.enclaves)))
          : 0,
      ballType: normalizeBallType(player?.ballType),
    };
  };

  const players: GameState["players"] = [normalizePlayer(0), normalizePlayer(1)];
  if (players[0].ballType) {
    players[1].ballType = players[0].ballType === "piene" ? "mezze" : "piene";
  } else if (players[1].ballType) {
    players[0].ballType = players[1].ballType === "piene" ? "mezze" : "piene";
  }

  const challengeHistory = Array.isArray(stored.challengeHistory)
    ? stored.challengeHistory
        .filter((entry): entry is 0 | 1 => entry === 0 || entry === 1)
        .slice(0, 9)
    : [];
  const winner = stored.finalResult?.winner;
  const hasValidFinalResult =
    (winner === 0 || winner === 1) &&
    Array.isArray(stored.finalResult?.scores) &&
    stored.finalResult.scores.length === 2 &&
    stored.finalResult.scores.every((score) => Number.isFinite(score)) &&
    Array.isArray(stored.finalResult.breakdown);
  const finalResult = hasValidFinalResult
    ? {
        winner,
        scores: stored.finalResult!.scores.map((score) =>
          Math.max(-10, Math.min(10, Math.trunc(score))),
        ) as [number, number],
        breakdown: stored.finalResult!.breakdown
          .filter(
            (item) =>
              item &&
              typeof item.label === "string" &&
              (item.player1 === null || Number.isFinite(item.player1)) &&
              (item.player2 === null || Number.isFinite(item.player2)),
          )
          .map((item) => ({
            label: item.label.slice(0, 80),
            player1:
              item.player1 === null
                ? null
                : Math.max(-10, Math.min(10, Math.trunc(item.player1))),
            player2:
              item.player2 === null
                ? null
                : Math.max(-10, Math.min(10, Math.trunc(item.player2))),
          })),
      }
    : undefined;

  return {
    players,
    challengeLevel: challengeHistory.length,
    challengeHistory,
    gamePhase:
      stored.gamePhase === "finished" && hasValidFinalResult
        ? "finished"
        : "playing",
    finalResult,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        return normalizeGameState(JSON.parse(item));
      }
    } catch (error) {
      console.warn("Error reading localStorage", error);
    }
    return initialGameState;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  }, [gameState]);

  return [gameState, setGameState] as const;
}
