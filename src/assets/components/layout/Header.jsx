import React, { useEffect, useRef, useState } from "react";

//import icons
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";

//motion framer
import { AnimatePresence, motion } from "framer-motion";

//theme
import { useTheme } from "../../../shared/theme";

//efecto vidrio
import { refractive } from "@hashintel/refractive";

const GlassBar = refractive(motion.div);

const SECTIONS = ["home", "experience", "projects", "about"];

function Header({ onDatos, languaje }) {
  //theme — la clase la aplica shared/theme, acá solo se alterna
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // El idioma activo sale del objeto de traducciones, no de un estado propio:
  // así no hay dos fuentes de verdad que se puedan desincronizar.
  const isSpanish = languaje?.languaje === "Español";

  useEffect(() => {
    if (!localStorage.getItem("languaje")) {
      const navlang = navigator.language;
      const lang = navlang?.startsWith("es") ? "es" : "en";
      localStorage.setItem("languaje", lang);
      onDatos(lang);
    } else {
      onDatos(localStorage.getItem("languaje") === "es" ? "es" : "en");
    }
  }, []);

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

  const handleLanguaje = (lang) => {
    localStorage.setItem("languaje", lang);
    onDatos(lang);
  };

  const handleScroll = (sectionId) => {
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const labelFor = (section) => languaje.header[section];

  return (
    <header className="w-full fixed z-50 flex justify-center pt-3 px-4">
      {/* El fondo va con alpha a propósito: el vidrio refracta lo que pasa por
          detrás, y sobre un color sólido no se vería nada. `radius` es ~la mitad
          del alto de la barra para conservar la forma de píldora, porque
          refractive pisa el borderRadius con ese valor en píxeles. */}
      <GlassBar
        refraction={{ radius: 28, blur: 10, bezelWidth: 10, specularOpacity: 0.5 }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex items-center gap-2 rounded-full border border-white/50 bg-[#EFE0F4]/50 px-3 py-2.5 shadow-lg dark:border-white/10 dark:bg-[#372D48]/40 sm:gap-4 sm:px-5"
      >
        {/* navegación de escritorio */}
        <ul className="hidden items-center text-sm font-bold dark:text-moonlit md:flex">
          {SECTIONS.map((section) => (
            <li key={section}>
              <button
                type="button"
                onClick={() => handleScroll(section)}
                className="mx-3 rounded-full px-1 py-0.5 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#549eff]"
              >
                {labelFor(section)}
              </button>
            </li>
          ))}
        </ul>

        {/* botón de menú móvil */}
        <div className="relative flex md:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Menú"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#549eff] dark:text-white dark:hover:bg-white/10"
          >
            {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 top-12 w-44 overflow-hidden rounded-2xl border border-white/50 bg-[#EFE0F4]/95 py-1 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#372D48]/95 dark:text-moonlit"
              >
                {SECTIONS.map((section) => (
                  <li key={section}>
                    <button
                      type="button"
                      onClick={() => handleScroll(section)}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#6a4279]/15 focus-visible:outline-none focus-visible:bg-[#6a4279]/15"
                    >
                      {labelFor(section)}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <span className="h-6 w-px bg-black/10 dark:bg-white/15" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#549eff] dark:hover:bg-white/10"
          >
            {theme === "light" ? (
              <FaSun className="h-5 w-5 text-yellow-500" />
            ) : (
              <FaMoon className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Selector de idioma: control segmentado en vez de desplegable. Con
              dos opciones, un menú obliga a dos interacciones para algo que se
              resuelve en una, y además esconde cuál está activo. */}
          <div
            role="group"
            aria-label="Idioma"
            className="flex items-center rounded-full bg-black/5 p-0.5 text-xs font-bold dark:bg-white/10"
          >
            {[
              { code: "es", label: "ES", active: isSpanish },
              { code: "en", label: "EN", active: !isSpanish },
            ].map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => handleLanguaje(option.code)}
                aria-pressed={option.active}
                className={`rounded-full px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#549eff] ${
                  option.active
                    ? "bg-[#6a4279] text-white shadow-sm"
                    : "text-dark-grey/60 hover:text-dark-grey dark:text-moonlit/60 dark:hover:text-moonlit"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </GlassBar>
    </header>
  );
}

export default Header;
