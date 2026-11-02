import React, { useEffect, useRef } from "react";
import { SiExpo, SiReact, SiSupabase, SiSwift, SiTypescript } from "react-icons/si";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "../ui/SectionLabel";
import { useSplitReveal } from "../ui/useSplitReveal";
import { onReducedMotionChange, prefersReducedMotion } from "../../hero3d/motionPreferences";
import styles from "./StackSection.module.css";

gsap.registerPlugin(ScrollTrigger);

// El stack real del perfil (ver about.description en los idiomas): mobile
// con React Native, nativo con Swift, y el resto del ecosistema web. Dos
// filas con el mismo set en orden distinto a propósito: no hay dos listas de
// tecnologías que mantener, solo dos lecturas visuales de la misma.
const ROW_A = [
  { label: "REACT NATIVE", Icon: SiReact },
  { label: "TYPESCRIPT", Icon: SiTypescript },
  { label: "SWIFT", Icon: SiSwift },
  { label: "EXPO", Icon: SiExpo },
  { label: "SUPABASE", Icon: SiSupabase },
];
const ROW_B = [
  { label: "SUPABASE", Icon: SiSupabase },
  { label: "SWIFT", Icon: SiSwift },
  { label: "REACT", Icon: SiReact },
  { label: "EXPO", Icon: SiExpo },
  { label: "TYPESCRIPT", Icon: SiTypescript },
];

// Velocidad base (reposo) y el extra que se suma a scroll rápido, en px/s —
// ver useMarqueeTicker abajo para por qué esto ya no es animation-duration.
const BASE_SPEED = 60;
const MAX_EXTRA_SPEED = 200;
// Qué tan rápido currentSpeed "alcanza" el target cada frame (más alto = más
// seco, menos alto = más gomoso). Independiente de FPS porque se multiplica
// por deltaTime.
const SPEED_SMOOTHING = 3;

/**
 * Una fila de marquee: tres copias idénticas de la misma lista, una al lado
 * de la otra. `containerRef` apunta a la pista que las envuelve — es ESE div
 * el que se traslada en bloque (ver useMarqueeTicker), no cada `<ul>` por
 * separado. Mientras la traslación no supere el ancho de una sola copia, las
 * copias siguientes disimulan el "borde" de la lista y el loop se ve
 * continuo. La tercera copia cubre pantallas más anchas que una copia.
 *
 * El recorte (`overflow-hidden`) va en un div APARTE que no se mueve. Si lo
 * lleva la misma pista que se traslada, el recorte viaja con ella: la fila
 * entera se iba deslizando fuera de la pantalla y desaparecía a ratos en vez
 * de correr adentro de una ventana fija.
 *
 * Accesibilidad (ver revisión, lista de a11y): solo la PRIMERA copia es
 * legible para un lector de pantalla, las otras dos llevan `aria-hidden` —
 * decisión a propósito, no un descuido: son decorativas por duplicado (el
 * mismo stack ya está en `about.description`, ver Languajes/*.js), así que
 * un lector no necesita escuchar la lista de tecnologías tres veces.
 */
