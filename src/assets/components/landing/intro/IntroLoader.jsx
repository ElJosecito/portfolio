import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INTRO_DONE_EVENT, markIntroShown } from "./introState";
import { getFallbackCount } from "./IntroFallback";
import styles from "./IntroLoader.module.css";

gsap.registerPlugin(ScrollTrigger);

// Mismo modelo que descarga FaceModel (hero3d/FaceModel.jsx): se pide con
// `fetch` plano acá, SIN pasar por three.js/drei (que viven en su propio
// chunk lazy, ver HeadLayer) — nada de esto puede tirar three.js al chunk de
// NewLanding solo para mostrar un contador de progreso. El browser cachea la
// respuesta por URL: cuando GLTFLoader la pida de nuevo (ya en el chunk de
// three), sale del cache HTTP, no se descarga dos veces.
const MODEL_URL = "/models/face.glb";

// Tope duro: aunque la red esté lenta o el navegador no mande
// `content-length`, la intro nunca bloquea la página más de esto.
const HARD_CAP_MS = 4000;
// Duración MÍNIMA de la cuenta 000→100, medida desde que apareció el
// contador (incluido el tiempo del fallback de Suspense). Con buena conexión
// el modelo y las fuentes cargan casi al instante y el contador saltaba a
// 100 en un parpadeo: el usuario pidió que se pudiera disfrutar. El número
// nunca va más rápido que esta curva, aunque la carga real ya haya terminado.
const MIN_DURATION_MS = 2800;
// Respiro con el "100" en pantalla antes del reveal, para que se note.
const REVEAL_DELAY_MS = 400;
// Mismos valores que la animación CSS del fallback (ver IntroFallback):
// sirven para reconstruir cuándo empezó a contar a partir del número que
// estaba mostrando.
const FALLBACK_DURATION_MS = 2400;
const FALLBACK_MAX = 99;

function fetchModelProgress(onProgress) {
  return fetch(MODEL_URL)
    .then((response) => {
      const total = Number(response.headers.get("content-length")) || 0;
      if (!response.body || !total) {
        onProgress(1);
        return;
      }
      const reader = response.body.getReader();
      let loaded = 0;
      const pump = () =>
        reader.read().then(({ done, value }) => {
          if (done) {
            onProgress(1);
            return undefined;
          }
          loaded += value.byteLength;
          onProgress(Math.min(loaded / total, 1));
          return pump();
        });
      return pump();
    })
    .catch(() => onProgress(1)); // 404/offline: no bloquear la intro por esto.
}

/**
 * Overlay de carga a pantalla completa: contador 000→100 atado a progreso
 * REAL (descarga del .glb + fuentes), con un tope duro de 3.5s para que
 * nunca bloquee. Al llegar a 100, revela el hero con un clip-path circular
 * desde el centro y avisa a HeroSection/useHeadRig (ver INTRO_DONE_EVENT)
 * para que arranquen sus propias entradas (letras, giro de la cabeza).
 *
 * HTML/CSS puro, sin esperar nada para el primer pintado (el gradiente
 * cobalto sale con el primer frame, antes de que termine de resolverse
 * ningún progreso) — no le pesa al LCP.
 */
