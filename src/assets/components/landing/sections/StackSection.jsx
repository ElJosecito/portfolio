import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "../ui/SectionLabel";
import { Doodle, DoodleNote } from "../ui/doodles/Doodle";
import { useDoodles } from "../ui/doodles/useDoodles";
import { useSplitReveal } from "../ui/useSplitReveal";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";
import { STACK_AREAS } from "./stackData";
import styles from "./StackSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Resuelve el label de un item de la grilla: casi todos son nombres propios
 * de tecnología (no se traducen, ver stackData.js), salvo "Módulos nativos
 * (Swift/Kotlin)" que es una frase y sí tiene versión ES/EN — por eso ese
 * item lleva `translationKey` en vez de `label` y se busca acá contra
 * `languaje.landing.stack`.
 */
function resolveLabel(item, languaje) {
  if (item.translationKey) return languaje.landing.stack[item.translationKey];
  return item.label;
}

/**
 * Revela las cards con un fade + translate sutil y stagger, atado al
 * scroll — igual idea que `useSplitReveal` para el título, pero en
 * elementos enteros en vez de palabras. `fromTo` con `immediateRender:
 * false` (ver gotcha conocido: un `to` sobre algo que arranca oculto por
 * `data-awaiting-intro` en otras secciones grababa mal el valor inicial;
 * acá no hay esa condición pero se mantiene la misma precaución por
 * consistencia y porque es gratis).
 */
function useStackCardsReveal(sectionRef, cardsRef) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return undefined;

    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.6,
        immediateRender: false,
        stagger: 0.1,
        // Sin esto, gsap deja `transform`/`opacity` como estilo INLINE en
        // cada card para siempre — y un estilo inline le gana siempre a la
        // regla `:hover` del CSS module (ver StackSection.module.css), así
        // que el hover de la tarea (lift sutil) nunca se habría visto tras
        // terminar el reveal. `clearProps` borra esos inline styles una vez
        // que el tween termina, dejando que el CSS vuelva a tener el
        // control.
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [sectionRef, cardsRef]);
}

/**
 * Una card de área: label mono chiquito, la tecnología "featured" grande
 * con ícono, y el resto como lista real (`<ul>/<li>`, no divs con role)
 * para que un lector de pantalla la anuncie como lista. `aria-hidden` en
 * cada ícono porque el nombre ya está en el texto al lado — el ícono es
 * puramente decorativo, no información adicional.
 */
function StackCard({ area, languaje, cardRef }) {
  const { Icon: FeaturedIcon } = area.featured;

  return (
    <div ref={cardRef} className={styles.card}>
      <p className={styles.cardLabel}>{languaje.landing.stack.areas[area.labelKey]}</p>

      <div className={styles.featured}>
        {FeaturedIcon ? <FeaturedIcon aria-hidden="true" className={styles.featuredIcon} /> : null}
        <span className={styles.featuredLabel}>{area.featured.label}</span>
        {/* Claude Code marcado a mano: es la herramienta del día a día (ver CV,
            desarrollo asistido por IA). Solo en esta card. */}
        {area.id === "aiTools" ? (
          <>
            <Doodle shape="circle" order={3} className={styles.doodleCircle} />
            <DoodleNote order={4} className={styles.doodleNote}>
              {languaje.landing.doodles.stackNote}
            </DoodleNote>
          </>
        ) : null}
      </div>

      <ul className={styles.techList}>
        {area.items.map((item, index) => {
          const label = resolveLabel(item, languaje);
          const { Icon } = item;
          return (
            <li key={index} className={styles.techItem}>
              {Icon ? (
                <Icon aria-hidden="true" className={styles.techIcon} />
              ) : (
                <span aria-hidden="true" className={styles.techDot} />
              )}
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Cierre del "capítulo morado" (ver Experience/Projects): el fondo más
 * oscuro de la paleta, plum-950, justo antes de volver al cobalto en el
 * contacto.
 *
 * Rediseño (ver ticket): las dos filas de marquee con las mismas 5
 * tecnologías se sentían sparse y costaban de leer en movimiento — se
 * reemplazan por una grilla de 4 cards por área (iOS nativo, multi-
 * plataforma, frontend, IA y herramientas), con más tecnologías reales
 * y texto estático y legible. El marquee no se tira: se muda al pie del
 * hero (ver HeroStackStrip.jsx) donde sí tiene sentido como decorado de
 * fondo, no como contenido a leer.
 */
function StackSection({ languaje }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  useSplitReveal(titleRef, { start: "top 90%", end: "top 60%", deps: [languaje.landing.stack.title] });
  useStackCardsReveal(sectionRef, cardsRef);
  useDoodles(sectionRef, { start: "top 70%", end: "top 15%", deps: [languaje.languaje] });

  return (
    <section id="stack" ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <SectionLabel index={4} tone="light">
          {languaje.landing.sectionLabels.stack}
        </SectionLabel>
        {/* Wrapper para los trazos: el `<h2>` lo parte SplitText y se recrea
            por idioma (`key`), así que no pueden vivir adentro. */}
        <div className={styles.titleWrap}>
          <h2 key={languaje.landing.stack.title} ref={titleRef} className={styles.title}>
            {languaje.landing.stack.title}
          </h2>
          <Doodle shape="check" order={1} className={styles.doodleCheck} />
          <Doodle shape="rays" order={2} className={styles.doodleRays} />
        </div>
        <p className={styles.subtitle}>{languaje.landing.stack.subtitle}</p>
      </div>

      <div className={styles.grid}>
        {STACK_AREAS.map((area, index) => (
          <StackCard
            key={area.id}
            area={area}
            languaje={languaje}
            cardRef={(node) => {
              cardsRef.current[index] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default StackSection;
