import { useEffect } from "react";
import gsap from "gsap";
import { onReducedMotionChange } from "./motionPreferences";

/**
 * Parallax sutil para capas DOM (nombre, hojas) dentro de la sección 3D.
 *
 * Reusa el mismo patrón que `usePointerTarget`: lee la posición del puntero
 * normalizada en [-1, 1] y escribe el `transform` directo sobre el elemento
 * en cada frame, no por estado de React. Setear estado en cada `pointermove`
 * forzaría un render por pixel de movimiento para un efecto que nadie más
 * necesita leer.
 *
 * El tick corre sobre `gsap.ticker` (ver revisión, punto 15), no un rAF
 * propio: es el mismo loop que ya usan Lenis/ScrollTrigger (useLenisScroll)
 * y el marquee del stack (StackSection) — un `requestAnimationFrame`
 * independiente corriendo en paralelo era un segundo reloj innecesario, y
 * antes nunca se detenía aunque el hero hubiera quedado scrolleado fuera de
 * pantalla hace rato.
 *
 * `sectionRef` (opcional) es lo que permite saltar el trabajo cuando la
 * sección no está en pantalla: un `IntersectionObserver` solamente
 * suspende/retoma el tick, bastante más barato que medir el DOM en cada
 * frame para lo mismo.
 *
 * `layers` es un array de `{ ref, amplitude }`: cada capa se mueve hasta
 * `amplitude` px, en la dirección opuesta al puntero (el típico efecto de
 * profundidad: lo que está "atrás" se mueve menos y al revés que el cursor).
 *
 * `enabled` en false (táctil, reduced-motion) no agrega ni el listener ni el
 * loop: las capas se quedan quietas en su posición natural.
 */
export function useDomParallax(layers, enabled, sectionRef) {
  useEffect(() => {
    if (!enabled) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let inView = true;

    const handlePointerMove = (event) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = (_time, deltaTimeMs) => {
      if (!inView) return;

      // gsap.ticker entrega `deltaTime` en milisegundos (ver el mismo
      // comentario en StackSection/useMarqueeTicker) — el 0.08 de abajo ya
      // estaba calibrado para un tick por frame a 60fps, no por segundo, así
      // que no hace falta escalarlo por `delta`: sigue siendo el mismo
      // damping a mano que usa FaceModel (THREE.MathUtils.damp), sin traer
      // three para esto.
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      layers.forEach(({ ref, amplitude }) => {
        const node = ref.current;
        if (!node) return;
        node.style.transform = `translate3d(${-current.x * amplitude}px, ${-current.y * amplitude}px, 0)`;
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    gsap.ticker.add(tick);

    let observer;
    const section = sectionRef?.current;
    if (section && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
      });
      observer.observe(section);
    }

    // Si el visitante prende `prefers-reduced-motion` a mitad de sesión,
    // dejar de mover las capas (ver motionPreferences.onReducedMotionChange)
    // y devolverlas a su posición natural en vez de quedar congeladas en el
    // último offset que tenían.
    const stopWatchingReducedMotion = onReducedMotionChange((reduced) => {
      if (!reduced) return;
      inView = false;
      layers.forEach(({ ref }) => {
        if (ref.current) ref.current.style.transform = "";
      });
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      gsap.ticker.remove(tick);
      observer?.disconnect();
      stopWatchingReducedMotion();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
