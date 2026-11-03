import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowUp, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

// Puente a Lenis: el Footer se monta en todas las rutas, igual que el Header
// (ver su mismo import) — sobre el landing nuevo, Lenis intercepta el scroll
// nativo y un `scrollIntoView` directo no alcanza. Módulo liviano, no mete
// Lenis/gsap en el chunk principal.
import { resetScrollPosition, scrollToSection } from "../landing/scroll/lenisBridge";
import { SOCIAL_LINKS, whatsappUrl } from "../../../shared/utils/seo";
import { copyToClipboard } from "../../../shared/utils/clipboard";
import styles from "./Footer.module.css";

const EMAIL = "josemartinezflorimon@gmail.com";

// Mismo Instagram que tenía el Footer en Tailwind — no está en `SOCIAL_LINKS`
// (esa lista solo trae GitHub/LinkedIn, ver seo.js, consumida también por
// structured data), así que se mantiene como literal acá, igual que antes.
const INSTAGRAM_URL = "https://www.instagram.com/josecito.png/";

// Las cinco secciones del nav del footer (Home/Experience/Projects/About
// + Contact aparte, con id dinámico, ver `contactSectionId` más abajo).
// Mismas labels que el Header (`languaje.header.*`), no texto propio.
const NAV_SECTIONS = ["home", "experience", "projects", "about"];

/**
 * Reloj en vivo de La Romana (`America/Santo_Domingo`, GMT-4 todo el año,
 * sin horario de verano). Formateado con `Intl.DateTimeFormat` en vez de
 * aritmética manual de zonas horarias (evita reinventar reglas de DST que
 * ese país no tiene, pero que sí tendrían que considerarse si esto se
 * reusara para otra zona).
 *
 * Se re-sincroniza cada minuto, no cada segundo: el reloj muestra HH:mm, un
 * intervalo de 1s solo gastaría ciclos de render sin cambiar nada visible
 * el 59/60 de las veces.
 */
