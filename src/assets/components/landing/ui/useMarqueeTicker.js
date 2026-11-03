import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onReducedMotionChange, prefersReducedMotion } from "../../hero3d/motionPreferences";

gsap.registerPlugin(ScrollTrigger);

// Velocidad base (reposo) y el extra que se suma a scroll rápido, en px/s —
// ver el hook abajo para por qué esto ya no es animation-duration. Cada
// llamante pasa su propio BASE_SPEED (StackSection, antes, usaba 60; la
// franja del hero usa 40 — más lenta porque ahí es puro decorado de fondo,
// no el foco de la sección).
const DEFAULT_MAX_EXTRA_SPEED = 200;
// Qué tan rápido currentSpeed "alcanza" el target cada frame (más alto = más
// seco, menos alto = más gomoso). Independiente de FPS porque se multiplica
// por deltaTime.
const SPEED_SMOOTHING = 3;

/**
 * Movido de StackSection.jsx a este hook compartido: el rediseño de esa
 * sección pasó de dos filas de marquee a una grilla de cards (ver
 * StackSection.jsx), así que el ticker ya no hace falta ahí — pero la franja
 * de stack al pie del hero (ver HeroStackStrip.jsx) necesita exactamente el
 * mismo mecanismo (un solo loop por rAF, sin reiniciar animation-duration
 * sobre una animación CSS en marcha), así que se extrajo en vez de
 * duplicarlo.
 *
 * Antes esto eran `<ul>` con la animación CSS `animate-infinite-scroll`
 * (keyframes `translateX(0)` → `translateX(-100%)`), y la velocidad
 * reaccionaba a `ScrollTrigger.getVelocity()` reescribiendo
 * `style.animationDuration` en caliente. Ese era justamente el bug original:
 * cambiar la duración de una animación CSS QUE YA ESTÁ CORRIENDO no la
 * reinicia desde cero, pero sí le recalcula la posición actual con la nueva
 * duración — el navegador "salta" a donde esa curva nueva diría que debería
 * estar a esta altura del tiempo transcurrido. A scroll rápido, con la
 * duración cambiando varias veces por segundo, eso se ve como
 * tirones/saltos en el marquee.
 *
 * La solución robusta es no depender de la curva de una animación CSS para
 * la posición: un solo loop por rAF (acá, el ticker de gsap, que ya corre en
 * esta app — ver lenisBridge) que avanza un `translateX` a mano, frame a
 * frame, con una velocidad que puede cambiar sin que la posición “salte” —
 * porque la posición nunca depende de la duración, depende de cuánto se
 * movió hasta ahora más velocidad * delta.
 *
 * El loop sin costura es manual también: cada fila son tres copias
 * idénticas puestas una al lado de la otra (ver el componente que arma el
 * JSX); cuando el offset acumulado supera el ancho de UNA copia, se le
 * resta/suma ese ancho — como todas las copias son iguales, ese "salto" de
 * vuelta es invisible.
 */
