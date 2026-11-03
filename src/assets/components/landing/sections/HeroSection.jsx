import React, { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNotes from "../../hero3d/HeroNotes";
import HeroSparkles from "../../hero3d/HeroSparkles";
import HeroLeaves from "../../hero3d/HeroLeaves";
import { useDomParallax } from "../../hero3d/useDomParallax";
import { hasHoverPointer, prefersReducedMotion } from "../../hero3d/motionPreferences";
import { INTRO_DONE_EVENT } from "../intro/introState";
import GrainOverlay from "../ui/GrainOverlay";
import HeroStackStrip from "./HeroStackStrip";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parte una palabra en spans por letra. Cada letra necesita su propio nodo
 * para que la animación de salida (ver `useHeroExit`) pueda separarlas con el
 * scroll — no se puede animar "una palabra" en direcciones distintas por
 * letra sin esto.
 */
function splitLetters(word, prefix) {
  return word.split("").map((char, index) => (
    // Sin `will-change-transform` fijo (ver revisión, punto 15): son letras
    // que solo se transforman durante el tramo de salida del hero (ver
    // `useHeroExit`), no todo el tiempo que la sección está montada — un
    // `will-change` permanente le pide al navegador una capa de composición
    // aparte para cada letra desde el primer render, aunque la mayor parte
    // del tiempo (antes de empezar a scrollear, o ya en la esquina) no haya
    // nada animándose. `useHeroExit` prende/apaga el estilo inline con el
    // `onToggle` del propio ScrollTrigger del tween.
    //
    // `aria-hidden`: el nombre real ya lo lleva el `<h1>` que envuelve a
    // estas letras vía `aria-label` (ver más abajo) — sin esto, un lector de
    // pantalla deletreaba el nombre letra por letra (ver revisión, lista de
    // accesibilidad).
    <span key={`${prefix}-${index}`} data-letter aria-hidden="true" className={styles.letter}>
      {char}
    </span>
  ));
}

/**
 * Anima la salida del nombre gigante: las letras se separan y se desvanecen
 * a medida que se hace scroll para salir del hero. Atado al mismo tramo de
 * scroll que mueve la cabeza a la esquina (ver useHeadRig) para que las dos
 * cosas se sientan como un solo gesto, no dos animaciones por separado.
 */
function useHeroExit(sectionRef, nameRef) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    const nameEl = nameRef.current;
    if (!section || !nameEl) return undefined;

    const letters = nameEl.querySelectorAll("[data-letter]");
    if (!letters.length) return undefined;

    // `will-change` solo mientras el tween de salida está activo (ver
    // revisión, punto 15): con scrub, "activo" es desde que el trigger
    // entra en su rango hasta que lo deja, no todo el tiempo que la sección
    // está montada.
    const letterList = Array.from(letters);
    const setWillChange = (value) => {
      letterList.forEach((letter) => {
        letter.style.willChange = value ? "transform" : "";
      });
    };

    // `fromTo` con `opacity: 1` explícito + `immediateRender: false`: este
    // tween se crea mientras la intro todavía tiene las letras ocultas por
    // CSS (`data-awaiting-intro`). Con un `to`, GSAP leía la opacidad inicial
    // la primera vez que renderizaba cada letra — y las del centro (stagger
    // 0, renderizadas al crear el ScrollTrigger) quedaban grabadas en 0: al
    // scrollear iban de 0 a 0 y "MARTÍNEZ" perdía la A y la R de golpe.
    const tween = gsap.fromTo(letters, { opacity: 1 }, {
      y: (i) => (i % 2 === 0 ? -70 : 70),
      x: (i, target, targets) => (i - (targets.length - 1) / 2) * 16,
      scale: 1.25,
      opacity: 0,
      ease: "none",
      immediateRender: false,
      stagger: { each: 0.012, from: "center" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onToggle: (self) => setWillChange(self.isActive),
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      setWillChange(false);
    };
  }, [sectionRef, nameRef]);
}

