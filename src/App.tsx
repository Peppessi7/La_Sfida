import { useState } from "react";
import { useGameState, initialGameState } from "./lib/storage";
import {
  BallType,
  getConsecutiveCount,
  getArroganceLevel,
  calculateScore,
} from "./lib/gameLogic";
import { GameHeader } from "./components/GameHeader";
import { PlayerPanel } from "./components/PlayerPanel";
import { ChallengeLevel } from "./components/ChallengeLevel";
import { ChallengeHistory } from "./components/ChallengeHistory";
import { PotentialResult } from "./components/PotentialResult";
import { PokerButtons } from "./components/PokerButtons";
import { FinalResult } from "./components/FinalResult";
import { ArroganceToast } from "./components/ArroganceToast";
import { ScoringGuide } from "./components/ScoringGuide";

export default function App() {
  const [gameState, setGameState] = useGameState();
  const [toastArrogance, setToastArrogance] = useState<{
    level: number;
    playerName: string;
  } | null>(null);

  const handleChallenge = (playerIndex: 0 | 1) => {
    if (gameState.challengeLevel >= 9) return;

    const newHistory = [...gameState.challengeHistory, playerIndex];
    const newLevel = gameState.challengeLevel + 1;

    // Check arrogance for toast
    const consecutive = getConsecutiveCount(newHistory, playerIndex);
    const arroganceLevel = getArroganceLevel(consecutive);

    if (arroganceLevel > 0 && consecutive >= 3) {
      setToastArrogance({
        level: arroganceLevel,
        playerName: gameState.players[playerIndex].name,
      });
    }

    setGameState((prev) => ({
      ...prev,
      challengeLevel: newLevel,
      challengeHistory: newHistory,
    }));
  };

  const handleUndo = () => {
    if (gameState.challengeHistory.length === 0) return;

    const newHistory = [...gameState.challengeHistory];
    newHistory.pop();

    setGameState((prev) => ({
      ...prev,
      challengeLevel: Math.max(0, prev.challengeLevel - 1),
      challengeHistory: newHistory,
    }));
  };

  const handleUpdateName = (playerIndex: 0 | 1, newName: string) => {
    setGameState((prev) => {
      const newPlayers = [...prev.players] as typeof prev.players;
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], name: newName };
      return { ...prev, players: newPlayers };
    });
  };

  const handleUpdateEnclaves = (playerIndex: 0 | 1, newEnclaves: number) => {
    setGameState((prev) => {
      const newPlayers = [...prev.players] as typeof prev.players;
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        enclaves: newEnclaves,
      };
      return { ...prev, players: newPlayers };
    });
  };

  const handleUpdateBallType = (playerIndex: 0 | 1, ballType: BallType) => {
    setGameState((prev) => {
      const opponentIndex = playerIndex === 0 ? 1 : 0;
      const newPlayers = [...prev.players] as typeof prev.players;
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        ballType,
      };
      newPlayers[opponentIndex] = {
        ...newPlayers[opponentIndex],
        ballType: ballType === "piene" ? "mezze" : "piene",
      };
      return { ...prev, players: newPlayers };
    });
  };

  const handlePoker = (winnerIndex: 0 | 1) => {
    const result = calculateScore(
      gameState.challengeLevel,
      winnerIndex,
      gameState.players,
      gameState.challengeHistory,
    );

    setGameState((prev) => ({
      ...prev,
      gamePhase: "finished",
      finalResult: {
        winner: winnerIndex,
        scores: result.scores,
        breakdown: result.breakdown,
      },
    }));
  };

  const handleNewGame = () => {
    setGameState((prev) => ({
      ...initialGameState,
      players: [
        { name: prev.players[0].name, enclaves: 0, ballType: null },
        { name: prev.players[1].name, enclaves: 0, ballType: null },
      ],
    }));
  };

  const handleBackToGame = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "playing",
      finalResult: undefined,
    }));
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-md md:max-w-4xl lg:max-w-7xl mx-auto relative pb-20 selection:bg-primary selection:text-primary-foreground">
      <div className="px-4 md:px-6 lg:px-8 flex flex-col gap-6">
        <GameHeader />

        <main className="grid gap-x-6 gap-y-0 md:grid-cols-3 md:items-start lg:gap-x-8">
          <section className="mb-6 md:col-span-1 md:row-start-1 md:mb-0">
            <ChallengeLevel
              level={gameState.challengeLevel}
              canUndo={gameState.challengeHistory.length > 0}
              onUndo={handleUndo}
            />

            <ChallengeHistory
              history={gameState.challengeHistory}
              players={gameState.players}
            />
          </section>

          <section className="mb-4 min-w-0 md:col-span-2 md:row-start-1">
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <PlayerPanel
                playerIndex={0}
                playerState={gameState.players[0]}
                history={gameState.challengeHistory}
                canChallenge={gameState.challengeLevel < 9}
                onChallenge={() => handleChallenge(0)}
                onUpdateName={(name) => handleUpdateName(0, name)}
                onUpdateEnclaves={(enc) => handleUpdateEnclaves(0, enc)}
                onUpdateBallType={(ballType) => handleUpdateBallType(0, ballType)}
              />
              <PlayerPanel
                playerIndex={1}
                playerState={gameState.players[1]}
                history={gameState.challengeHistory}
                canChallenge={gameState.challengeLevel < 9}
                onChallenge={() => handleChallenge(1)}
                onUpdateName={(name) => handleUpdateName(1, name)}
                onUpdateEnclaves={(enc) => handleUpdateEnclaves(1, enc)}
                onUpdateBallType={(ballType) => handleUpdateBallType(1, ballType)}
              />
            </div>

          </section>

          <section className="min-w-0 md:col-span-3 md:row-start-2">
            <PotentialResult
              level={gameState.challengeLevel}
              players={gameState.players}
              history={gameState.challengeHistory}
            />
          </section>

          <section className="min-w-0 md:col-span-3 md:row-start-3">
            <PokerButtons
              players={gameState.players}
              onPoker={handlePoker}
              onRestart={handleNewGame}
            />
          </section>

          <div
            className="my-4 h-px w-full bg-border md:col-span-3 md:row-start-4"
            aria-hidden="true"
          />

          <section className="md:col-span-3 md:row-start-5">
            <ScoringGuide />
          </section>
        </main>
      </div>

      <FinalResult
        result={gameState.finalResult || null}
        players={gameState.players}
        onNewGame={handleNewGame}
        onBack={handleBackToGame}
      />

      <ArroganceToast
        level={toastArrogance?.level || 0}
        playerName={toastArrogance?.playerName || ""}
        onClose={() => setToastArrogance(null)}
      />
    </div>
  );
}
