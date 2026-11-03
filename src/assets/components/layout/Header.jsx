import React, { useEffect, useRef, useState } from "react";

//import icons
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";

//motion framer
import { AnimatePresence, motion } from "framer-motion";

//vidrio líquido (ver Hero.jsx, mismo patrón: `refractive(Componente)` DEBE
//declararse fuera de cualquier componente — si se creara en cada render,
//el HOC devolvería un tipo nuevo cada vez y React desmontaría/remontaría
//el panel entero en cada render del Header).
import { refractive } from "@hashintel/refractive";

//router
import { Link, useLocation } from "react-router-dom";

//theme
import { useTheme } from "../../../shared/theme";

//link de GitHub real (el mismo que usa el hero clásico y el structured data)
import { SOCIAL_LINKS } from "../../../shared/utils/seo";

//detección de motor de render para el fallback de vidrio (Safari/Firefox)
import { supportsSvgBackdropFilter } from "../../../shared/utils/browserSupport";

// Puente a Lenis: ver el comentario en scrollToSection. Módulo liviano (no
// importa Lenis ni gsap), así que no mete esos paquetes en el chunk
// principal solo por el nav, que el Header monta en TODAS las rutas.
import { scrollToSection } from "../landing/scroll/lenisBridge";

import styles from "./Header.module.css";

const SECTIONS = ["home", "experience", "projects", "about"];

// Fuera del componente: ver comentario de arriba sobre `refractive`.
const GlassBar = refractive(motion.div);
const GlassPill = refractive(motion.span);
const GlassMenu = refractive(motion.div);

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Header global: el nombre en Milker (la tipografía del título del hero) a
 * la izquierda, nav mono en el centro, y a la derecha un link mono + la pill
 * blanca de contacto. Transparente sobre la sección 3D de la portada
 * (texto blanco) y con fondo sólido/blur en cualquier otro momento, para
 * seguir siendo legible sobre el resto del sitio.
 *
 * Vidrio líquido (ver `@hashintel/refractive`, ya usado en Hero.jsx): la
 * barra entera es una pill flotante con efecto de vidrio (`GlassBar`), y
 * los items del nav tienen una pill de vidrio compartida (`GlassPill`) que
 * se desliza al que está en hover/focus — una sola instancia de filtro SVG
 * reusada para todo el nav, no un filtro por botón (más barato). En
 * Safari/Firefox, donde el filtro SVG de refractive no renderiza nada
 * (ver browserSupport.js), se cae a un `backdrop-filter: blur()` + borde
 * sutil con CSS plano — mismo lenguaje visual, menos "líquido".
 *
 * El contraste entre transparente/sólido lo decide un IntersectionObserver
 * sobre `[data-transparent-header="true"]` (ese atributo lo pone el hero del
 * landing nuevo, ver landing/sections/HeroSection): mientras esa sección está
 * en pantalla el header va transparente, apenas se hace scroll más allá —o
 * se está en otra ruta o en el landing clásico, donde ese atributo ni
 * existe— va sólido.
 *
 * `transparentHero` (lo pasa Router según el gate de capacidad, ver
 * deviceCapability.js) es solo para el estado INICIAL: evita el flash de un
 * header transparente por un frame sobre el landing clásico (que no tiene
 * nada transparente detrás) mientras se monta el observer.
 */
