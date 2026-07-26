import React from "react";
import { cn } from "./cn";

/**
 * El wrapper scrollea en horizontal en vez de dejar que la tabla ensanche la
 * página. En móvil una tabla de 5 columnas no entra de ninguna manera.
 */
export function Table({ className = "", children }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)}>{children}</table>
    </div>
  );
}

export function THead({ className = "", children }) {
  return (
    <thead className={cn("border-b border-plum-100 dark:border-plum-800", className)}>
      {children}
    </thead>
  );
}

export function TBody({ className = "", children }) {
  return (
    <tbody className={cn("divide-y divide-plum-100 dark:divide-plum-800", className)}>
      {children}
    </tbody>
  );
}

export function TR({ className = "", children, ...props }) {
  return (
    <tr
      className={cn("transition-colors hover:bg-plum-50/60 dark:hover:bg-plum-800/40", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TH({ className = "", children, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider",
        "text-plum-500 dark:text-plum-300/80",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TD({ className = "", children, ...props }) {
  return (
    <td className={cn("px-4 py-3 text-plum-800 dark:text-plum-100", className)} {...props}>
      {children}
    </td>
  );
}

/** Fila de estado para tablas vacías o cargando. */
export function TEmpty({ colSpan, children }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-plum-500 dark:text-plum-300/70"
      >
        {children}
      </td>
    </tr>
  );
}
