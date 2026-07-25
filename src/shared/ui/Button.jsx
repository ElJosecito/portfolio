import React from "react";
import { cn } from "./cn";

const VARIANTS = {
  primary:
    "bg-plum-500 text-white hover:bg-plum-600 active:bg-plum-700 shadow-sm disabled:hover:bg-plum-500",
  secondary:
    "bg-plum-100 text-plum-700 hover:bg-plum-200 dark:bg-plum-800 dark:text-plum-50 dark:hover:bg-plum-700",
  outline:
    "border border-plum-300 text-plum-700 hover:bg-plum-50 dark:border-plum-600 dark:text-plum-100 dark:hover:bg-plum-800",
  ghost:
    "text-plum-700 hover:bg-plum-100 dark:text-plum-100 dark:hover:bg-plum-800",
  danger:
    "border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
};

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9 justify-center",
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

const Button = React.forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    block = false,
    disabled,
    className = "",
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      // Mientras carga sigue siendo un botón deshabilitado de verdad, no solo
      // un estilo: si no, se puede disparar dos veces el submit.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center rounded-xl font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-500 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-noon dark:focus-visible:ring-offset-plum-950",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        block && "w-full justify-center",
        className
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
});

export default Button;