function Header({ onDatos, languaje, transparentHero = false }) {
  //theme — la clase la aplica shared/theme, acá solo se alterna
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();
  // Igual que Footer.jsx (`isHome`/`handleNavClick`): los botones de nav de
  // acá llamaban SIEMPRE `scrollToSection` directo, sin importar la ruta.
  // En "/" eso funciona (Lenis montado o `getElementById` encuentra la
  // sección), pero en cualquier otra ruta (`/all-projects`,
  // `/projects/:slug`) no hay ningún id de sección en el DOM — el nav no
  // hacía nada, ni scrolleaba ni navegaba. Ver revisión: bug raíz del "el
  // nav del header no lleva a las secciones". Ahora los items son
  // `<Link to="/#id">` reales: en home se intercepta con `preventDefault`
  // y se usa `scrollToSection` (Lenis); en cualquier otra ruta se deja
  // navegar a "/#id" y el `ScrollToTop` de Router.jsx hace el scroll con
  // reintentos una vez que la sección aparece en el DOM.
  const isHome = location.pathname === "/";

  // La portada nueva no tiene modo claro/oscuro: cada sección trae su propio
  // color por diseño (cobalto, claro, morado, casi negro — el "storytelling
  // de color"), así que el botón de tema no cambiaba nada visible ahí y
  // confundía. Se oculta solo en ese caso; en el resto de las rutas y en la
  // landing clásica el tema sí aplica.
  const showThemeToggle = !(isHome && transparentHero);

  const [transparent, setTransparent] = useState(
    location.pathname === "/" && transparentHero
  );

  // Se resuelve una sola vez (el motor de render de una pestaña no cambia
  // a mitad de sesión): si da falso, el nav entero usa la clase de
  // fallback en vez de montar los filtros SVG de refractive.
  const [glassOk] = useState(() => supportsSvgBackdropFilter());

  // Pill de hover del nav: posición relativa al `<ul>` del item que está en
  // hover/focus. `null` = oculta (nadie en hover).
  const [hoverRect, setHoverRect] = useState(null);

  const trackHover = (event) => {
    const nav = navRef.current;
    if (!nav) return;
    const navBox = nav.getBoundingClientRect();
    const itemBox = event.currentTarget.getBoundingClientRect();
    setHoverRect({ left: itemBox.left - navBox.left, width: itemBox.width });
  };
  const clearHover = () => setHoverRect(null);

  // El idioma activo sale del objeto de traducciones, no de un estado propio:
  // así no hay dos fuentes de verdad que se puedan desincronizar.
  const isSpanish = languaje?.languaje === "Español";

  // El idioma inicial ya lo resolvió el Router antes del primer render con
  // `initLanguage`. Acá solo se cambia cuando el usuario toca ES/EN: hacerlo en
  // un efecto de montaje obligaba a pintar todo en inglés y corregirlo después.

  // Cerrar el menú móvil al tocar afuera o con Escape. Antes los desplegables se
  // abrían con document.querySelector y classList.toggle, así que no había forma
  // de cerrarlos salvo volver a tocar el mismo botón.
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Transparente mientras la sección 3D está en pantalla; sólido en cuanto se
  // la pasa con scroll o se está en cualquier otra ruta donde no existe.
  useEffect(() => {
    if (location.pathname !== "/" || !transparentHero) {
      setTransparent(false);
      return undefined;
    }

    let intersectionObserver;

    const attach = (heroSection) => {
      setTransparent(true);
      // `entry.intersectionRatio >= 0.2`, no `entry.isIntersecting` (ver
      // revisión, punto 18): `isIntersecting` pasa a `true` apenas se cruza
      // CUALQUIER umbral por encima de 0, así que con un solo threshold de
      // 0.2 seguía en `true` hasta que el hero saliera del todo (ratio 0).
      // El header se quedaba transparente sobre "Sobre mí" durante los
      // últimos ~64–80px del hero, con el menú blanco sin fondo encima de
      // una sección clara.
      intersectionObserver = new IntersectionObserver(
        ([entry]) => setTransparent(entry.intersectionRatio >= 0.2),
        { threshold: [0, 0.2, 1] }
      );
      intersectionObserver.observe(heroSection);
    };

    const existingHeroSection = document.querySelector('[data-transparent-header="true"]');
    if (existingHeroSection) {
      attach(existingHeroSection);
      return () => intersectionObserver?.disconnect();
    }

    // El landing nuevo carga su chunk de forma perezosa (ver Router): en el
    // primer render de este efecto el nodo puede todavía no existir —
    // Suspense está mostrando el fallback. Sin este observer, el `return`
    // de abajo (antes solo dejaba `transparent` en false para siempre, ya
    // que nada volvía a disparar este efecto cuando el chunk terminaba de
    // cargar y el nodo real aparecía.
    setTransparent(false);
    const mutationObserver = new MutationObserver(() => {
      const heroSection = document.querySelector('[data-transparent-header="true"]');
      if (heroSection) {
        mutationObserver.disconnect();
        attach(heroSection);
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [location.pathname, transparentHero]);

  // El Router es el que persiste la elección; acá solo se avisa.
  const handleLanguaje = (lang) => onDatos(lang);

  // Se mantiene para el botón de la vitrina (logo → home): ese siempre vive
  // en la misma barra que el resto del nav, pero no necesita `href` propio
  // (ver `brandButton` más abajo, sigue siendo un `<button>` con
  // `handleNavClick` manual para los casos fuera de home).
  const handleNavClick = (event, sectionId) => {
    setMenuOpen(false);
    if (!isHome) return; // deja que el Link navegue a "/#id" normalmente
    event.preventDefault();
    scrollToSection(sectionId);
  };

  // El botón "Hablemos"/"Let's talk" (ver los dos pill de abajo, no son
  // parte de `SECTIONS`) apunta a secciones distintas según la variante: en
  // el landing nuevo el contacto es su propia sección (`ContactSection`,
  // `id="contact"`); en el clásico sigue siendo el mismo bloque combinado
  // de about+contacto de siempre (`Hero.jsx`, `id="about"` — ver revisión,
  // lista de a11y, sobre por qué el landing nuevo dejó de reusar ese id).
  // `transparentHero` ya es la señal que manda el Router para esta misma
  // decisión (ver su comentario), no hace falta una prop nueva.
  const contactSectionId = transparentHero ? "contact" : "about";

  const labelFor = (section) => languaje.header[section];

  const barStateClass = transparent ? styles.barTransparent : styles.barSolid;
  const navStateClass = transparent ? styles.navTransparent : styles.navSolid;
  const iconStateClass = transparent ? styles.iconButtonTransparent : styles.iconButtonSolid;
  const langGroupStateClass = transparent ? styles.langGroupTransparent : styles.langGroupSolid;
  const hoverPillStateClass = transparent ? styles.hoverPillTransparent : styles.hoverPillSolid;

  // Refracción del panel grande (barra/menú) vs. la pill chica de hover: la
  // pill usa un radio más chico y menos blur porque es un rectángulo fino,
  // no una barra entera — los mismos valores para las dos se veían "planos"
  // en la pill, con el borde curvado comiéndose casi todo su alto.
  const barRefraction = { radius: 32, blur: 8, bezelWidth: 14, specularOpacity: 0.3 };
  const pillRefraction = { radius: 18, blur: 4, bezelWidth: 8, specularOpacity: 0.35 };
  const menuRefraction = { radius: 20, blur: 10, bezelWidth: 10, specularOpacity: 0.25 };

  const Bar = glassOk ? GlassBar : motion.div;
  const barProps = glassOk ? { refraction: barRefraction } : {};
  const Pill = glassOk ? GlassPill : motion.span;
  const pillProps = glassOk ? { refraction: pillRefraction } : {};
  const Menu = glassOk ? GlassMenu : motion.div;
  const menuProps = glassOk ? { refraction: menuRefraction } : {};

  // Mismo botón en el cluster de escritorio y en el móvil (antes eran dos
  // copias idénticas); ver `showThemeToggle` arriba sobre cuándo se oculta.
  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? isSpanish ? "Activar modo oscuro" : "Switch to dark mode"
          : isSpanish ? "Activar modo claro" : "Switch to light mode"
      }
      className={cx(styles.iconButton, iconStateClass)}
    >
      {theme === "light" ? (
        <FaSun
          className={cx(styles.sunIcon, transparent ? styles.sunIconTransparent : styles.sunIconSolid)}
        />
      ) : (
        <FaMoon
          className={cx(styles.sunIcon, transparent ? styles.moonIconTransparent : styles.moonIconSolid)}
        />
      )}
    </button>
  );

  return (
    // En la portada nueva (sin botón de tema, ver `showThemeToggle`) el
    // header va SIEMPRE en su variante oscura: con el tema claro guardado, la
    // barra sólida salía blanca opaca sobre secciones moradas/negras en vez
    // del vidrio. La clase `dark` en el propio `<header>` activa las mismas
    // reglas `:global(.dark) .x` del CSS module sin tocar el tema del resto
    // de la página.
    <header className={cx(styles.header, !showThemeToggle && "dark")}>
      <Bar
        {...barProps}
        className={cx(styles.bar, barStateClass, !glassOk && styles.barFallback)}
      >
        {/* Wordmark con el nombre en Milker. Antes era la cabeza 3D en
            miniatura girando, que hacía bajar three.js y el modelo (~650 kB)
            en TODAS las rutas solo por el logo. El `aria-label` del link ya
            dice el nombre + "Inicio", así que el texto visible va
            `aria-hidden` para no leerlo dos veces. */}
        <Link
          to="/#home"
          onClick={(event) => handleNavClick(event, "home")}
          aria-label={`${languaje.hero3d.firstName} ${languaje.hero3d.lastName} — ${languaje.header.home}`}
          className={cx(styles.brandButton, navStateClass)}
        >
          <span aria-hidden="true" className={styles.wordmark}>
            {languaje.hero3d.firstName} {languaje.hero3d.lastName}
          </span>
        </Link>

        {/* nav de escritorio */}
        <ul ref={navRef} className={cx(styles.nav, navStateClass)} onMouseLeave={clearHover}>
          <AnimatePresence>
            {hoverRect && (
              <Pill
                {...pillProps}
                className={cx(styles.hoverPill, hoverPillStateClass, !glassOk && styles.hoverPillFallback)}
                style={glassOk ? undefined : { left: hoverRect.left, width: hoverRect.width }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, left: hoverRect.left, width: hoverRect.width }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
          {SECTIONS.map((section) => (
            <li key={section}>
              <Link
                to={`/#${section}`}
                onClick={(event) => handleNavClick(event, section)}
                onMouseEnter={trackHover}
                onFocus={trackHover}
                className={styles.navItem}
              >
                {labelFor(section)}
              </Link>
            </li>
          ))}
        </ul>

        {/* cluster derecho de escritorio */}
        <div className={styles.rightCluster}>
          {showThemeToggle && themeToggle}

          {/* Selector de idioma: control segmentado en vez de desplegable. Con
              dos opciones, un menú obliga a dos interacciones para algo que se
              resuelve en una, y además esconde cuál está activo. */}
          <div role="group" aria-label={isSpanish ? "Idioma" : "Language"} className={cx(styles.langGroup, langGroupStateClass)}>
            {[
              { code: "es", label: "ES", active: isSpanish },
              { code: "en", label: "EN", active: !isSpanish },
            ].map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => handleLanguaje(option.code)}
                aria-pressed={option.active}
                className={cx(
                  styles.langOption,
                  option.active
                    ? styles.langOptionActive
                    : transparent
                    ? styles.langOptionInactiveTransparent
                    : styles.langOptionInactiveSolid
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <a
            href={SOCIAL_LINKS[0]}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.githubLink, navStateClass)}
            data-umami-event="github"
            data-umami-event-location="header"
          >
            GitHub
          </a>

          <Link
            to={`/#${contactSectionId}`}
            onClick={(event) => handleNavClick(event, contactSectionId)}
            className={styles.contactCta}
            data-umami-event="contact-cta"
            data-umami-event-location="header"
          >
            {labelFor("contact")}
          </Link>
        </div>

        {/* menú móvil */}
        <div className={styles.mobileCluster} ref={menuRef}>
          {showThemeToggle && themeToggle}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={isSpanish ? "Menú" : "Menu"}
            className={cx(styles.iconButton, iconStateClass)}
          >
            {menuOpen ? <FaTimes className={styles.sunIcon} /> : <FaBars className={styles.sunIcon} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <Menu
                {...menuProps}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className={cx(styles.menuPanel, styles.menuPanelGlass, !glassOk && styles.menuPanelFallback)}
              >
                <ul className={styles.menuList}>
                  {SECTIONS.map((section) => (
                    <li key={section}>
                      <Link
                        to={`/#${section}`}
                        onClick={(event) => handleNavClick(event, section)}
                        className={styles.menuItemButton}
                      >
                        {labelFor(section)}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/all-projects"
                      onClick={() => setMenuOpen(false)}
                      className={styles.menuItemButton}
                    >
                      {languaje.header.allProjects}
                    </Link>
                  </li>
                </ul>

                <div className={styles.menuDivider} />

                <div className={styles.menuRow}>
                  <a
                    href={SOCIAL_LINKS[0]}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.menuGithubLink}
                    data-umami-event="github"
                    data-umami-event-location="header-menu"
                  >
                    GitHub
                  </a>

                  <div role="group" aria-label={isSpanish ? "Idioma" : "Language"} className={styles.menuLangGroup}>
                    {[
                      { code: "es", label: "ES", active: isSpanish },
                      { code: "en", label: "EN", active: !isSpanish },
                    ].map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => handleLanguaje(option.code)}
                        aria-pressed={option.active}
                        className={cx(
                          styles.langOption,
                          option.active ? styles.langOptionActive : styles.langOptionInactiveSolid
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.menuContactWrap}>
                  <Link
                    to={`/#${contactSectionId}`}
                    onClick={(event) => handleNavClick(event, contactSectionId)}
                    className={styles.menuContactButton}
                  >
                    {labelFor("contact")}
                  </Link>
                </div>
              </Menu>
            )}
          </AnimatePresence>
        </div>
      </Bar>
    </header>
  );
}

export default Header;