function useLocalTime(timeZone) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [timeZone]
  );

  const [time, setTime] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    setTime(formatter.format(new Date()));

    // Alineado al siguiente minuto exacto (no un `setInterval` corriendo
    // desde el momento arbitrario en que se montó el Footer) para que el
    // reloj no se vaya atrasando/adelantando un segundo cada vez.
    let intervalId;
    const now = new Date();
    const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    const timeoutId = setTimeout(() => {
      setTime(formatter.format(new Date()));
      intervalId = setInterval(() => setTime(formatter.format(new Date())), 60000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [formatter]);

  return time;
}

/**
 * Pie global. Última impresión del sitio, en el mismo lenguaje visual del
 * landing nuevo (CSS Modules + tokens de `landing/styles/tokens.css`, ver
 * docs/landing-redesign-review.md "Estado") aunque este componente es
 * global y vive fuera de `landing/**` — igual que el Header.
 *
 * Los links de navegación reusan las mismas etiquetas que el Header
 * (`languaje.header.*`) en vez de tener su propio texto fijo.
 *
 * Navegación entre rutas (ver revisión, lista de a11y): cada item es un
 * `<Link to="/#seccion">` de verdad — focable, con `href`, clic derecho →
 * abrir en pestaña nueva. En la portada (`isHome`), el `onClick` intercepta
 * con `preventDefault()` y usa `scrollToSection` (Lenis si está montado)
 * para un scroll suave sin tocar la URL; en cualquier otra ruta se deja que
 * el `Link` navegue normal a "/#seccion" — `ScrollToTop` en Router.jsx lee
 * ese hash al llegar y hace el scroll una vez que la sección existe en el
 * DOM (el landing nuevo carga su chunk de forma perezosa).
 */
// "Telón" (curtain) solo en la portada con el landing nuevo: el contenido
// de `<main>` (ver NewLanding.module.css) sube con `margin-bottom` negativo
// + `padding-bottom` iguales al alto real de este footer (medido acá, ver
// el efecto de abajo) y este footer queda `position: sticky; bottom: 0`
// debajo de ese padding — a medida que se termina de scrollear, el borde de
// abajo del contenido se corre hacia arriba y "descubre" el footer que ya
// estaba ahí, en vez de que el footer aparezca simplemente al final del
// documento como un bloque más. En cualquier otra ruta (`curtain=false`,
// el valor por defecto) este footer sigue siendo un `<footer>` normal, en
// flujo — nada de esto se activa.
function Footer({ languaje, curtain = false, contactSectionId = "about" }) {
  const [year, setYear] = useState(0);
  const [copied, setCopied] = useState(false);
  const footerRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const localTime = useLocalTime("America/Santo_Domingo");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!curtain) return undefined;
    const el = footerRef.current;
    if (!el) return undefined;

    // Medido, no fijo a mano: el contenido real (año, links, idioma) puede
    // cambiar de alto entre ES/EN o al ajustar el viewport, y un número
    // fijo se hubiera desincronizado de la altura real tarde o temprano.
    const updateHeight = () =>
      document.documentElement.style.setProperty("--footer-height", `${el.offsetHeight}px`);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty("--footer-height");
    };
  }, [curtain]);

  const handleNavClick = (event, sectionId) => {
    if (!isHome) return; // deja que el Link navegue a "/#seccion" normalmente
    event.preventDefault();
    scrollToSection(sectionId);
  };

  const handleBackToTop = () => {
    resetScrollPosition();
  };

  const handleCopyEmail = async (event) => {
    event.preventDefault();
    const ok = await copyToClipboard(EMAIL);
    if (ok) {
      setCopied(true);
      toast.success(languaje?.landing?.contact?.emailCopied, {
        duration: 2500,
        position: "bottom-right",
      });
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  const labelFor = (section) => languaje?.header?.[section] ?? section;

  const navItems = [
    ...NAV_SECTIONS.map((section) => ({ id: section, label: labelFor(section) })),
    { id: contactSectionId, label: labelFor("contact") },
  ];

  // "Todos los proyectos": a diferencia de los de arriba, no es un anchor de
  // sección (`/#id`) sino una ruta real — no pasa por `handleNavClick`.
  const allProjectsLabel = languaje?.header?.allProjects ?? "All projects";

  return (
    <footer
      ref={footerRef}
      className={`${styles.footer}${curtain ? ` ${styles.footerCurtain}` : ""}`}
    >
      <div className={styles.inner}>
        <div className={styles.topGrid}>
          {/* (1) CTA + email gigante */}
          <div className={styles.cell}>
            <p className={styles.label}>{languaje?.footer?.cta}</p>
            <a
              href={`mailto:${EMAIL}`}
              data-umami-event="email-copy"
              data-umami-event-location="footer"
              onClick={handleCopyEmail}
              className={styles.emailButton}
            >
              <MdAlternateEmail className={styles.emailIcon} aria-hidden="true" />
              <span className={styles.emailText}>{EMAIL}</span>
            </a>
            <span className={styles.copyHint}>
              {copied ? languaje?.landing?.contact?.emailCopied : languaje?.landing?.contact?.copyEmail}
            </span>
          </div>

          {/* (2) navegación */}
          <nav className={styles.cell} aria-label={languaje?.footer?.navAriaLabel}>
            <p className={styles.label}>{labelFor("home")}</p>
            <ul className={styles.navList}>
              {navItems.map(({ id, label }) => (
                <li key={id}>
                  <Link
                    to={`/#${id}`}
                    onClick={(event) => handleNavClick(event, id)}
                    className={styles.navLink}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/all-projects" className={styles.navLink}>
                  {allProjectsLabel}
                </Link>
              </li>
            </ul>
          </nav>

          {/* (3) redes */}
          <div className={styles.cell} aria-label={languaje?.footer?.socialsAriaLabel}>
            <p className={styles.label}>{languaje?.footer?.socialsAriaLabel}</p>
            <ul className={styles.socialList}>
              <li>
                <a
                  href={SOCIAL_LINKS[0]}
                  data-umami-event="github"
                  data-umami-event-location="footer"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  <FaGithub className={styles.socialIcon} aria-hidden="true" />
                  <span>GitHub</span>
                  <span className={styles.socialArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS[1]}
                  data-umami-event="linkedin"
                  data-umami-event-location="footer"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  <FaLinkedin className={styles.socialIcon} aria-hidden="true" />
                  <span>LinkedIn</span>
                  <span className={styles.socialArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(languaje?.landing?.contact?.whatsappMessage)}
                  data-umami-event="whatsapp"
                  data-umami-event-location="footer"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  <FaWhatsapp className={styles.socialIcon} aria-hidden="true" />
                  <span>WhatsApp</span>
                  <span className={styles.socialArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  data-umami-event="instagram"
                  data-umami-event-location="footer"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  <FaInstagram className={styles.socialIcon} aria-hidden="true" />
                  <span>Instagram</span>
                  <span className={styles.socialArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* (4) hora local + disponibilidad */}
          <div className={styles.cell}>
            <p className={styles.label}>
              {languaje?.footer?.localTimeLabel} — {languaje?.footer?.location}
            </p>
            <p className={styles.clock}>{localTime}</p>
            <p className={styles.availability}>
              <span className={styles.availabilityDot} aria-hidden="true" />
              {languaje?.footer?.availability}
            </p>
          </div>
        </div>

        {/* wordmark gigante */}
        <p className={styles.wordmark} aria-hidden="true">
          <span>JOSÉ</span> <span>MARTÍNEZ</span>
        </p>

        {/* barra inferior */}
        <div className={styles.bottomBar}>
          <p className={styles.rights}>
            © {year} Jose Martinez. {languaje?.footer?.rights}
          </p>
          <p className={styles.builtWith}>{languaje?.footer?.builtWith}</p>
          <button type="button" onClick={handleBackToTop} className={styles.backToTop}>
            {languaje?.footer?.backToTop}
            <FaArrowUp className={styles.backToTopIcon} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
