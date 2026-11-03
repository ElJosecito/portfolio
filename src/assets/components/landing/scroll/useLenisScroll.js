import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hasHoverPointer, prefersReducedMotion } from "../../hero3d/motionPreferences";
import { HEADER_HEIGHT, setActiveLenis } from "./lenisBridge";

gsap.registerPlugin(ScrollTrigger);

/**
 * Motor de scroll del landing nuevo: Lenis para el scroll suave + gsap
 * ScrollTrigger sincronizado a su rAF (no al scroll nativo), que es lo que
 * leen `useHeadRig` y cada sección para animar atadas al progreso real.
 *
 * Todo esto se monta y desmonta junto con `NewLanding`: al cambiar de ruta
 * (a /all-projects, /projects/:slug, /admin) este hook se desmonta y suelta
 * Lenis + el tick de gsap que lo alimentaba, así esas rutas no heredan
 * listeners de scroll que no les corresponden. Los ScrollTrigger de cada
 * sección (useHeadRig, useHeroExit, StackSection, etc.) los matan ELLOS, en
 * su propio cleanup, no este hook (ver el cleanup de abajo).
 *
 * Respeta `prefers-reduced-motion` por si el usuario lo activa después de
 * cargar la página: el gate de variante (ver deviceCapability.js) ya filtró
 * el caso inicial, pero si cambia a mitad de sesión, Lenis ni se instancia y
 * el scroll queda el nativo del navegador — sin animación de por medio.
 */
export function useLenisScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    setActiveLenis(lenis);

    const snap = createSectionSnap(lenis);

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const onTick = (time) => {
      // gsap.ticker ya corre en segundos * 1000 por defecto en v3; Lenis
      // espera milisegundos, de ahí el *1000.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);

    // `lagSmoothing(0)` desactiva la compensación de tiempo perdido de
    // gsap: sin esto, cuando la pestaña vuelve de estar en segundo plano
    // gsap intenta "compensar" de una, y Lenis lee eso como un salto de
    // scroll gigante instantáneo. Guardamos los valores por defecto para
    // restaurarlos al desmontar (ver revisión, P3 "Limpieza global desde un
    // hook hoja") — es una config GLOBAL de gsap.ticker, así que si otra
    // ruta vuelve a necesitar lag smoothing normal (cualquier animación
    // fuera del landing nuevo), este hook tiene que devolverla tal como la
    // encontró, no dejarla en 0 para siempre.
    const DEFAULT_LAG_THRESHOLD = 500;
    const DEFAULT_LAG_ADJUSTED_TIME = 33;
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      snap?.destroy();
      lenis.off("scroll", onLenisScroll);
      setActiveLenis(null);
      lenis.destroy();
      gsap.ticker.lagSmoothing(DEFAULT_LAG_THRESHOLD, DEFAULT_LAG_ADJUSTED_TIME);

      // Antes: `ScrollTrigger.getAll().forEach((t) => t.kill())` — mataba
      // TODOS los ScrollTrigger vivos en la página, incluidos los que
      // hubiera creado código que no tiene nada que ver con este hook (ver
      // revisión, P3, "limpieza global desde un hook hoja"). Cada
      // sección/hook del landing nuevo ya mata los suyos en su propio
      // cleanup (useHeadRig, useHeroExit, useStackedCards vía
      // `gsap.context`, etc.) — este hook solo necesita soltar lo que ÉL
      // mismo creó: el listener de Lenis y el tick de gsap, ya sueltos
      // arriba. Si algo queda sin matar, es un bug en ESE hook, no algo
      // que este efecto deba barrer por todos.
    };
  }, []);
}

// Secciones que "imantan" al soltar el scroll, y dónde: Contacto se acomoda
// a su CENTRO porque ahí termina de llegar la cabeza (ver useHeadRig, `end:
// "center center"`) y se terminan de dibujar sus trazos; el resto, a su
// inicio. Experiencia y Proyectos son más altas que la pantalla: solo tienen
// punto al entrar, así que en el medio se scrollea libre.
const SNAP_SECTIONS = [
  { id: "home", align: "start" },
  { id: "about", align: "start" },
  { id: "experience", align: "start" },
  { id: "projects", align: "start" },
  // Stack mide un poco más que la pantalla por su padding (128px arriba y
  // abajo): alineado por el borde dejaba una franja vacía arriba y cortaba
  // las cards de abajo. "content" centra lo que de verdad se ve (título +
  // grilla) en el espacio libre bajo el header.
  { id: "stack", align: "content" },
  { id: "contact", align: "center" },
];