export function useMarqueeTicker(sectionRef, rows, { baseSpeed = 60, maxExtraSpeed = DEFAULT_MAX_EXTRA_SPEED } = {}) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    const state = rows.map((row) => ({ ...row, offset: 0, width: 0, ready: false }));

    const measure = (row) => {
      const track = row.containerRef.current;
      const firstCopy = track?.children?.[0];
      const width = firstCopy ? firstCopy.getBoundingClientRect().width : 0;
      const hadWidth = row.width > 0;
      row.width = width;

      if (!row.ready && width > 0) {
        // La fila reversa arranca "espejada" (desplazada un ancho completo):
        // mismo punto de partida visual que tenía `animationDirection:
        // reverse` sobre la animación CSS original.
        row.offset = row.reverse ? -width : 0;
        row.ready = true;
      } else if (hadWidth && width > 0) {
        // Cambió el ancho de la copia (otro breakpoint, cambio de idioma: ES
        // e EN no miden lo mismo) con la fila ya corriendo. Reenvolver el
        // offset proporcionalmente al nuevo ancho evita el salto/hueco que
        // se veía si el offset viejo (medido contra el ancho anterior)
        // quedaba más allá del nuevo punto de "costura".
        const ratio = width / row.prevWidth;
        row.offset *= Number.isFinite(ratio) ? ratio : 1;
      }
      row.prevWidth = width || row.prevWidth;
    };

    state.forEach(measure);

    // Ancho de cada copia depende del tamaño de fuente/breakpoint — medir de
    // nuevo en cada resize es lo que mantiene el loop sin costura "a
    // cualquier ancho", no solo en el que estaba la pantalla al montar.
    const resizeObserver = new ResizeObserver(() => state.forEach(measure));
    state.forEach((row) => {
      if (row.containerRef.current) resizeObserver.observe(row.containerRef.current);
    });

    // Si la sección no está en pantalla, el tick no tiene nada que mostrar:
    // saltar el trabajo de movimiento es más barato que seguir escribiendo
    // `transform` en un elemento que nadie está mirando.
    let inView = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    intersectionObserver.observe(section);

    let targetSpeed = baseSpeed;
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = Math.min(Math.abs(self.getVelocity()) / 2500, 1);
        targetSpeed = baseSpeed + velocity * maxExtraSpeed;
      },
    });

    let currentSpeed = baseSpeed;

    const tick = (_time, deltaTimeMs) => {
      // gsap.ticker entrega `deltaTime` en MILISEGUNDOS (no segundos — se ve
      // en el propio core de gsap: `_delta = time - _self.time*1000` antes
      // de que `_self.time` se divida por 1000). baseSpeed/maxExtraSpeed
      // están en px/segundo, así que todo lo que sigue necesita `delta` en
      // segundos, no el valor crudo del callback.
      const delta = deltaTimeMs / 1000;

      // `targetSpeed` decae hacia baseSpeed en CADA tick, no solo cuando
      // `onUpdate` del ScrollTrigger dispara: `onUpdate` solo corre mientras
      // el progreso del trigger cambia, así que si el scroll se frena en
      // seco (scrollbar, teclado) o sale del rango rápido, `targetSpeed` se
      // quedaba pegado cerca del máximo y el marquee seguía corriendo ~4x
      // más rápido indefinidamente.
      targetSpeed += (baseSpeed - targetSpeed) * Math.min(delta * SPEED_SMOOTHING, 1);

      // Suavizado hacia el target, nunca un salto directo — pero a
      // diferencia del bug original, ESTO nunca mueve la posición de golpe:
      // solo cambia qué tan rápido se va a seguir acumulando desde donde ya
      // está.
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(delta * SPEED_SMOOTHING, 1);

      if (!inView) return;

      state.forEach((row) => {
        if (!row.width) return;

        const direction = row.reverse ? 1 : -1;
        row.offset += direction * currentSpeed * delta;

        if (!row.reverse && row.offset <= -row.width) {
          row.offset += row.width;
        } else if (row.reverse && row.offset >= 0) {
          row.offset -= row.width;
        }

        const track = row.containerRef.current;
        if (track) track.style.transform = `translate3d(${row.offset}px, 0, 0)`;
      });
    };

    gsap.ticker.add(tick);

    // Igual que `useDomParallax`: si el visitante prende
    // `prefers-reduced-motion` a mitad de sesión, parar el marquee del todo
    // (no solo achicarle la velocidad) y devolver cada fila a su posición
    // de reposo.
    const stopWatchingReducedMotion = onReducedMotionChange((reduced) => {
      if (!reduced) return;
      gsap.ticker.remove(tick);
      state.forEach((row) => {
        const track = row.containerRef.current;
        if (track) track.style.transform = "";
      });
    });

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scrollTrigger.kill();
      stopWatchingReducedMotion();
    };
    // Las refs son estables (useRef) y `rows` se arma desde ellas en cada
    // render solo para pasarlas una vez acá: no hace falta re-correr el
    // efecto por eso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
