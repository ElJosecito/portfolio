import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Revela el texto de un elemento palabra por palabra, con máscara (cada
 * palabra se traslada de `yPercent: 100` a `0` DENTRO de un contenedor con
 * `overflow: clip` que arma SplitText por cada línea — `mask: "lines"`) en
 * vez del fade de opacidad que tenían el manifiesto y los títulos de
 * sección antes.
 *
 * `autoSplit: true` deja que SplitText mismo vuelva a partir el texto si el
 * elemento cambia de tamaño (resize) — por eso `onSplit` no es un callback
 * de una sola vez: SplitText lo vuelve a llamar cada vez que re-parte, y lo
 * que devuelva (acá, el tween) se revierte solo antes de la siguiente
 * partición. No hace falta un `ResizeObserver` en este hook.
 *
 * El cambio de idioma NO lo cubre `autoSplit`: SplitText reescribe el DOM
 * del elemento (spans por palabra + `aria-label` con el texto original) y
 * cambiar `languaje` no lo remonta — React escribía el texto nuevo sobre
 * nodos que SplitText ya había reemplazado, y quedaba en el idioma viejo o
 * mezclado. Quien llama tiene que darle al elemento `key={texto}` (React lo
 * recrea limpio) y pasar ese mismo texto en `deps` para volver a partirlo.
 */
export function useSplitReveal(ref, { start = "top 85%", end = "top 55%", deps = [] } = {}) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const split = SplitText.create(el, {
      type: "words,lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            stagger: 0.025,
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub: true,
            },
          }
        );
      },
    });

    return () => split.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end, ...deps]);
}
