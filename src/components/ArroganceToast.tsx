import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { useEffect } from "react";

interface ArroganceToastProps {
  level: number;
  playerName: string;
  onClose: () => void;
}

export function ArroganceToast({
  level,
  playerName,
  onClose,
}: ArroganceToastProps) {
  useEffect(() => {
    if (level > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [level, onClose]);

  const levelNumeral = ["", "I", "II", "III"][level];

  return (
    <AnimatePresence>
      {level > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
        >
          <div className="bg-destructive text-destructive-foreground px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-destructive-foreground/20">
            <Flame className="w-8 h-8 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                {playerName}
              </span>
              <span className="font-serif font-bold text-xl leading-none">
                ARROGANZA {levelNumeral}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
