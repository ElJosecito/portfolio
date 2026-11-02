import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Única estrategia de refresh para todo el landing nuevo (ver revisión,
 * punto 13), pensada para reemplazar a `waitForStableLayout` (ver punto 1 —
 * el `MutationObserver` que llamaba a `ScrollTrigger.refresh()` sin
 * argumentos, que a su vez mutaba el DOM, que volvía a disparar el
 * observer: un bucle sin salida que congelaba la pestaña).
 *
 * En vez de adivinar cuándo "se asienta" el layout vigilando CUALQUIER
 * mutación, se cubren las tres causas reales de que algo cambie de alto
 * DESPUÉS del primer render:
 *
 *  1. Contenido async (proyectos, experiencias) que cambia el tamaño de
 *     `<main>` — un `ResizeObserver`, debounced, para no pedir un refresh
 *     por cada pixel que crece mientras el layout todavía se está armando.
 *  2. Las fuentes (Milker, JetBrains Mono) terminan de cargar y el texto
 *     remide — `document.fonts.ready`.
 *  3. Cambia el idioma — los textos ES/EN miden distinto, y este efecto
 *     corre apenas React pinta el nuevo idioma, sin esperar al próximo
 *     resize.
 *
 * A propósito NO hay ningún `MutationObserver` acá: `ResizeObserver` sólo
 * reacciona a cambios de TAMAÑO del elemento observado, y `refresh()` no
 * cambia el tamaño de `<main>` — así que no hay forma de que este efecto se
 * dispare a sí mismo en bucle.
 */
export function useScrollRefresh(mainRef, languaje) {
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;

    const DEBOUNCE_MS = 150;
    let debounceId = 0;
    const scheduleRefresh = () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(() => ScrollTrigger.refresh(), DEBOUNCE_MS);
    };

    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(main);

    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(debounceId);
      resizeObserver.disconnect();
    };
  }, [mainRef]);

  useEffect(() => {
    // El `ResizeObserver` de arriba terminaría cubriendo esto también (el
    // texto del idioma nuevo cambia el alto de `<main>`), pero no en el
    // mismo tick en que React pinta — este efecto refresca apenas cambia
    // `languaje`, sin depender de que el resize llegue a disparar primero.
    ScrollTrigger.refresh();
  }, [languaje]);
}