/**
 * Caída de las letras del nombre: con overshoot (`back.out`), igual sentido
 * de "entrada con peso" que la cabeza (ver useHeadRig, el giro de perfil a
 * frente). Si la intro está activa (ver `awaitIntro`), las letras arrancan
 * ocultas por CSS (`data-awaiting-intro`, ver HeroSection.module.css) y esta
 * animación espera el evento de fin de intro antes de mostrarlas — así no
 * aparecen un instante antes de que el overlay termine de abrirse. Si la
 * intro no se muestra (ya se vio esta sesión, o reduced-motion), las letras
 * ya están visibles por CSS y esta animación no hace falta.
 */
function useHeroEntrance(nameRef, awaitIntro) {
  useEffect(() => {
    if (!awaitIntro || prefersReducedMotion()) return undefined;

    const nameEl = nameRef.current;
    const letters = nameEl?.querySelectorAll("[data-letter]");
    if (!letters?.length) return undefined;

    const play = () => {
      gsap.fromTo(
        letters,
        { yPercent: -120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: { each: 0.025, from: "center" },
        }
      );
    };

    window.addEventListener(INTRO_DONE_EVENT, play, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, play);
  }, [nameRef, awaitIntro]);
}

/**
 * El hero del landing nuevo: cobalto plano, el nombre gigante que se
 * disgrega al salir, y las capas decorativas que ya traía el hero3d viejo
 * (notas, sparkles, hojas). La franja de stack NO se repite acá a propósito
 * — ya hay una sección de stack dedicada más abajo (ver StackSection).
 *
 * Sin canvas propio: la cabeza 3D vive en la capa compartida (ver
 * head/HeadLayer), que la posiciona acá encima (ver useHeadRig, anchor
 * "hero") y después la hace viajar a la esquina cuando se sale de esta
 * sección. `data-transparent-header="true"` es lo que lee Header.jsx para
 * decidir si va transparente.
 */
const HeroSection = forwardRef(function HeroSection({ languaje, awaitIntro = false }, ref) {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const leavesRef = useRef(null);

  const setRefs = (node) => {
    sectionRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useHeroExit(sectionRef, nameRef);
  useHeroEntrance(nameRef, awaitIntro);

  const parallaxEnabled = hasHoverPointer() && !prefersReducedMotion();
  useDomParallax(
    [
      { ref: nameRef, amplitude: 10 },
      { ref: leavesRef, amplitude: 10 },
    ],
    parallaxEnabled,
    sectionRef
  );

  const { firstName, lastName, notes } = languaje.hero3d;

  return (
    <section
      ref={setRefs}
      id="home"
      data-transparent-header="true"
      className={styles.heroSection}
    >
      {/* Nombre: z-10, por debajo de la capa compartida de la cabeza
          (z-20, ver HeadLayer) — ahí es donde pasa el efecto de que la
          cabeza se superpone al medio de las letras. */}
      <div ref={nameRef} className={styles.nameWrap} data-awaiting-intro={awaitIntro || undefined}>
        <h1 aria-label={`${firstName} ${lastName}`} className={styles.nameHeading}>
          <span className={styles.nameLine}>{splitLetters(firstName, "f")}</span>
          <span className={styles.nameLine}>{splitLetters(lastName, "l")}</span>
        </h1>
      </div>

      {/* Grano sutil sobre el cobalto plano del hero (ver GrainOverlay):
          sin esto una superficie de color liso de pantalla completa se ve
          "digital" y plana; sumarle textura es barato (un solo tile de SVG
          repetido) y punto de pulido pedido en la revisión. */}
      <GrainOverlay />

      {/* Sparkles: z-25. Notas: z-30. Hojas: z-40 — todas por encima de la
          cabeza compartida (z-20), igual que en el hero3d viejo. */}
      <HeroSparkles />
      <HeroNotes notes={notes} />
      <HeroLeaves ref={leavesRef} />

      {/* Franja de stack al pie del hero (ver HeroStackStrip.jsx): z-22,
          por debajo de sparkles/notas/hojas (25/30/40) y del propio scroll
          hint (30) para que ninguno de esos elementos quede tapado. */}
      <HeroStackStrip awaitIntro={awaitIntro} />

      {/* Pista de scroll, puramente decorativa (aria-hidden): una flechita
          que titila despacio, nada de texto que traducir para algo tan
          chico. */}
      <div aria-hidden="true" className={`${styles.scrollHint} ${styles.twinkle}`}>
        <span className={styles.scrollArrow}>↓</span>
      </div>
    </section>
  );
});

export default HeroSection;
