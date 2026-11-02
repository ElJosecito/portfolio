import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "../ui/SectionLabel";
import { useSplitReveal } from "../ui/useSplitReveal";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";
import { useExperiences } from "../../../../shared/hooks/useExperiences";
import { formatDateRange, isEnglish, localizeExperience } from "../../../../shared/utils/i18n";
import styles from "./ExperienceSection.module.css";

gsap.registerPlugin(ScrollTrigger);

function yearOf(dateValue) {
  if (!dateValue) return null;
  return dateValue.split("-")[0];
}

/**
 * Línea de progreso + reveal por item. Vive en su propio efecto (no en el
 * componente) porque depende de que `experiences` ya haya llegado: antes de
 * eso no hay nada que medir ni animar.
 */
function useTimelineAnimation(listRef, lineRef, itemRefs, ready) {
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;

    const list = listRef.current;
    if (!list) return undefined;

    // `gsap.context` + `ctx.revert()` en vez de solo matar cada
    // ScrollTrigger (ver revisión, P3 "Cleanups incompletos"): matar el
    // trigger no deshace el `opacity`/`transform` que el tween ya había
    // escrito como estilo inline — si el idioma cambia a mitad de scroll
    // (lo que remonta esta sección con la lista de experiencias ya
    // "revelada" a medias), un item podía quedar con `opacity: 0` pegado
    // encima del valor por defecto del nuevo render.
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 75%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }

      itemRefs.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, x: -36 },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "top 60%",
              scrub: true,
            },
          }
        );
      });
    }, list);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}

/**
 * Timeline vertical de experiencia: línea de progreso que se "dibuja" con el
 * scroll (ver useTimelineAnimation) y años gigantes en outline (solo
 * contorno, relleno transparente — el típico truco de
 * `-webkit-text-stroke`) como fondo de cada item.
 *
 * Fondo morado oscuro (plum-800, la identidad del portfolio): es el primer
 * tramo del "capítulo morado" que sigue en ProjectsSection y StackSection,
 * antes de volver al cobalto en el contacto.
 */
function ExperienceSection({ languaje }) {
  const { experiences, loading } = useExperiences();
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef([]);
  const titleRef = useRef(null);

  useTimelineAnimation(listRef, lineRef, itemRefs, !loading && experiences.length > 0);
  // Título palabra por palabra con máscara (ver useSplitReveal) en vez del
  // simple render estático que tenía antes.
  useSplitReveal(titleRef, { start: "top 90%", end: "top 60%", deps: [languaje.experience.title] });

  const english = isEnglish(languaje);

  return (
    <section id="experience" className={styles.section}>
      <div aria-hidden="true" className={styles.gradientTop} />

      <div className={styles.container}>
        <SectionLabel index={2} tone="light">
          {languaje.landing.sectionLabels.experience}
        </SectionLabel>
        <p className={styles.kicker}>{languaje.landing.experience.kicker}</p>

        <h2 key={languaje.experience.title} ref={titleRef} className={styles.title}>{languaje.experience.title}</h2>
        <p className={styles.description}>{languaje.experience.description}</p>

        <div ref={listRef} className={styles.listWrap}>
          {loading ? (
            <p className={styles.loadingText}>{languaje.experience.loading}</p>
          ) : experiences.length === 0 ? (
            <p className={styles.emptyText}>{languaje.experience.empty}</p>
          ) : (
            <>
              {/* Riel base, apagado, siempre visible — la línea animada (ver
                  lineRef) se dibuja encima. */}
              <div className={styles.railBase} aria-hidden="true" />
              <div ref={lineRef} aria-hidden="true" className={styles.railLine} />

              <ul className={styles.list}>
                {experiences.map((experience, index) => {
                  const { title, description } = localizeExperience(experience, languaje);
                  const date = formatDateRange(experience.start_date, experience.end_date, languaje);
                  const year = yearOf(experience.start_date) || "—";

                  return (
                    <li
                      key={experience.id}
                      ref={(node) => {
                        itemRefs.current[index] = node;
                      }}
                      className={styles.item}
                    >
                      {/* Punto sobre el riel */}
                      <span aria-hidden="true" className={styles.dot} />

                      {/* Año gigante en outline, de fondo: puro adorno
                          tipográfico, el dato real va en <time> abajo. */}
                      <span
                        aria-hidden="true"
                        className={styles.yearOutline}
                        style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.14)" }}
                      >
                        {year}
                      </span>

                      <div className={styles.itemContent}>
                        <h3 className={styles.itemTitle}>{title}</h3>
                        <p className={styles.itemCompany}>{experience.company}</p>
                        <time className={styles.itemDate}>{date}</time>
                        <div className={styles.itemDescription}>
                          {description}
                          {experience.link && (
                            <a
                              href={experience.link}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.itemLink}
                            >
                              {english ? "Learn more" : "Saber más"}
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
