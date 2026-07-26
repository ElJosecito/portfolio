import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { GLYPH_STROKES } from "../../../shared/ui/Loader";

/**
 * viewBox propio, distinto al del loader, y esta es la única razón:
 *
 * El corte del telón cae en el centro horizontal del SVG. Con el viewBox
 * ajustado del loader ese centro queda en x=42, que es exactamente donde
 * arranca el trazo de la M: el telón parecería estar afeitando la letra.
 *
 * El hueco real entre las dos va de x=34 (donde termina la J) a x=42, así que el
 * corte tiene que caer en 38. Para eso el viewBox se ensancha en vez de
 * correrse —correrlo recortaba la pata derecha de la M— y queda con más aire a
 * la izquierda que a la derecha: -2 + 80/2 = 38. Esa asimetría es a propósito.
 */
const CURTAIN_VIEW_BOX = "-2 10 80 44";

/**
 * Cada cuánto vuelve a verse el telón, en milisegundos.
 *
 * En 0 se ve siempre que se entra a la portada, que es lo que sirve para
 * probarlo. Para que aparezca como mucho una vez cada 5 minutos: 5 * 60 * 1000.
 */
export const CURTAIN_COOLDOWN_MS = 0;

const STORAGE_KEY = "curtain:last-shown";

// El trazo de la M arranca un pelín después que el de la J, así que el dibujo
// termina cuando termina la M, no cuando termina la J.
const DRAW_MS = 1100;
const STAGGER_MS = 180;
// Lo que se queda quieto el monograma ya dibujado antes de que abra el telón.
const HOLD_MS = 350;
const OPEN_MS = 900;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function shouldShow() {
  // Quien pidió menos movimiento entra directo: no hay telón ni bloqueo de
  // scroll, no es que se vea la versión rápida.
  if (prefersReducedMotion()) return false;
  if (CURTAIN_COOLDOWN_MS <= 0) return true;

  const last = Number(localStorage.getItem(STORAGE_KEY));
  if (!Number.isFinite(last) || last <= 0) return true;

  return Date.now() - last >= CURTAIN_COOLDOWN_MS;
}

/**
 * El monograma, dibujándose una vez.
 *
 * Los dos paneles montan uno de estos cada uno, completo y centrado sobre el
 * ancho de la pantalla; lo que los hace ver como uno solo es que cada panel
 * recorta su mitad. Como el centro del viewBox cae en el hueco entre la J y la
 * M, el corte pasa exactamente entre las dos letras y cada una se va con su
 * panel cuando el telón abre.
 */
function Glyph() {
  return (
    <svg
      viewBox={CURTAIN_VIEW_BOX}
      fill="none"
      aria-hidden="true"
      className="h-24 w-auto text-plum-500 dark:text-plum-200 sm:h-32"
    >
      {GLYPH_STROKES.map(({ d }, index) => (
        <motion.path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: DRAW_MS / 1000,
            delay: (index * STAGGER_MS) / 1000,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/**
 * Telón de entrada de la portada.
 *
 * Dibuja el monograma y después se abre al medio como el telón de una obra,
 * dejando ver el hero.
 *
 * El hero se monta abajo desde el primer frame: el telón tapa, no bloquea. Los
 * proyectos y la experiencia se están pidiendo mientras el monograma se dibuja,
 * así que este segundo y medio no es tiempo perdido, es tiempo que la carga se
 * come sin que se vea.
 *
 * Va solo en `/`. Quien llega por link a un proyecto no tiene por qué comerse la
 * presentación antes de ver lo que vino a ver.
 */
function Curtain() {
  // Inicializador perezoso: si no corresponde mostrarlo, no se monta nada ni se
  // toca el scroll del documento.
  const [visible, setVisible] = useState(shouldShow);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;

    localStorage.setItem(STORAGE_KEY, String(Date.now()));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => setOpen(true), DRAW_MS + STAGGER_MS + HOLD_MS);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex" aria-hidden="true">
      {["left", "right"].map((side) => {
        const isLeft = side === "left";

        return (
          <motion.div
            key={side}
            initial={{ x: 0 }}
            animate={{ x: open ? (isLeft ? "-100%" : "100%") : 0 }}
            transition={{ duration: OPEN_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
            // El guard de `open` importa: framer también avisa cuando termina la
            // animación inicial de 0 a 0, y sin él el telón se cerraría antes de
            // llegar a abrirse.
            onAnimationComplete={() => {
              if (open && !isLeft) setVisible(false);
            }}
            className="relative h-full w-1/2 overflow-hidden bg-noon dark:bg-slate-950"
          >
            {/* `w-screen` y no `w-full`: el monograma se centra sobre la pantalla
                entera, no sobre el panel. El panel es el que recorta. */}
            <div
              className={`absolute inset-y-0 flex w-screen items-center justify-center ${
                isLeft ? "left-0" : "right-0"
              }`}
            >
              <Glyph />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default Curtain;