function IntroLoader({ onComplete }) {
  const rootRef = useRef(null);
  // Arranca donde iba el contador del fallback de Suspense (ver
  // IntroFallback): si empezara en 0, al montarse este componente el número
  // "retrocedía" de golpe (ej. de 060 a 000) y se notaba el cambio de
  // pantalla.
  const [initialCount] = useState(getFallbackCount);
  const [displayed, setDisplayed] = useState(initialCount);
  const [phase, setPhase] = useState("loading"); // loading | revealing

  const progressRef = useRef({ real: 0, shown: initialCount });
  const finishedRef = useRef(false);

  useEffect(() => {
    markIntroShown();

    // Declarado antes de `finish` y reasignado más abajo: `finish` necesita
    // poder destrabar el scroll de una (no recién al desmontar, ver más
    // abajo) para que el tope duro de 3.5s sea un tope real sobre el
    // bloqueo, no solo sobre el contador.
    let unlockScroll = () => {};

    // Cuándo empezó a contar (si venía del fallback, hace un rato): base de
    // la duración mínima, así el tiempo del fallback cuenta y no se suma.
    const startedAt =
      performance.now() - (progressRef.current.shown / FALLBACK_MAX) * FALLBACK_DURATION_MS;

    // Un solo loop por frame decide el número mostrado: va hacia el MENOR
    // entre el progreso real y el techo de tiempo (curva ease-out sobre
    // MIN_DURATION_MS), suavizado y sin retroceder nunca. Antes un tween
    // perseguía directo al progreso real, y con caché caliente llegaba a
    // 100 en ~0.35s.
    const tick = () => {
      const t = Math.min((performance.now() - startedAt) / MIN_DURATION_MS, 1);
      const timeCeiling = 100 * (1 - (1 - t) * (1 - t));
      const target = Math.min(progressRef.current.real * 100, timeCeiling);
      const shown = progressRef.current.shown;
      const next = Math.max(shown, shown + (target - shown) * 0.2);
      progressRef.current.shown = next;
      // `floor` y no `round`: si no, mostraba "100" un instante antes de
      // que de verdad terminara.
      const rounded = Math.floor(next);
      setDisplayed((prev) => (prev === rounded ? prev : rounded));
      if (target >= 100 && next >= 99.5) finish();
    };

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      gsap.ticker.remove(tick);
      setDisplayed(100);
      setPhase("revealing");
      unlockScroll();
    };

    // Progreso real: 70% el modelo, 30% las fuentes (Milker es la que más
    // tarda en notarse — ver index.html, se precarga aparte). Solo se
    // guarda: el que lo convierte en número mostrado es `tick`.
    let modelProgress = 0;
    let fontsReady = false;
    const recompute = () => {
      progressRef.current.real = modelProgress * 0.7 + (fontsReady ? 0.3 : 0);
    };

    gsap.ticker.add(tick);

    fetchModelProgress((value) => {
      modelProgress = value;
      recompute();
    });
    document.fonts?.ready
      ?.then(() => {
        fontsReady = true;
        recompute();
      })
      .catch(() => {
        fontsReady = true;
        recompute();
      });

    const hardCap = setTimeout(finish, HARD_CAP_MS);

    // Bloqueo de scroll mientras dura la intro: listeners directos en vez de
    // depender de Lenis (que puede todavía no existir — su propio efecto en
    // useLenisScroll corre en un componente hermano, sin orden garantizado
    // contra este). `passive: false` es obligatorio para poder llamar
    // `preventDefault()` en wheel/touchmove.
    const preventScroll = (event) => event.preventDefault();
    const preventKeyScroll = (event) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll);

    // Skippable: un click, tecla o intento de scroll salta directo al
    // reveal — no hace falta esperar a que termine de cargar.
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });

    unlockScroll = () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };

    return () => {
      clearTimeout(hardCap);
      gsap.ticker.remove(tick);
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    if (phase !== "revealing") return undefined;

    const root = rootRef.current;
    const timer = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // El layout no cambió de tamaño (el overlay solo tapaba, no
          // empujaba nada), pero las secciones de abajo recién ahora se ven
          // por primera vez — un refresh deja a ScrollTrigger con medidas
          // frescas antes de que el usuario pueda scrollear.
          ScrollTrigger.refresh();
          window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
          onComplete();
        },
      });

      // Abre el agujero de la máscara (ver IntroLoader.module.css, `--hole`)
      // y de paso desvanece el número, para que el "100" no quede cortado
      // en dos por el borde del círculo mientras se abre.
      tl.to(root, {
        "--hole": "150vmax",
        duration: 0.9,
        ease: "power2.inOut",
      });
      tl.to(root.firstChild, { opacity: 0, scale: 0.92, duration: 0.3, ease: "power1.in" }, 0);
    }, REVEAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const label = String(displayed).padStart(3, "0");

  return (
    <div ref={rootRef} className={styles.overlay} aria-hidden="true">
      <div className={styles.counterRow}>
        <span className={styles.counter}>{label}</span>
      </div>
    </div>
  );
}

export default IntroLoader;
