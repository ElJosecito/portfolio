import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "../ui/SectionLabel";
import { useSplitReveal } from "../ui/useSplitReveal";
import { hasHoverPointer, prefersReducedMotion } from "../../hero3d/motionPreferences";
import { useProjects } from "../../../../shared/hooks/useProjects";
import { localizeProject } from "../../../../shared/utils/i18n";
import { projectTransitionName, viewTransitionLinkProps } from "../../../../shared/utils/viewTransition";
import styles from "./ProjectsSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cards apiladas con `position: sticky` (opción B del rediseño, ver
 * revisión — "Rediseño de Proyectos"). Reemplaza al riel horizontal pineado
 * con `useHorizontalGallery` + `gsap.set` en `onUpdate`, que traía varios
 * bugs encadenados:
 *  - la cabeza 3D reapareciendo en medio del pin (orden de refresh de
 *    ScrollTrigger + tres tweens peleando por `presence`, puntos 1 y 3);
 *  - la última card recortada al final del pin (punto 4);
 *  - texto cortado al forzar la sección a `h-screen` (punto 5);
 *  - navegación/teclado rotos dentro de `overflow-hidden` con el pin activo
 *    (punto 11).
 *
 * Sin pin, sin spacer, sin cálculo de distancias: cada card es un bloque
 * normal del documento, con su propio `top` sticky que la deja un poco más
 * abajo que la anterior (ver `--card-step` más abajo). A medida que la
 * siguiente card "la tapa" entrando por abajo, un tween con scrub la achica
 * un poco y la atenúa — el efecto de pila de tarjetas.
 *
 * `relative z-30 isolate` en la sección (la misma convención que ya usan el
 * resto de las secciones del landing nuevo) es lo que hace que la cabeza 3D
 * compartida "se meta debajo" de Proyectos en vez de dibujarse encima: un
 * fondo opaco con su propio contexto de apilamiento tapa cualquier cosa en
 * un z-index menor que esté detrás, sin que este archivo tenga que saber
 * nada de la cabeza (ver useHeadRig).
 */
