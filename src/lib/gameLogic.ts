export interface PlayerState {
  name: string;
  enclaves: number; // 0-2
  ballType: BallType | null;
}

export type BallType = "piene" | "mezze";

export interface FinalResult {
  winner: 0 | 1;
  scores: [number, number]; // score finale giocatore 1 e 2
  breakdown: ScoreBreakdown[];
}

export interface ScoreBreakdown {
  label: string;
  player1: number | null;
  player2: number | null;
}

export interface GameState {
  players: [PlayerState, PlayerState];
  challengeLevel: number; // 0-9
  challengeHistory: number[]; // indici: 0 = player1, 1 = player2
  gamePhase: "playing" | "finished";
  finalResult?: FinalResult;
}

export const MIN_SCORE = -10;
export const MAX_SCORE = 10;

export const SCORE_TABLE: Record<number, { winner: number; loser: number }> = {
  0: { winner: 1, loser: 0 },
  1: { winner: 2, loser: 0 },
  2: { winner: 4, loser: 0 },
  3: { winner: 7, loser: 0 },
  4: { winner: 10, loser: 0 },
  5: { winner: 10, loser: -1 },
  6: { winner: 10, loser: -2 },
  7: { winner: 10, loser: -4 },
  8: { winner: 10, loser: -7 },
  9: { winner: 10, loser: -10 },
};

export function getConsecutiveCount(
  history: number[],
  playerIndex: number,
): number {
  if (history.length === 0) return 0;
  if (history[history.length - 1] !== playerIndex) return 0;

  let count = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] === playerIndex) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

export function getArroganceLevel(consecutiveCount: number): number {
  if (consecutiveCount <= 2) return 0;
  if (consecutiveCount === 3) return 1;
  if (consecutiveCount === 4) return 2;
  return 3;
}

export function getArroganceMalus(arroganceLevel: number): number {
  if (arroganceLevel === 1) return -1;
  if (arroganceLevel === 2) return -2;
  if (arroganceLevel >= 3) return -3;
  return 0;
}

export function calculateScore(
  level: number,
  winnerIndex: 0 | 1,
  playerStates: [PlayerState, PlayerState],
  history: number[],
): { scores: [number, number]; breakdown: ScoreBreakdown[] } {
  const loserIndex = winnerIndex === 0 ? 1 : 0;

  const levelScores = SCORE_TABLE[level] ?? SCORE_TABLE[0];
  const baseScores: [number, number] = [0, 0];
  baseScores[winnerIndex] = levelScores.winner;
  baseScores[loserIndex] = levelScores.loser;

  const breakdown: ScoreBreakdown[] = [];

  breakdown.push({
    label: `Sfida livello ${level}`,
    player1: baseScores[0],
    player2: baseScores[1],
  });

  let scores: [number, number] = [...baseScores];

  // Arrogance of loser
  const loserConsecutive = getConsecutiveCount(history, loserIndex);
  const loserArrogance = getArroganceLevel(loserConsecutive);

  if (loserArrogance > 0) {
    const malus = getArroganceMalus(loserArrogance);
    scores[loserIndex] += malus;

    breakdown.push({
      label: `Arroganza ${["", "I", "II", "III"][loserArrogance]} (malus)`,
      player1: loserIndex === 0 ? malus : null,
      player2: loserIndex === 1 ? malus : null,
    });
  }

  scores[0] = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scores[0]));
  scores[1] = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scores[1]));

  const enclaveEffects: [number, number] = [0, 0];
  const remainingEnclaves: [number, number] = [
    playerStates[0].enclaves,
    playerStates[1].enclaves,
  ];

  // Prima ogni giocatore negativo usa le proprie Enclave per tornare verso 0.
  for (let i = 0; i < 2; i++) {
    const pIndex = i as 0 | 1;
    if (scores[pIndex] < 0) {
      const used = Math.min(remainingEnclaves[pIndex], -scores[pIndex]);
      scores[pIndex] += used;
      enclaveEffects[pIndex] += used;
      remainingEnclaves[pIndex] -= used;
    }
  }

  // Le Enclave residue di un giocatore non negativo riducono solo un
  // punteggio avversario positivo, senza mai portarlo sotto 0.
  for (let i = 0; i < 2; i++) {
    const pIndex = i as 0 | 1;
    const opponentIndex = pIndex === 0 ? 1 : 0;
    if (
      scores[pIndex] >= 0 &&
      scores[opponentIndex] > 0 &&
      remainingEnclaves[pIndex] > 0
    ) {
      const used = Math.min(
        remainingEnclaves[pIndex],
        scores[opponentIndex],
      );
      scores[opponentIndex] -= used;
      enclaveEffects[opponentIndex] -= used;
      remainingEnclaves[pIndex] -= used;
    }
  }

  if (enclaveEffects.some((effect) => effect !== 0)) {
    breakdown.push({
      label: "Enclave",
      player1: enclaveEffects[0] !== 0 ? enclaveEffects[0] : null,
      player2: enclaveEffects[1] !== 0 ? enclaveEffects[1] : null,
    });
  }

  scores[0] = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scores[0]));
  scores[1] = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scores[1]));

  return { scores, breakdown };
}
