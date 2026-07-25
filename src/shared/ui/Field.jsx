import React from "react";
import { cn } from "./cn";

const CONTROL = cn(
  "w-full rounded-xl border bg-white px-3 py-2 text-sm transition-colors",
  "border-plum-200 text-plum-900 placeholder:text-plum-400",
  "dark:border-plum-700 dark:bg-plum-900 dark:text-plum-50 dark:placeholder:text-plum-400/60",
  "focus:outline-none focus:ring-2 focus:ring-volt-500 focus:border-transparent",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

/**
 * Envuelve un control con su label, hint y error, y se encarga de conectarlos
 * por id para que el lector de pantalla los anuncie juntos.
 *
 * Los hijos reciben `id`, `aria-describedby` y `aria-invalid` ya resueltos, así
 * que se usa como `<Field label="Título"><Input name="title" /></Field>`.
 */
export function Field({ label, hint, error, required, children, className = "" }) {
  const id = React.useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: children.props.id || id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required: children.props.required ?? required,
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-plum-800 dark:text-plum-100"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-plum-500 dark:text-plum-300/70">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = React.forwardRef(function Input(
  { className = "", ...props },
  ref
) {
  return <input ref={ref} className={cn(CONTROL, "h-10", className)} {...props} />;
});

export const Textarea = React.forwardRef(function Textarea(
  { rows = 4, className = "", ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(CONTROL, "resize-y", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef(function Select(
  { options = [], placeholder, className = "", children, ...props },
  ref
) {
  return (
    <select ref={ref} className={cn(CONTROL, "h-10 pr-8", className)} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {children ||
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
  );
});

/**
 * Checkbox con su propio label. No usa Field porque el label va al costado y
 * no arriba, y porque el patrón se repite mucho en listas de opciones.
 */
export const Checkbox = React.forwardRef(function Checkbox(
  { label, className = "", ...props },
  ref
) {
  const id = React.useId();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        ref={ref}
        type="checkbox"
        id={props.id || id}
        className={cn(
          "h-4 w-4 shrink-0 rounded border-plum-300 text-plum-500 accent-plum-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-500",
          "dark:border-plum-600"
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id || id}
          className="cursor-pointer select-none text-sm text-plum-800 dark:text-plum-100"
        >
          {label}
        </label>
      )}
    </div>
  );
});
