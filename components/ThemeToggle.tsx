"use client";

import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
      className="group inline-flex h-10 items-center gap-2 border-2 border-indigo bg-ink px-3 font-pixel text-base tracking-[0.25em] text-bone transition-colors hover:bg-indigo hover:text-ink"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{dark ? "light" : "dark"}</span>
    </button>
  );
}
