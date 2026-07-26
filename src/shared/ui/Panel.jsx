import React from "react";
import { cn } from "./cn";

/** Superficie base del admin: la card del portfolio, bajada de saturación. */
export function Panel({ className = "", children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-plum-200/70 bg-white shadow-sm",
        "dark:border-plum-700/60 dark:bg-plum-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({ className = "", children }) {
  return (
    <div className={cn("space-y-1 border-b border-plum-100 p-6 dark:border-plum-800", className)}>
      {children}
    </div>
  );
}

export function PanelTitle({ className = "", children }) {
  return (
    <h2 className={cn("text-xl font-bold tracking-tight text-plum-900 dark:text-plum-50", className)}>
      {children}
    </h2>
  );
}

export function PanelDescription({ className = "", children }) {
  return (
    <p className={cn("text-sm text-plum-500 dark:text-plum-300/80", className)}>
      {children}
    </p>
  );
}

export function PanelBody({ className = "", children }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function PanelFooter({ className = "", children }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-plum-100 p-6 dark:border-plum-800",
        className
      )}
    >
      {children}
    </div>
  );
}