// `size` sigue siendo un prop seleccionable, pero ahora eligiendo entre
// clases del CSS module (`styles[size]`) en vez de armar un string de
// Tailwind a mano — mismo mecanismo, sin clases crudas.
function MarqueeRow({ items, containerRef, size = "sizeDefault" }) {
  return (
    <div className={styles.rowOuter}>
      <div ref={containerRef} className={styles.track} style={{ willChange: "transform" }}>
        {[0, 1, 2].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0 ? "true" : undefined}
            className={`${styles.copyList} ${styles[size]}`}
          >
            {items.map(({ label, Icon }, index) => (
              <li key={index} className={styles.techItem}>
                <Icon aria-hidden="true" className={styles.icon} />
                {label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Antes esto eran dos `<ul>` con la animación CSS `animate-infinite-scroll`
 * (keyframes `translateX(0)` → `translateX(-100%)`), y la velocidad
 * reaccionaba a `ScrollTrigger.getVelocity()` reescribiendo
 * `style.animationDuration` en caliente. Ese era justamente el bug que
 * reportó el usuario: cambiar la duración de una animación CSS QUE YA ESTÁ
 * CORRIENDO no la reinicia desde cero, pero sí le recalcula la posición
 * actual con la nueva duración — el navegador "salta" a donde esa curva
 * nueva diría que debería estar a esta altura del tiempo transcurrido. A
 * scroll rápido, con la duración cambiando varias veces por segundo, eso se
 * ve como tirones/saltos en el marquee.
 *
 * La solución robusta (la que pide el ticket) es no depender de la curva de
 * una animación CSS para la posición: un solo loop por rAF (acá, el ticker
 * de gsap, que ya corre en esta app — ver lenisBridge) que avanza un
 * `translateX` a mano, frame a frame, con una velocidad que puede cambiar
 * sin que la posición “salte” — porque la posición nunca depende de la
 * duración, depende de cuánto se movió hasta ahora más velocidad * delta.
 *
 * El loop sin costura es manual también: cada fila es tres copias idénticas
 * puestas una al lado de la otra (ver MarqueeRow); cuando el offset
 * acumulado supera el ancho de UNA copia, se le resta/suma ese ancho — como
 * todas las copias son iguales, ese "salto" de vuelta es invisible.
 */
function useMarqueeTicker(sectionRef, rows) {
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
        // e EN no miden lo mismo) con la fila ya corriendo — ver revisión,
        // "Detalles menores". Reenvolver el offset proporcionalmente al
        // nuevo ancho evita el salto/hueco que se veía si el offset viejo
        // (medido contra el ancho anterior) quedaba más allá del nuevo
        // punto de "costura".
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

    // Si la sección no está en pantalla, el tick no tiene nada que mostrar
    // (ver revisión, punto 15): saltar el trabajo de movimiento es más
    // barato que seguir escribiendo `transform` en un elemento que nadie
    // está mirando.
    let inView = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    intersectionObserver.observe(section);

    let targetSpeed = BASE_SPEED;
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = Math.min(Math.abs(self.getVelocity()) / 2500, 1);
        targetSpeed = BASE_SPEED + velocity * MAX_EXTRA_SPEED;
      },
    });

    let currentSpeed = BASE_SPEED;

    const tick = (_time, deltaTimeMs) => {
      // gsap.ticker entrega `deltaTime` en MILISEGUNDOS (no segundos — se ve
      // en el propio core de gsap: `_delta = time - _self.time*1000` antes
      // de que `_self.time` se divida por 1000). BASE_SPEED/MAX_EXTRA_SPEED
      // están en px/segundo, así que todo lo que sigue necesita `delta` en
      // segundos, no el valor crudo del callback.
      const delta = deltaTimeMs / 1000;

      // `targetSpeed` decae hacia BASE_SPEED en CADA tick, no solo cuando
      // `onUpdate` del ScrollTrigger dispara (ver revisión, punto 19):
      // `onUpdate` solo corre mientras el progreso del trigger cambia, así
      // que si el scroll se frena en seco (scrollbar, teclado) o sale del
      // rango rápido, `targetSpeed` se quedaba pegado cerca del máximo y el
      // marquee seguía corriendo ~4x más rápido indefinidamente.
      targetSpeed += (BASE_SPEED - targetSpeed) * Math.min(delta * SPEED_SMOOTHING, 1);

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
    // de reposo (ver revisión, lista de a11y).
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

/**
 * Cierre del "capítulo morado" (ver Experience/Projects): el fondo más
 * oscuro de la paleta, plum-950, justo antes de volver al cobalto en el
 * contacto.
 */
function StackSection({ languaje }) {
  const sectionRef = useRef(null);
  const rowARef = useRef(null);
  const rowBRef = useRef(null);
  const titleRef = useRef(null);

  useMarqueeTicker(sectionRef, [
    { containerRef: rowARef, reverse: false },
    { containerRef: rowBRef, reverse: true },
  ]);
  useSplitReveal(titleRef, { start: "top 90%", end: "top 60%" });

  return (
    <section
      id="stack"
      ref={sectionRef}
      className={styles.section}
    >
      <div className={styles.header}>
        <SectionLabel index={4} tone="light">
          {languaje.landing.sectionLabels.stack}
        </SectionLabel>
        <h2 ref={titleRef} className={styles.title}>{languaje.landing.stack.title}</h2>
      </div>

      <div className={styles.rows}>
        <MarqueeRow items={ROW_A} containerRef={rowARef} />
        <MarqueeRow items={ROW_B} containerRef={rowBRef} />
      </div>
    </section>
  );
}

export default StackSection;
