import React from "react";
import { cn } from "./cn";

// El viewBox va ajustado al trazo más la mitad del grosor de línea que sobresale
// a cada lado, para que el monograma no venga con aire de más y quede
// descentrado respecto del riel de abajo.
//
// El telón de entrada usa los mismos trazos pero con un viewBox propio, porque
// necesita que el centro caiga en el hueco entre las dos letras y este no lo
// hace. Ver Curtain.jsx.
export const GLYPH_VIEW_BOX = "6 10 72 44";

/**
 * Monograma "JM" trazado a mano.
 *
 * `pathLength="100"` normaliza el largo de cada trazo: sin eso habría que medir
 * las curvas con JavaScript para saber qué `stroke-dasharray` ponerle a cada
 * una. Con esto, los dos trazos valen 100 y la animación es la misma para ambos.
 */
export const GLYPH_STROKES = [
  // J: baja recta y engancha con un medio arco hacia la izquierda.
  { d: "M30 14 V40 a10 10 0 0 1 -20 0", delay: "0s" },
  // M: sube, baja al vértice, vuelve a subir y baja.
  { d: "M46 50 V16 L60 34 L74 16 V50", delay: "0.2s" },
];

const SIZES = {
  sm: "h-8",
  md: "h-14",
  lg: "h-20",
};

/**
 * Indicador de carga del portfolio: el monograma se escribe y se borra en bucle
 * sobre un riel con un destello que lo recorre.
 *
 * No hay texto "Cargando" en pantalla a propósito. La palabra no aporta nada que
 * la animación no diga ya, y en cambio hay que traducirla y se ve pobre. El
 * texto existe igual, pero solo para el lector de pantalla.
 */
export function Loader({ label = "Cargando", size = "md", className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-4", className)}
    >
      <svg
        viewBox={GLYPH_VIEW_BOX}
        fill="none"
        aria-hidden="true"
        className={cn("w-auto text-plum-500 dark:text-plum-200", SIZES[size] || SIZES.md)}
      >
        {GLYPH_STROKES.map(({ d, delay }) => (
          <path
            key={d}
            d={d}
            pathLength="100"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-trace-glyph motion-reduce:animate-none"
            style={{ strokeDasharray: 100, animationDelay: delay }}
          />
        ))}
      </svg>

      <span
        aria-hidden="true"
        className="relative block h-[3px] w-24 overflow-hidden rounded-full bg-plum-500/15 dark:bg-plum-200/20"
      >
        <span className="absolute inset-y-0 left-0 w-1/3 animate-slide-track rounded-full bg-plum-500 motion-reduce:animate-pulse motion-reduce:w-full dark:bg-plum-200" />
      </span>

      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * El mismo loader ocupando la pantalla. Para los `Suspense` de las rutas, donde
 * todavía no hay layout que preservar y un skeleton no tendría qué imitar.
 */
export function FullPageLoader({ label, className = "" }) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-noon dark:bg-slate-950",
        className
      )}
    >
      <Loader label={label} size="lg" />
    </div>
  );
}

export default Loader;