/**
 * Snap suave "por cercanía": cuando el scroll se detiene cerca de una
 * sección (a menos de 25% de la pantalla de su punto), Lenis la termina de
 * acomodar con la misma animación de siempre. Si se detiene lejos de
 * cualquier punto (en medio de Experiencia o de las cards de Proyectos), no
 * hace nada.
 *
 * Propio y no `lenis/snap`: ese decide 450ms después del último evento de
 * rueda, pero la animación de Lenis dura ~1.1s — en ese momento el scroll
 * todavía va a mitad de camino, lejos de todo punto, y ya no se vuelve a
 * evaluar cuando termina (se probó: nunca acomodaba). Acá se evalúa cuando
 * el scroll de verdad se quedó quieto.
 *
 * Solo con mouse/trackpad: en táctil el snap pelea con el gesto del dedo y
 * se siente como si la página "te quitara" el scroll.
 */
const SNAP_THRESHOLD = 0.25;
const SNAP_IDLE_MS = 160;

function createSectionSnap(lenis) {
  if (!hasHoverPointer()) return null;

  let idleTimer;
  let snapping = false;

  const snapPoints = () =>
    SNAP_SECTIONS.map(({ id, align }) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const top = element.getBoundingClientRect().top + lenis.scroll;
      if (align === "center") return top + element.offsetHeight / 2 - window.innerHeight / 2;
      if (align === "content") {
        const styles = getComputedStyle(element);
        const padTop = parseFloat(styles.paddingTop) || 0;
        const padBottom = parseFloat(styles.paddingBottom) || 0;
        const contentHeight = element.offsetHeight - padTop - padBottom;
        // El header flota (margen arriba + barra): se mide su borde real en vez
        // de asumir HEADER_HEIGHT, que no cuenta ese margen.
        const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? HEADER_HEIGHT;
        const visible = window.innerHeight - headerBottom;
        // Si el contenido entra, centrado en el espacio visible; si no, su
        // inicio justo bajo el header (con un respiro de 16px).
        const slack = contentHeight < visible ? (visible - contentHeight) / 2 : 16;
        return top + padTop - headerBottom - slack;
      }
      // Mismo margen que el nav del header (ver lenisBridge, `scrollToSection`):
      // si el snap acomodara al borde exacto, después de cada click en el menú
      // "corregiría" la página 80px y el inicio de la sección quedaría bajo el
      // header. El hero sí va a 0.
      return id === "home" ? 0 : Math.max(0, top - HEADER_HEIGHT);
    }).filter((value) => value !== null);

  const settle = () => {
    if (snapping) return;
    const current = lenis.scroll;
    const threshold = window.innerHeight * SNAP_THRESHOLD;
    let target = null;
    snapPoints().forEach((point) => {
      const distance = Math.abs(point - current);
      // `> 2`: ya está ahí, no hace falta animar nada.
      if (distance > 2 && distance <= threshold && (target === null || distance < Math.abs(target - current))) {
        target = point;
      }
    });
    if (target === null) return;

    snapping = true;
    lenis.scrollTo(target, {
      duration: 0.9,
      onComplete: () => {
        snapping = false;
      },
    });
  };

  const onScroll = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(settle, SNAP_IDLE_MS);
  };
  // Si el usuario vuelve a scrollear durante el acomodo, manda él: se suelta
  // el flag (el `onComplete` de un scrollTo interrumpido nunca llega).
  const onUserScroll = () => {
    snapping = false;
  };

  lenis.on("scroll", onScroll);
  lenis.on("virtual-scroll", onUserScroll);

  return {
    destroy() {
      clearTimeout(idleTimer);
      lenis.off("scroll", onScroll);
      lenis.off("virtual-scroll", onUserScroll);
    },
  };
}
