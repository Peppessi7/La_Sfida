import { motion, AnimatePresence } from "framer-motion";
import { FinalResult as FinalResultType, PlayerState } from "../lib/gameLogic";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ScoreBreakdownList } from "./ScoreBreakdown";

interface FinalResultProps {
  result: FinalResultType | null;
  players: [PlayerState, PlayerState];
  onNewGame: () => void;
  onBack: () => void;
}

export function FinalResult({
  result,
  players,
  onNewGame,
  onBack,
}: FinalResultProps) {
  if (!result) return null;

  const winner = players[result.winner];
  const formatScore = (s: number | null) => {
    if (s === null) return "-";
    return s > 0 ? `+${s}` : s.toString();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center"
        >
          <div className="text-6xl mb-4">🎱</div>
          <h2 className="font-serif text-4xl font-bold text-primary mb-2">
            POKER!
          </h2>
          <p className="text-xl text-foreground mb-8">
            Vince <span className="font-bold">{winner.name}</span>
          </p>

          <div className="w-full flex justify-around mb-8">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">
                {players[0].name}
              </span>
              <span
                className={`text-5xl font-serif font-bold ${result.scores[0] > 0 ? "text-[hsl(var(--p1-color))]" : result.scores[0] < 0 ? "text-destructive" : "text-foreground"}`}
              >
                {formatScore(result.scores[0])}
              </span>
            </div>
            <div className="w-[1px] bg-border mx-4" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">
                {players[1].name}
              </span>
              <span
                className={`text-5xl font-serif font-bold ${result.scores[1] > 0 ? "text-[hsl(var(--p2-color))]" : result.scores[1] < 0 ? "text-destructive" : "text-foreground"}`}
              >
                {formatScore(result.scores[1])}
              </span>
            </div>
          </div>

          <div className="mb-8 w-full">
            <ScoreBreakdownList
              breakdown={result.breakdown}
              playerNames={[players[0].name, players[1].name]}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Iniziare una nuova partita?")) {
                onNewGame();
              }
            }}
            className="w-full h-14 bg-primary text-primary-foreground font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            NUOVA PARTITA
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted text-base font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            <ArrowLeft className="h-5 w-5" />
            INDIETRO
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
