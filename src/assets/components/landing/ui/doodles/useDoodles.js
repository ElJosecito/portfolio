import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { prefersReducedMotion } from "../../../hero3d/motionPreferences";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

/**
 * Dibuja los trazos de `Doodle`/`DoodleNote` que viven dentro de `sectionRef`,
 * en el orden de su `data-doodle-order` (no el del DOM: un trazo puede ir
 * antes en el markup y dibujarse después). Los paths se trazan con DrawSVG
 * (incluido en gsap 3.15, sin dependencia nueva) y las notas aparecen con un
 * fade cuando les toca.
 *
 * Dos modos:
 *  - scroll (por defecto): atado al scroll con `scrub`, entre `start` y
 *    `end` sobre la sección — se dibuja al bajar y se borra al subir.
 *  - `play`: una sola vez por tiempo, para el hero, que no se scrollea para
 *    entrar. Si `awaitEvent` viene, espera ese evento (la intro) antes.
 *
 * Con movimiento reducido no corre nada: los trazos quedan completos desde el
 * principio, que es su estado CSS natural.
 */
export function useDoodles(
  sectionRef,
  { start = "top 75%", end = "top 25%", play = false, awaitEvent = null, delay = 0, deps = [] } = {}
) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    const nodes = [...section.querySelectorAll("[data-doodle-order]")];
    if (!nodes.length) return undefined;

    const groups = new Map();
    nodes.forEach((node) => {
      const order = Number(node.dataset.doodleOrder) || 0;
      if (!groups.has(order)) groups.set(order, []);
      groups.get(order).push(node);
    });

    const timeline = gsap.timeline(
      play
        ? { paused: true, delay }
        : { scrollTrigger: { trigger: section, start, end, scrub: true } }
    );

    [...groups.keys()]
      .sort((a, b) => a - b)
      .forEach((order, index) => {
        const group = groups.get(order);
        const paths = group.filter((node) => !("doodleNote" in node.dataset));
        const notes = group.filter((node) => "doodleNote" in node.dataset);
        // Cada grupo arranca un poco antes de que termine el anterior: se
        // siente como una mano que sigue dibujando, no como pasos separados.
        const at = index === 0 ? 0 : "-=0.15";
        if (paths.length) {
          timeline.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 0.5, stagger: 0.08 }, at);
        }
        if (notes.length) {
          timeline.fromTo(notes, { opacity: 0, y: 6 }, { opacity: 1, y: 0, ease: "none", duration: 0.3 }, paths.length ? "<0.2" : at);
        }
      });

    let onEvent;
    if (play) {
      if (awaitEvent) {
        onEvent = () => timeline.play();
        window.addEventListener(awaitEvent, onEvent, { once: true });
      } else {
        timeline.play();
      }
    }

    return () => {
      if (onEvent) window.removeEventListener(awaitEvent, onEvent);
      timeline.scrollTrigger?.kill();
      timeline.kill();
      gsap.set(nodes, { clearProps: "all" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef, start, end, play, awaitEvent, delay, ...deps]);
}
