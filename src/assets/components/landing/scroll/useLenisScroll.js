import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";
import { setActiveLenis } from "./lenisBridge";

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