function useStackedCards(sectionRef, cardRefs, cardCount) {
  useEffect(() => {
    if (!cardCount || prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    // `gsap.context` agrupa todos los tweens/ScrollTriggers creados dentro
    // del callback y los revierte juntos en el cleanup — una sola llamada,
    // sin tener que acordarse de matar cada trigger por separado ni de
    // dejar un tween "vivo" si el componente se desmonta a mitad de scroll.
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);

      cards.forEach((card, index) => {
        const nextCard = cards[index + 1];
        if (!nextCard) return; // la última card nunca se achica: nada la tapa.

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            // El trigger es la SIGUIENTE card, no esta: con `position:
            // sticky` (sin pin de gsap) el propio elemento no se mueve una
            // vez "pegado", así que animar su progreso contra sí mismo no
            // da una ventana de scroll útil. La card de abajo sí viaja
            // normalmente por el documento mientras esta sigue pegada en su
            // `top`, así que su recorrido es la medida real de "cuánto se
            // está tapando" a la de arriba.
            trigger: nextCard,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, cardRefs, cardCount]);
}

/**
 * Las imágenes que suben los proyectos a Supabase son MOCKUPS: una compu/
 * monitor con el sitio adentro, con su propio fondo ya incluido en el PNG
 * (~1.6–1.78 de aspect ratio, todas horizontales). `object-contain` sobre su
 * propia superficie para que el mockup se vea completo y grande, sin que un
 * `object-cover` le recorte el monitor.
 *
 * El parallax por mouse se evalúa UNA vez por instancia, no en cada
 * `mousemove` (ver revisión, "Detalles menores"): antes `handleMouseMove`
 * llamaba a `prefersReducedMotion()` (un `matchMedia` nuevo) en cada evento,
 * trabajo repetido para una respuesta que no cambia mientras dura el hover.
 * `hasHoverPointer()` además evita el bug real en touch: en un dispositivo
 * táctil `mousemove`/`mouseleave` pueden disparar sintéticamente después de
 * un tap sin que llegue el `mouseleave` correspondiente, y la imagen se
 * quedaba "pegada" con el último transform (ver revisión, misma sección).
 */
function ProjectImage({ src, alt, transitionName }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const parallaxEnabled = hasHoverPointer() && !prefersReducedMotion();

  const handleMouseMove = (event) => {
    if (!parallaxEnabled) return;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;

    const rect = wrapper.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `translate3d(${nx * -14}px, ${ny * -10}px, 0) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = "";
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={parallaxEnabled ? handleMouseMove : undefined}
      onMouseLeave={parallaxEnabled ? handleMouseLeave : undefined}
      // `max-h` en svh: tope de seguridad para pantallas bajas (laptop
      // 1366×768, celular apaisado) — sin él, el mockup solo crece con el
      // ancho y la card vuelve a pasarse del alto de la pantalla.
      className={styles.imageWrapper}
    >
      <div aria-hidden="true" className={styles.imageOverlay} />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        title={alt}
        loading="lazy"
        decoding="async"
        className={styles.image}
        style={transitionName ? { viewTransitionName: transitionName } : undefined}
      />
    </div>
  );
}

/**
 * Proyectos destacados, ahora en cards apiladas verticalmente. Sigue el
 * "capítulo morado" que empezó en ExperienceSection, un tono más oscuro
 * (plum-900) para que las capturas de los proyectos (que traen sus propios
 * colores) sean lo que resalte, no el fondo.
 */
function ProjectsSection({ languaje }) {
  const { projects, loading } = useProjects({ featuredOnly: true });
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const titleRef = useRef(null);

  useStackedCards(sectionRef, cardRefs, projects.length);
  useSplitReveal(titleRef, { start: "top 90%", end: "top 60%" });

  return (
    <section
      id="projects"
      ref={sectionRef}
      // Misma convención que el resto de las secciones del landing nuevo:
      // `isolation: isolate` es lo que tapa a la cabeza 3D compartida sin
      // que este componente tenga que saber nada de ella (ver useHeadRig).
      className={styles.section}
    >
      <div className={styles.header}>
        <SectionLabel index={3} tone="light">
          {languaje.landing.sectionLabels.projects}
        </SectionLabel>
        <p className={styles.kicker}>{languaje.landing.projects.kicker}</p>
        <h2 ref={titleRef} className={styles.title}>{languaje.projects.title}</h2>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.loadingText}>{languaje.projects.loading}</p>
        ) : projects.length === 0 ? (
          <p className={styles.emptyText}>{languaje.projects.empty}</p>
        ) : (
          projects.map((project, index) => {
            const { name, description } = localizeProject(project, languaje);
            return (
              <Link
                key={project.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                to={`/projects/${project.slug}`}
                data-cursor="view"
                style={{
                  top: `calc(var(--header-offset) + ${index} * var(--card-step))`,
                }}
                // Custom properties responsivas en vez de JS: el alto real
                // del header fijo (ver layout/Header.jsx, `h-16 sm:h-20`) y
                // el paso entre cards son los únicos dos números que
                // cambian por breakpoint — todo lo demás (estructura,
                // chips, mockup grande) es igual en mobile y escritorio, tal
                // como pide la revisión.
                // La card entera TIENE que caber en pantalla mientras está
                // pegada: si mide más que el viewport, su parte de abajo
                // queda fuera de vista y la siguiente card la tapa antes de
                // que se pueda leer (era justo el bug: solo la última, que
                // nadie tapa, mostraba su información). Por eso en escritorio
                // va en dos columnas (info | mockup) en vez de apilar el
                // mockup a todo el ancho con el texto abajo, y en mobile el
                // texto va ARRIBA y el mockup tiene un alto máximo.
                className={styles.card}
                // `unstable_viewTransition` envuelve la navegación en
                // `document.startViewTransition` cuando el navegador lo
                // soporta (y nadie pidió reduced motion, ver
                // shared/utils/viewTransition.js); el gsap stacking tween y
                // el cursor custom (`data-cursor="view"`) de arriba no se
                // tocan, siguen funcionando igual.
                {...viewTransitionLinkProps()}
              >
                <div className={styles.info}>
                  <div className={styles.meta}>
                    <span className={styles.index}>
                      {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
                    </span>
                    {project.platforms.length > 0 && (
                      <span className={styles.platforms}>
                        {project.platforms.map((platform) => (
                          <span key={platform} className={styles.platformBadge}>
                            {languaje.projects.filters[platform] || platform}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.name}>{name}</h3>
                  {/* Recortada a propósito (con "…"): la descripción completa
                      vive en la página del proyecto, y un párrafo largo acá
                      volvería a hacer la card más alta que la pantalla. */}
                  <p className={styles.description}>{description}</p>

                  {project.techIcons.length > 0 && (
                    <div className={styles.techList}>
                      {project.techIcons.map((tech) => (
                        <span key={tech.name}>{tech.name}</span>
                      ))}
                    </div>
                  )}

                  <span className={styles.viewProjectArrow}>
                    {languaje.landing.projects.viewProject} →
                  </span>
                </div>

                <ProjectImage
                  src={project.image}
                  alt={name}
                  transitionName={projectTransitionName(project.slug)}
                />
              </Link>
            );
          })
        )}
      </div>

      {/* Link a /all-projects después de las cards apiladas: la landing
          clásica ya tenía su propio link a esta misma ruta (ver Hero.jsx,
          `projectsBtn`), acá solo destacan los proyectos "featured" (ver
          `useProjects({ featuredOnly: true })` arriba) — sin este link no
          hay forma de llegar al resto desde la landing nueva. */}
      <div className={styles.seeAllWrap}>
        <Link
          to="/all-projects"
          data-cursor="view"
          className={styles.seeAllLink}
          {...viewTransitionLinkProps()}
        >
          {languaje.landing.projects.seeAll} →
        </Link>
      </div>
    </section>
  );
}

export default ProjectsSection;
