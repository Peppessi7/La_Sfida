import { PlayerState } from "../lib/gameLogic";

interface PokerButtonsProps {
  players: [PlayerState, PlayerState];
  onPoker: (winnerIndex: 0 | 1) => void;
}

export function PokerButtons({ players, onPoker }: PokerButtonsProps) {
  return (
    <div className="flex w-full flex-row gap-2 sm:gap-4">
      <button
        type="button"
        onClick={() => onPoker(0)}
        className="poker-button flex h-16 min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-[hsl(var(--p1-color))] px-2 text-lg font-bold leading-tight tracking-wider text-black shadow-lg transition-all active:scale-95 sm:h-20 sm:text-xl"
      >
        <span>POKER</span>
        <span className="max-w-full truncate text-sm font-medium opacity-80">
          {players[0].name}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onPoker(1)}
        className="poker-button flex h-16 min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-[hsl(var(--p2-color))] px-2 text-lg font-bold leading-tight tracking-wider text-black shadow-lg transition-all active:scale-95 sm:h-20 sm:text-xl"
      >
        <span>POKER</span>
        <span className="max-w-full truncate text-sm font-medium opacity-80">
          {players[1].name}
        </span>
      </button>
    </div>
  );
}
