import { ScoreBreakdown } from "../lib/gameLogic";

interface ScoreBreakdownListProps {
  breakdown: ScoreBreakdown[];
  playerNames?: [string, string];
  compact?: boolean;
}

export function ScoreBreakdownList({
  breakdown,
  playerNames,
  compact = false,
}: ScoreBreakdownListProps) {
  const resolvedPlayerNames = playerNames ?? ["Giocatore 1", "Giocatore 2"];
  const formatScore = (score: number | null) => {
    if (score === null) return "-";
    return score > 0 ? `+${score}` : score.toString();
  };

  return (
    <div
      className={`w-full rounded-lg border border-border bg-background ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <h4
        className={`border-b border-border pb-2 font-semibold uppercase tracking-wider text-muted-foreground ${
          compact ? "mb-3 text-xs" : "mb-3 text-sm"
        }`}
      >
        Dettaglio Punteggio
      </h4>
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-end gap-x-3 border-b border-border/60 pb-2">
        <span />
        <span className="min-w-0 break-words text-right text-[10px] font-semibold leading-tight text-muted-foreground">
          {resolvedPlayerNames[0]}
        </span>
        <span className="min-w-0 break-words text-right text-[10px] font-semibold leading-tight text-muted-foreground">
          {resolvedPlayerNames[1]}
        </span>
      </div>
      <div className="flex flex-col gap-2.5 pt-2">
        {breakdown.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className={`grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            <span className="min-w-0 flex-1 break-words text-left text-muted-foreground">
              {item.label}
            </span>
            <span
              className={`text-right font-mono font-semibold ${
                item.player1
                  ? item.player1 > 0
                    ? "text-primary"
                    : "text-destructive"
                  : "text-muted-foreground/30"
              }`}
            >
              {formatScore(item.player1)}
            </span>
            <span
              className={`text-right font-mono font-semibold ${
                item.player2
                  ? item.player2 > 0
                    ? "text-primary"
                    : "text-destructive"
                  : "text-muted-foreground/30"
              }`}
            >
              {formatScore(item.player2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}