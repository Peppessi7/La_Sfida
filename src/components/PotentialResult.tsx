import { PlayerState, calculateScore } from "../lib/gameLogic";
import { ScoreBreakdownList } from "./ScoreBreakdown";

interface PotentialResultProps {
  level: number;
  players: [PlayerState, PlayerState];
  history: number[];
}

export function PotentialResult({
  level,
  players,
  history,
}: PotentialResultProps) {
  const p1Wins = calculateScore(level, 0, players, history);
  const p2Wins = calculateScore(level, 1, players, history);

  const formatScore = (s: number) => (s > 0 ? `+${s}` : s.toString());

  const ScoreCard = ({
    winnerIdx,
    scores,
  }: {
    winnerIdx: number;
    scores: [number, number];
  }) => {
    const isP1 = winnerIdx === 0;
    const colorClass = isP1
      ? "text-[hsl(var(--p1-color))]"
      : "text-[hsl(var(--p2-color))]";

    return (
      <div className="flex min-w-0 flex-1 flex-col items-center gap-4 rounded-xl border border-border bg-card p-5 text-center">
        <h4 className={`text-base font-semibold ${colorClass}`}>
          Se vince {players[winnerIdx].name}
        </h4>
        <div className="flex w-full justify-between text-xl">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">
              {players[0].name}
            </span>
            <span
              className={`font-mono text-2xl font-bold ${scores[0] > 0 ? "text-primary" : scores[0] < 0 ? "text-destructive" : "text-foreground"}`}
            >
              {formatScore(scores[0])}
            </span>
          </div>
          <div className="mx-3 w-[1px] bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">
              {players[1].name}
            </span>
            <span
              className={`font-mono text-2xl font-bold ${scores[1] > 0 ? "text-primary" : scores[1] < 0 ? "text-destructive" : "text-foreground"}`}
            >
              {formatScore(scores[1])}
            </span>
          </div>
        </div>
        <ScoreBreakdownList
          breakdown={winnerIdx === 0 ? p1Wins.breakdown : p2Wins.breakdown}
          playerNames={[players[0].name, players[1].name]}
          compact
        />
      </div>
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 pb-4">
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-border" />
        <h3 className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase text-center">
          Se il Poker si chiudesse ora
        </h3>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <ScoreCard winnerIdx={0} scores={p1Wins.scores} />
        <ScoreCard winnerIdx={1} scores={p2Wins.scores} />
      </div>
    </div>
  );
}
