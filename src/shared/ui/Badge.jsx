import React from "react";
import { cn } from "./cn";

const TONES = {
  plum: "bg-plum-100 text-plum-700 dark:bg-plum-800 dark:text-plum-100",
  volt: "bg-volt-500/15 text-volt-700 dark:text-volt-300",
  muted: "bg-plum-50 text-plum-500 dark:bg-plum-900 dark:text-plum-300/70",
  danger: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
};

export function Badge({ tone = "plum", className = "", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Iniciales sobre ciruela. No carga imagen porque el admin es una sola persona. */
export function Avatar({ initials = "?", size = "md", className = "" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm" };
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-plum-500 font-bold text-white",
        sizes[size],
        className
      )}
    >
      {initials}
    </span>
  );
}

export default Badge;
