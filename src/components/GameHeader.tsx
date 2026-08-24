import { AnimatePresence, motion } from "framer-motion";

export function GameHeader() {
  return (
    <header className="w-full flex flex-col items-center justify-center pt-8 pb-4">
      <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-widest text-foreground text-center">
        LA SFIDA
      </h1>
      <div className="w-16 h-[2px] bg-primary mt-4 opacity-80" />
    </header>
  );
}
