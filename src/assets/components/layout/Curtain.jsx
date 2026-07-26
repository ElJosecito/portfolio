import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { GLYPH_STROKES } from "../../../shared/ui/Loader";
import { TIMELINE, createCurtainRenderer } from "./curtainRenderer";

/**
 * Cada cuánto vuelve a verse el telón, en milisegundos.
 *
 * Cinco minutos: quien entra, se mete en un proyecto y vuelve a la portada no se
 * come la presentación de nuevo, pero quien vuelve más tarde sí la ve. La marca
 * va en localStorage, así que también aguanta recargas y pestañas nuevas.
 *
 * En 0 aparece en cada entrada a la portada, que es como se probó.
 */
export const CURTAIN_COOLDOWN_MS = 5 * 60 * 1000;

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
  // El telón terminó de abrirse pero el nodo sigue montado. Ver más abajo.
  const [fading, setFading] = useState(false);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    if (!visible) return;

    localStorage.setItem(STORAGE_KEY, String(Date.now()));

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    // Bloquear el scroll con overflow:hidden le saca la barra a la página, y la
    // barra de este sitio ocupa lugar real (el CSS le da 6px de ancho, no es de
    // las que flotan encima). O sea que mientras el telón está arriba la página
    // es unos píxeles más ancha, y al soltar el bloqueo se encoge de golpe. Ese
    // salto, justo al final, se ve como un parpadeo.
    //
    // El ancho se mide y no se escribe a mano: depende del sistema, y en macOS
    // con barras flotantes da 0 y esto no hace nada, que es lo correcto.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [visible]);

  // Layout effect y no effect común: el renderer pinta su primer cuadro de
  // entrada, y esto corre antes de que el navegador dibuje. Con un useEffect
  // normal el canvas se vería vacío durante un cuadro y asomaría el hero.
  useLayoutEffect(() => {
    if (!visible || noWebgl || !canvasRef.current) return;

    const renderer = createCurtainRenderer(canvasRef.current, {
      // El tema ya está aplicado en <html> por initTheme, antes del render.
      dark: document.documentElement.classList.contains("dark"),
      onOpened: () => setFading(true),
    });

    if (!renderer) {
      setNoWebgl(true);
      return;
    }

    return () => renderer.destroy();
  }, [visible, noWebgl]);

  // El telón no se desmonta en el mismo momento en que termina de abrirse.
  //
  // `refractive` pinta el vidrio del header y de las cards con `backdrop-filter`,
  // y eso son capas de compositor. Sacar de golpe un canvas fijo a pantalla
  // completa que estaba por encima de todas ellas las obliga a rehacerse en el
  // mismo cuadro, y ese es el parpadeo que quedaba al final.
  //
  // Con la opacidad en cero durante un momento, el compositor va soltando el
  // telón de a poco y las capas de vidrio se rehacen mientras todavía hay algo
  // encima. Recién después se saca el nodo, y para entonces ya no hay nada que
  // recomponer. El canvas a esa altura ya es transparente, así que no se ve
  // ninguna transición: lo único que hace es separar los dos eventos.
  useEffect(() => {
    if (!fading) return;

    const timer = setTimeout(() => setVisible(false), 260);
    return () => clearTimeout(timer);
  }, [fading]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      aria-hidden="true"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 200ms linear",
        pointerEvents: fading ? "none" : undefined,
      }}
    >
      {noWebgl ? (
        <CurtainFallback onDone={() => setFading(true)} />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  );
}

export default Curtain;
