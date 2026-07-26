import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { GLYPH_STROKES } from "../../../shared/ui/Loader";
import { TIMELINE, createCurtainRenderer } from "./curtainRenderer";

/**
 * Cada cuánto vuelve a verse el telón, en milisegundos.
 *
 * En 0 se ve siempre que se entra a la portada, que es lo que sirve para
 * probarlo. Para que aparezca como mucho una vez cada 5 minutos: 5 * 60 * 1000.
 */
export const CURTAIN_COOLDOWN_MS = 0;

const STORAGE_KEY = "curtain:last-shown";

// Mismo viewBox que usa el renderer: el centro cae en el hueco entre la J y la
// M, que es por donde se abre.
const CURTAIN_VIEW_BOX = "-2 10 80 44";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function shouldShow() {
  // Quien pidió menos movimiento entra directo: no hay telón ni bloqueo de
  // scroll, no es que se vea una versión rápida.
  if (prefersReducedMotion()) return false;
  if (CURTAIN_COOLDOWN_MS <= 0) return true;

  const last = Number(localStorage.getItem(STORAGE_KEY));
  if (!Number.isFinite(last) || last <= 0) return true;

  return Date.now() - last >= CURTAIN_COOLDOWN_MS;
}

/**
 * Telón sin WebGL.
 *
 * Los pliegues son un gradiente repetido y las mitades se corren en vez de
 * fruncirse: no tiene volumen real, pero es tela y no dos rectángulos planos.
 * Solo lo ve quien no tenga WebGL disponible.
 */
function CurtainFallback({ onDone }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setOpen(true),
      TIMELINE.DRAW_MS + TIMELINE.STAGGER_MS + TIMELINE.HOLD_MS
    );

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex">
      {["left", "right"].map((side) => {
        const isLeft = side === "left";

        return (
          <motion.div
            key={side}
            initial={{ x: 0 }}
            animate={{ x: open ? (isLeft ? "-100%" : "100%") : 0 }}
            transition={{ duration: TIMELINE.OPEN_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
            // El guard de `open` importa: framer también avisa cuando termina la
            // animación inicial de 0 a 0, y sin él el telón se cerraría antes de
            // llegar a abrirse.
            onAnimationComplete={() => {
              if (open && !isLeft) onDone();
            }}
            className="relative h-full w-1/2 overflow-hidden bg-plum-400 dark:bg-plum-950"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.42) 0px, rgba(0,0,0,0) 14px, rgba(255,255,255,0.10) 22px, rgba(0,0,0,0) 30px, rgba(0,0,0,0.42) 44px)",
            }}
          >
            {/* `w-screen` y no `w-full`: el monograma se centra sobre la
                pantalla entera, no sobre el panel. El panel es el que recorta. */}
            <div
              className={`absolute inset-y-0 flex w-screen items-center justify-center ${
                isLeft ? "left-0" : "right-0"
              }`}
            >
              <svg
                viewBox={CURTAIN_VIEW_BOX}
                fill="none"
                aria-hidden="true"
                className="h-24 w-auto text-plum-800 dark:text-plum-100 sm:h-32"
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
                      duration: TIMELINE.DRAW_MS / 1000,
                      delay: (index * TIMELINE.STAGGER_MS) / 1000,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Telón de entrada de la portada.
 *
 * Terciopelo de teatro: el monograma se escribe sobre la tela y después el paño
 * se abre al medio, entre la J y la M. Los pliegues no se deslizan, se
 * frunecen contra cada costado, que es lo que hace una cortina de verdad.
 *
 * Lo pinta un fragment shader en `curtainRenderer.js`. El hero se monta abajo
 * desde el primer frame: el telón tapa, no bloquea. Los proyectos y la
 * experiencia se están pidiendo mientras la letra se dibuja, así que estos dos
 * segundos y medio no son tiempo perdido: son tiempo que la carga se come sin
 * que se vea.
 *
 * Va solo en `/`. Quien llega por link a un proyecto no tiene por qué comerse la
 * presentación antes de ver lo que vino a ver.
 */
function Curtain() {
  // Inicializador perezoso: si no corresponde mostrarlo, no se monta nada ni se
  // toca el scroll del documento.
  const [visible, setVisible] = useState(shouldShow);
  const [noWebgl, setNoWebgl] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    localStorage.setItem(STORAGE_KEY, String(Date.now()));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || noWebgl || !canvasRef.current) return;

    const renderer = createCurtainRenderer(canvasRef.current, {
      // El tema ya está aplicado en <html> por initTheme, antes del render.
      dark: document.documentElement.classList.contains("dark"),
      onOpened: () => setVisible(false),
    });

    if (!renderer) {
      setNoWebgl(true);
      return;
    }

    return () => renderer.destroy();
  }, [visible, noWebgl]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {noWebgl ? (
        <CurtainFallback onDone={() => setVisible(false)} />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  );
}

export default Curtain;
