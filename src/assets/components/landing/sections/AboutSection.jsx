import React, { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SectionLabel from "../ui/SectionLabel";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";
import styles from "./AboutSection.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * El viaje de la cabeza termina en la esquina (CORNER en useHeadRig,
 * nx/ny ≈ 0.74/0.68) al salir del hero. Esta sección "abre como una puerta"
 * desde ese mismo punto: un `clip-path: circle()` que arranca en 0% sobre
 * esas coordenadas y crece mientras se sale del hero (mismo trigger/rango
 * que `heroExit` en useHeadRig — "top top" → "bottom top" sobre el hero),
 * para que el gesto se sienta coordinado con la cabeza, no una animación
 * aparte.
 *
 * Versión sin pin a propósito (ver docs/landing-redesign-review.md,
 * "Rediseño de Proyectos" sobre por qué este landing evita pines cuando se
 * puede): no hay un tramo fijo de scroll dedicado a la transición, el
 * círculo crece sobre la ventana normal en la que el hero ya se está
 * yendo. Es una interpretación más liviana del pedido ("o una transición
 * pineada corta") — documentado, no un pin real.
 */
function useDoorReveal(sectionRef, heroRef) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    const heroEl = heroRef?.current;
    if (!section || !heroEl) return undefined;

    const tween = gsap.fromTo(
      section,
      { clipPath: "circle(0% at 74% 68%)" },
      {
        clipPath: "circle(150% at 74% 68%)",
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      section.style.clipPath = "";
    };
  }, [sectionRef, heroRef]);
}

/**
 * Convierte `**palabra**` en un span resaltado en cobalto. Markdown casero a
 * propósito: son cuatro líneas de copy fija, no vale la pena traer un parser
 * de markdown completo para esto.
 */
function renderHighlighted(line) {
  return line.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={styles.highlight}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}

/**
 * Revela cada línea del manifiesto palabra por palabra, con máscara (ver
 * useSplitReveal) en vez del fade de opacidad que tenía antes. Un
 * `SplitText` por línea (no uno solo para todo el bloque, que mezclaría
 * las palabras de frases distintas en una sola secuencia de stagger): así
 * cada frase sigue teniendo su propio "momento" al entrar al tercio central
 * de la pantalla, pero ahora con el texto subiendo desde una máscara en vez
 * de aparecer en el lugar.
 *
 * Cambio de idioma: SplitText reescribe el DOM de cada línea (spans por
 * palabra + `aria-label` con el texto original), y cambiar `languaje` NO
 * remonta la sección — React terminaba escribiendo sobre nodos de texto que
 * SplitText ya había movido, y el manifiesto quedaba mezclado ES/EN. Por eso
 * el contenedor lleva `key={languageKey}` (React lo recrea con texto limpio)
 * y este efecto depende de `languageKey` para volver a partir el nodo nuevo.
 */
function useManifestoReveal(containerRef, languageKey) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const container = containerRef.current;
    const lines = container?.querySelectorAll("[data-line]");
    if (!lines?.length) return undefined;

    const splits = Array.from(lines).map((line) =>
      SplitText.create(line, {
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
              stagger: 0.02,
              scrollTrigger: { trigger: line, start: "top 85%", end: "top 45%", scrub: true },
            }
          );
        },
      })
    );

    return () => splits.forEach((split) => split.revert());
  }, [containerRef, languageKey]);
}

/**
 * Intro/manifiesto: texto grande, línea por línea, con palabras clave en
 * cobalto. Fondo claro a propósito — es el respiro entre el cobalto del hero
 * y el morado oscuro de experiencia/proyectos (ver storytelling de color en
 * el resto de las secciones).
 *
 * El contenido real sale de `about.paragraphs` (hechos ya existentes, ver
 * Languajes/*.js) resumido en 2 líneas más abajo; el manifiesto en sí
 * (`landing.intro.manifesto`) es la voz editorial puntual de esta sección,
 * no datos nuevos.
 *
 * `id="about"` (ver revisión, lista de a11y): antes esta sección era
 * `id="intro"` y el nav "Acerca de"/"About" (ver Header, SECTIONS) caía en
 * cambio en `ContactSection` — que también usaba `id="about"` por alias con
 * el Hero clásico (ver su comentario). El resultado era que "Acerca de"
 * saltaba directo a "¿Hablamos?" y esta sección, el "Sobre mí" real, no era
 * alcanzable desde el menú. Ahora el id lo tiene la sección que realmente es
 * "Sobre mí" (consistente con el Hero clásico, que combina about+contacto
 * bajo ese mismo id) y ContactSection pasó a `id="contact"` (ver su
 * comentario) — alcanzable desde el botón dedicado "Hablemos" del Header,
 * no desde este link de nav.
 */
function AboutSection({ languaje, heroRef }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  useManifestoReveal(containerRef, languaje.languaje);
  useDoorReveal(sectionRef, heroRef);

  const { manifesto, kicker } = languaje.landing.intro;

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      {/* Difusor hacia el cobalto del hero, arriba, y hacia el morado de
          experiencia, abajo: el "corte duro" entre secciones se siente menos
          seco con estas franjas de ~128px. */}
      <div aria-hidden="true" className={styles.gradientTop} />
      <div aria-hidden="true" className={styles.gradientBottom} />

      <div className={styles.container}>
        <SectionLabel index={1}>{languaje.landing.sectionLabels.intro}</SectionLabel>

        {/* `<h2>` real, visualmente oculto (ver revisión, lista de a11y):
            el diseño ya comunica "esto es Sobre mí" con el kicker y el
            manifiesto de abajo, pero un lector de pantalla necesita un
            encabezado de verdad para ubicarse en la jerarquía de la
            página, no solo prosa decorativa. */}
        <h2 className={styles.srOnly}>{languaje.about.title}</h2>

        <p className={styles.kicker}>{kicker}</p>

        <div key={languaje.languaje} ref={containerRef} className={styles.manifesto}>
          {manifesto.map((line, index) => (
            <p key={index} data-line className={styles.manifestoLine}>
              {renderHighlighted(line)}
            </p>
          ))}
        </div>

        <div className={styles.paragraphs}>
          {languaje.about.paragraphs.slice(0, 2).map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
