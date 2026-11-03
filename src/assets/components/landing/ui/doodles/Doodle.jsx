import React, { useId } from "react";
import styles from "./Doodle.module.css";

/**
 * Trazos "a mano" del landing: subrayados, círculos, estrellitas, flechas,
 * notas. Paths SVG irregulares a propósito (curvas que no cierran perfecto,
 * puntas de flecha con dos trazos sueltos) más un `feTurbulence` leve que les
 * tiembla el borde — marcador sobre papel, no un ícono. Todo es decorativo:
 * `aria-hidden` y `pointer-events: none` (ver Doodle.module.css).
 *
 * El color sale de `currentColor`: cada sección lo fija con su propia clase
 * (tinta oscura sobre "Sobre mí", clara sobre el resto). La animación de
 * dibujo vive aparte, en useDoodles.js, y lee `data-doodle-order` para saber
 * en qué orden dibujar.
 *
 * `stretch`: el viewBox se deforma para llenar la caja (subrayados, círculos
 * alrededor de un texto de ancho variable) — `non-scaling-stroke` evita que el
 * trazo engorde en los costados.
 */
const SHAPES = {
  underlineDouble: {
    viewBox: "0 0 300 24",
    stretch: true,
    paths: ["M3 15 C 48 6, 102 19, 152 11 S 238 4, 296 13 M 40 20 C 100 15, 170 22, 252 17"],
  },
  underlineWave: {
    viewBox: "0 0 300 24",
    stretch: true,
    paths: ["M3 14 C 28 4, 52 22, 78 12 S 128 4, 152 13 S 202 22, 228 11 S 276 6, 297 14"],
  },
  underlineZigzag: {
    viewBox: "0 0 300 24",
    stretch: true,
    paths: ["M3 16 L 24 7 L 44 17 L 66 6 L 87 17 L 109 7 L 130 18 L 152 7 L 173 17 L 195 6 L 216 17 L 238 7 L 259 17 L 280 8 L 297 15"],
  },
  circle: {
    viewBox: "0 0 200 100",
    stretch: true,
    paths: ["M34 16 C 84 0, 172 6, 191 40 C 206 76, 120 99, 60 93 C 14 88, 0 60, 11 38 C 20 20, 48 10, 78 9"],
  },
  star: {
    viewBox: "0 0 40 40",
    paths: ["M20 3 L 24.5 15 L 37 15.5 L 27 23.5 L 31 36.5 L 20 28.5 L 9.5 36 L 13 23.5 L 3 15.8 L 15.6 15 Z"],
  },
  sparkle: {
    viewBox: "0 0 40 40",
    paths: ["M20 2 C 21 14, 26 19, 38 20 C 26 21, 21 26, 20 38 C 19 26, 14 21, 2 20 C 14 19, 19 14, 20 2"],
  },
  rays: {
    viewBox: "0 0 40 40",
    paths: ["M5 31 L 14 23", "M17 11 L 19 2", "M26 19 L 37 15"],
  },
  spiral: {
    viewBox: "0 0 60 60",
    paths: ["M30 30 C 30 26, 36 26, 36 30 C 36 36, 26 37, 24 30 C 22 22, 34 18, 40 24 C 47 31, 42 44, 30 45 C 18 46, 11 34, 15 23 C 19 13, 32 9, 42 13"],
  },
  check: {
    viewBox: "0 0 40 40",
    paths: ["M5 22 C 9 25, 12 29, 15 32 C 21 22, 28 12, 36 5"],
  },
  arrowCurve: {
    viewBox: "0 0 200 120",
    paths: ["M8 94 C 34 52, 70 26, 112 34 C 146 41, 158 64, 186 40", "M186 40 L 168 41 M 186 40 L 181 57"],
  },
  arrowLoop: {
    viewBox: "0 0 160 120",
    paths: [
      "M10 22 C 58 10, 100 30, 82 60 C 68 82, 42 66, 58 50 C 78 32, 118 58, 140 100",
      "M140 100 L 123 97 M 140 100 L 142 83",
    ],
  },
  arrowDown: {
    viewBox: "0 0 60 120",
    paths: ["M30 6 C 18 30, 42 52, 28 76 C 22 88, 28 100, 30 112", "M30 112 L 20 98 M 30 112 L 40 99"],
  },
  bracket: {
    viewBox: "0 0 30 200",
    stretch: true,
    paths: ["M4 4 C 18 4, 14 40, 14 80 C 14 92, 18 98, 26 100 C 18 102, 14 108, 14 120 C 14 160, 18 196, 4 196"],
  },
};

export function Doodle({ shape, order = 0, className }) {
  const filterId = `doodle-rough-${useId().replace(/:/g, "")}`;
  const def = SHAPES[shape];
  if (!def) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={def.viewBox}
      preserveAspectRatio={def.stretch ? "none" : "xMidYMid meet"}
      className={[styles.doodle, def.stretch && styles.stretch, className].filter(Boolean).join(" ")}
    >
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {def.paths.map((d, index) => (
          <path key={index} data-doodle-order={order} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Nota corta "escrita al costado" de un trazo; aparece cuando le toca su `order`. */
export function DoodleNote({ order = 0, className, children }) {
  return (
    <span
      aria-hidden="true"
      data-doodle-order={order}
      data-doodle-note
      className={[styles.note, className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}
