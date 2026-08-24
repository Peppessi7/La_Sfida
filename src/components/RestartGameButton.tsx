import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

interface RestartGameButtonProps {
  onRestart: () => void;
  label: string;
  className?: string;
  requireConfirmation?: boolean;
}

const defaultClassName =
  "flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted px-4 text-sm font-bold tracking-wide text-foreground transition-colors hover:bg-muted/80";

export function RestartGameButton({
  onRestart,
  label,
  className,
  requireConfirmation = true,
}: RestartGameButtonProps) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;

    const timeout = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [confirming]);

  const handleClick = () => {
    if (!requireConfirmation) {
      onRestart();
      return;
    }

    if (!confirming) {
      setConfirming(true);
      return;
    }

    setConfirming(false);
    onRestart();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className ?? defaultClassName}
      aria-label={
        requireConfirmation && confirming
          ? "Conferma ricomincia partita"
          : label
      }
    >
      <RotateCcw className="h-5 w-5" aria-hidden="true" />
      <span aria-live="polite">
        {requireConfirmation && confirming
          ? "TOCCA ANCORA PER CONFERMARE"
          : label}
      </span>
    </button>
  );
}
