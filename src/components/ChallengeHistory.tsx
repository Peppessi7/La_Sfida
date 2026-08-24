import { PlayerState } from "../lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeHistoryProps {
  history: number[];
  players: [PlayerState, PlayerState];
}

export function ChallengeHistory({ history, players }: ChallengeHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="w-full text-center text-sm text-muted-foreground py-4 italic">
        Nessuna sfida registrata
      </div>
    );
  }

  const historyRows = [history.slice(0, 5), history.slice(5, 9)];

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-2 overflow-hidden py-3">
      {historyRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex max-w-full items-center justify-center gap-2"
        >
        <AnimatePresence initial={false}>
          {row.map((playerIndex, idx) => {
            const historyIndex = rowIndex === 0 ? idx : idx + 5;
            const isP1 = playerIndex === 0;
            const bgClass = isP1
              ? "bg-[hsl(var(--p1-color))]"
              : "bg-[hsl(var(--p2-color))]";
            const playerInitial =
              players[playerIndex].name.trim().charAt(0).toUpperCase() || "?";

            return (
              <motion.div
                key={`${historyIndex}-${playerIndex}`}
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="flex shrink-0 items-center gap-2"
              >
                {historyIndex > 0 && (
                  <span className="text-muted-foreground/50 text-xs">→</span>
                )}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-black ${bgClass} shadow-sm`}
                  role="img"
                  aria-label={players[playerIndex].name}
                  title={players[playerIndex].name}
                >
                  {playerInitial}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
