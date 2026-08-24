import { Plus, Minus, Flame } from "lucide-react";
import {
  BallType,
  PlayerState,
  getConsecutiveCount,
  getArroganceLevel,
} from "../lib/gameLogic";
import { useState, useRef, useEffect } from "react";

interface PlayerPanelProps {
  playerIndex: 0 | 1;
  playerState: PlayerState;
  history: number[];
  canChallenge: boolean;
  onChallenge: () => void;
  onUpdateName: (newName: string) => void;
  onUpdateEnclaves: (newEnclaves: number) => void;
  onUpdateBallType: (ballType: BallType) => void;
}

export function PlayerPanel({
  playerIndex,
  playerState,
  history,
  canChallenge,
  onChallenge,
  onUpdateName,
  onUpdateEnclaves,
  onUpdateBallType,
}: PlayerPanelProps) {
  const isP1 = playerIndex === 0;
  const colorClass = isP1
    ? "text-[hsl(var(--p1-color))]"
    : "text-[hsl(var(--p2-color))]";
  const bgClass = isP1
    ? "bg-[hsl(var(--p1-color))] text-black"
    : "bg-[hsl(var(--p2-color))] text-black";
  const borderClass = isP1
    ? "border-[hsl(var(--p1-color))/0.3]"
    : "border-[hsl(var(--p2-color))/0.3]";

  const totalChallenges = history.filter((h) => h === playerIndex).length;
  const consecutiveCount = getConsecutiveCount(history, playerIndex);
  const arroganceLevel = getArroganceLevel(consecutiveCount);
  const selectedBallType = playerState.ballType ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playerState.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleNameSubmit = () => {
    if (editName.trim()) {
      onUpdateName(editName.trim());
    } else {
      setEditName(playerState.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNameSubmit();
    if (e.key === "Escape") {
      setEditName(playerState.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 rounded-xl border p-4 ${borderClass} bg-card shadow-sm lg:gap-x-4`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-3 w-3 shrink-0 rounded-full ${bgClass}`} />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="w-full max-w-32 rounded border border-border bg-background px-2 py-1 text-base font-medium focus:outline-none focus:ring-1 focus:ring-primary lg:text-lg"
          />
        ) : (
          <button
            type="button"
            className="break-words text-left text-sm font-medium leading-tight transition-colors hover:text-primary lg:text-lg"
            onClick={() => setIsEditing(true)}
            aria-label={`Modifica il nome ${playerState.name}`}
          >
            {playerState.name}
          </button>
        )}
      </div>

      <span className="justify-self-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Biglie
      </span>

      <div className="flex min-w-0 min-h-7 items-center">
        {arroganceLevel > 0 && (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-1 rounded-md bg-destructive/20 px-2 py-1 text-[10px] font-bold leading-tight tracking-wide text-destructive">
            <Flame className="h-3 w-3 shrink-0" />
            <span className="min-w-0 break-words">
              ARROGANZA {["", "I", "II", "III"][arroganceLevel]}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-self-center rounded-lg border border-border bg-background p-0.5">
        {(["piene", "mezze"] as BallType[]).map((ballType) => {
          const isSelected = selectedBallType === ballType;
          const isDimmed =
            selectedBallType !== null && !isSelected;

          return (
            <button
              key={ballType}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${ballType === "piene" ? "Piene" : "Mezze"} per ${playerState.name}`}
              onClick={() => onUpdateBallType(ballType)}
              className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                isSelected
                  ? `${bgClass} shadow-sm`
                  : isDimmed
                    ? "bg-muted/30 text-muted-foreground/40 opacity-40 grayscale"
                    : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {ballType}
            </button>
          );
        })}
      </div>

      <div className="col-span-2 h-3" aria-hidden="true" />

      <div className="text-sm text-muted-foreground">
        Sfide:{" "}
        <span className="font-semibold text-foreground">
          {totalChallenges}
        </span>
      </div>

      <span className="justify-self-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Enclave
      </span>

      <div className="text-sm text-muted-foreground">
        Serie:{" "}
        <span className="font-semibold text-foreground">
          {consecutiveCount}
        </span>
      </div>

      <div className="flex h-9 justify-self-center rounded-lg border border-border bg-background p-1">
        <button
          type="button"
          aria-label={`Riduci le Enclave di ${playerState.name}`}
          onClick={() =>
            onUpdateEnclaves(Math.max(0, playerState.enclaves - 1))
          }
          disabled={playerState.enclaves === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md p-0 transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-8 items-center justify-center font-serif text-lg font-bold leading-none">
          {playerState.enclaves}
        </div>
        <button
          type="button"
          aria-label={`Aumenta le Enclave di ${playerState.name}`}
          onClick={() =>
            onUpdateEnclaves(Math.min(2, playerState.enclaves + 1))
          }
          disabled={playerState.enclaves === 2}
          className="flex h-7 w-7 items-center justify-center rounded-md p-0 transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onChallenge}
        disabled={!canChallenge}
        className={`col-span-2 mt-2 h-14 rounded-lg text-lg font-bold tracking-wider transition-all
          ${
            canChallenge
              ? "bg-secondary hover:bg-secondary/80 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/5 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
          }`}
      >
        SFIDA
      </button>
    </div>
  );
}
