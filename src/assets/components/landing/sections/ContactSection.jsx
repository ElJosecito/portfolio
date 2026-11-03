import React, { forwardRef, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";
import { FaCopy, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import SectionLabel from "../ui/SectionLabel";
import GrainOverlay from "../ui/GrainOverlay";
import { useMagnetic } from "../ui/useMagnetic";
import { useSplitReveal } from "../ui/useSplitReveal";
import { HeadArrow, SocialsStar, TitleDoodles } from "./ContactDoodles";
import { useDoodles } from "../ui/doodles/useDoodles";
import { SOCIAL_LINKS, whatsappUrl } from "../../../../shared/utils/seo";
import { copyToClipboard } from "../../../../shared/utils/clipboard";
import styles from "./ContactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Telón de color entre "capítulos" (ver docs/landing-redesign-review.md,
 * idea de pulido "cambios de color entre secciones"): Contacto vuelve al
 * cobalto después del morado oscuro de Stack, un salto de color más fuerte
 * que el resto de las transiciones del landing (que usan franjas de
 * degradé, ver `topGradient` más abajo). Un velo del color de Stack
 * (`--color-plum-950`) cubre el contacto al entrar y se "abre" con
 * `clip-path: inset()` de arriba hacia abajo mientras se sigue scrolleando
 * dentro de esta misma sección — el cobalto de Contacto queda debajo todo
 * el tiempo, el velo es lo único que se mueve.
 */
function useChapterWipe(sectionRef) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    const wipe = section?.querySelector("[data-chapter-wipe]");
    if (!wipe) return undefined;

    const tween = gsap.fromTo(
      wipe,
      { clipPath: "inset(0% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 100% 0%)",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "top 20%", scrub: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [sectionRef]);
}


/**
 * Cierre del landing: CTA gigante, botón magnético y el email a copiar.
 * Vuelve al cobalto del hero (ver storytelling de color en el resto de las
 * secciones) — el viaje de la cabeza también cierra acá: en escritorio
 * se para de frente en el ~24% derecho (ver useHeadRig,
 * CONTACT_SIDE): por eso el texto va alineado a la izquierda ahí.
 *
 * `id="contact"` (ver revisión, lista de a11y): antes era `id="about"`, el
 * mismo que usa el Hero clásico para su bloque combinado de about+contacto.
 * Eso hacía que el nav "Acerca de/About" del Header saltara acá en vez de a
 * `AboutSection` (el "Sobre mí" real, ver su comentario) — confuso, porque
 * esta sección es solo el CTA de contacto, no "acerca de" nada. Se llega
 * acá desde el botón dedicado "Hablemos" del Header (ver handleScroll en
 * Header.jsx), no desde el link de nav "Acerca de".
 */
const ContactSection = forwardRef(function ContactSection({ languaje, email, rig }, ref) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef(null);
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  useMagnetic(buttonRef, 0.3);
  useSplitReveal(titleRef, { start: "top 90%", end: "top 60%", deps: [languaje.landing.contact.ctaTitle] });
  useChapterWipe(sectionRef);
  // Termina cuando la sección queda centrada: el mismo momento en que la
  // cabeza llega a su pose (ver useHeadRig, `end: "center center"`).
  useDoodles(sectionRef, { start: "top 55%", end: "center center", deps: [languaje.languaje] });

  const setRefs = (node) => {
    sectionRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const { ctaTitle, ctaSubtitle, copyEmail: copyLabel, emailCopied } = languaje.landing.contact;

  const handleCopy = async () => {
    const ok = await copyToClipboard(email);
    if (ok) {
      setCopied(true);
      toast.success(emailCopied, { duration: 2500, position: "bottom-right" });
    }
  };

  return (
    <section
      ref={setRefs}
      id="contact"
      className={styles.section}
    >
      <div aria-hidden="true" data-chapter-wipe className={styles.chapterWipe} />
      <div aria-hidden="true" className={styles.topGradient} />
      <GrainOverlay />

      <HeadArrow note={languaje.landing.contact.headNote} rig={rig} sectionRef={sectionRef} />

      <div className={styles.inner}>
        <SectionLabel index={5} tone="light">
          {languaje.landing.sectionLabels.contact}
        </SectionLabel>

        {/* Wrapper aparte para el garabato: el `<h2>` lo parte SplitText y se
            recrea por idioma (`key`), así que el SVG no puede vivir adentro. */}
        <div className={styles.titleWrap}>
          <h2 key={ctaTitle} ref={titleRef} className={styles.title}>{ctaTitle}</h2>
          <TitleDoodles />
        </div>
        <p className={styles.subtitle}>{ctaSubtitle}</p>

        <div className={styles.ctaWrapper}>
          <button
            ref={buttonRef}
            type="button"
            onClick={handleCopy}
            className={styles.copyButton}
            data-umami-event="email-copy"
            data-umami-event-location="contact"
          >
            <MdAlternateEmail className={styles.emailIcon} />
            {email}
            <FaCopy className={`${styles.copyIcon} ${copied ? styles.copyIconCopied : ""}`} />
          </button>
          <span className={styles.copyLabel}>{copyLabel}</span>
        </div>

        <div className={styles.socials}>
          <SocialsStar />
          <a
            href={SOCIAL_LINKS[0]}
            data-umami-event="github"
            data-umami-event-location="contact"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <FaGithub className={styles.socialIcon} />
          </a>
          <a
            href={SOCIAL_LINKS[1]}
            data-umami-event="linkedin"
            data-umami-event-location="contact"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <FaLinkedin className={styles.socialIcon} />
          </a>
          <a
            href={whatsappUrl(languaje.landing.contact.whatsappMessage)}
            data-umami-event="whatsapp"
            data-umami-event-location="contact"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            aria-label={languaje.landing.contact.whatsapp}
          >
            <FaWhatsapp className={styles.socialIcon} />
          </a>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;
