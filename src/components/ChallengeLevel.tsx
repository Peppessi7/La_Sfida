import { RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeLevelProps {
  level: number;
  canUndo: boolean;
  onUndo: () => void;
}

export function ChallengeLevel({
  level,
  canUndo,
  onUndo,
}: ChallengeLevelProps) {
  const isDanger = level >= 5;

  return (
    <div className="relative flex flex-col items-center justify-center py-3">
      <h2 className="mb-2 text-sm font-medium tracking-[0.2em] text-muted-foreground">
        LIVELLO DI SFIDA
      </h2>

      <div className="relative flex h-[104px] w-28 items-center justify-center">
        {/* Glow effect for danger zone */}
        <AnimatePresence>
          {isDanger && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full"
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={level}
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`font-serif text-[100px] leading-none font-bold tabular-nums
                ${isDanger ? "text-destructive drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-primary drop-shadow-md"}`}
            >
              {level}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`mt-5 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${
            canUndo
              ? "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <RotateCcw className="w-4 h-4" />
        Annulla Sfida
      </button>
    </div>
  );
}
