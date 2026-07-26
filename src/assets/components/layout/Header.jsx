import React, { useEffect } from "react";

//import icons
import { FaBars, FaMoon, FaLanguage, FaSun } from "react-icons/fa";
import { IoLanguageOutline } from "react-icons/io5";

//motion framer
import { motion } from "framer-motion";

//react router
import { Link } from "react-router-dom";

//theme
import { useTheme } from "../../../shared/theme";

//efecto vidrio
import { refractive } from "@hashintel/refractive";

function Header({ onDatos, languaje }) {
  //theme — la clase la aplica shared/theme, acá solo se alterna
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!localStorage.getItem("languaje")) {
      const navlang = navigator.language;
      console.log(navlang);
      if (navlang === "e-ES" || navlang === "es") {
        localStorage.setItem("languaje", "es");
        onDatos("es");
      } else {
        localStorage.setItem("languaje", "en");
        onDatos("en");
      }
    } else {
      if (localStorage.getItem("languaje") === "es") {
        onDatos("es");
      } else {
        onDatos("en");
      }
    }
  }, []);

  //handle theme
  const handleTheme = toggleTheme;

  //handle dropdown
  const handleDropdown = (className) => {
    const dropdown = document.querySelector(className);
    dropdown.classList.toggle("hidden");
  };

  //handle languaje
  const handleLanguaje = (lang) => {
    if (lang === "es") {
      localStorage.setItem("languaje", "es");
      onDatos("es");
      handleDropdown(".dropdown");
    } else {
      localStorage.setItem("languaje", "en");
      onDatos("en");
      handleDropdown(".dropdown");
    }
  };

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full fixed z-50 flex justify-center pt-2">
      {/* El fondo va con alpha a propósito: el vidrio refracta lo que pasa por
          detrás, y sobre un color sólido no se vería nada. `radius` es ~la mitad
          del alto de la barra para conservar la forma de píldora, porque
          refractive pisa el borderRadius con ese valor en píxeles. */}
      <refractive.div
        refraction={{ radius: 20, blur: 8, bezelWidth: 8, specularOpacity: 0.4 }}
        className="flex shadow-md dark:bg-[#372D48]/40 bg-[#EFE0F4]/50 py-2 px-10 rounded-full"
      >
        <ul className="items-center dark:text-moonlit font-inter font-bold text-sm hidden md:flex">
          <a className="cursor-pointer" href="#/" onClick={()=>{
            handleScroll("home")
          }}>
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              {languaje.header.home}
            </li>
          </a>
          <a className="cursor-pointer"
            onClick={() => handleScroll("experience")}>
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              {languaje.experience.title}
            </li>
          </a>
          <a
            className="cursor-pointer"
            onClick={() => handleScroll("projects")}
          >
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              {languaje.header.projects}
            </li>
          </a>
          <a className="cursor-pointer" onClick={() => handleScroll("about")}>
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              {languaje.header.about}
            </li>
          </a>
        </ul>
        {/* `relative` explícito: backdrop-filter convierte a la píldora en
            bloque contenedor, así que sin esto el desplegable móvil cambiaría
            de anclaje al aplicar el vidrio. */}
        <div className="relative flex md:hidden">
          <FaBars
            className="w-6 h-6 dark:text-white"
            onClick={() => handleDropdown(".nav-dropdown")}
          />
          {/* nav Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="nav-dropdown absolute top-10 left-5 w-40 h-40 mt-5 bg-white dark:bg-moonlit rounded-lg shadow-md z-10 hidden"
          >
            <ul className="flex flex-col items-center justify-center h-full">
              <li
                onClick={() => {
                  handleScroll("home");
                  handleDropdown(".nav-dropdown");
                }}
                className="cursor-pointer my-2"
              >
                Home
              </li>
              <li
                onClick={() => {
                  handleScroll("projects");
                  handleDropdown(".nav-dropdown");
                }}
                className="cursor-pointer my-2"
              >
                Proyectos
              </li>
              <li
                onClick={() => {
                  handleScroll("about");
                  handleDropdown(".nav-dropdown");
                }}
                className="cursor-pointer my-2"
              >
                Sobre mi
              </li>
            </ul>
          </motion.div>
        </div>
        <div className="flex items-center">
          {theme === "light" ? (
            <FaSun
              onClick={() => handleTheme()}
              className="cursor-pointer mx-5 w-[20px] h-6 text-yellow-500"
            />
          ) : (
            <FaMoon
              onClick={() => handleTheme()}
              className="cursor-pointer mx-5 w-[20px] h-6 text-white"
            />
          )}
          {/* dropdown */}
          <div className="relative">
            <IoLanguageOutline
              className="cursor-pointer lg:w-10 dark:text-moonlit"
              onClick={() => handleDropdown(".dropdown")}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="dropdown absolute top-10 left-5 w-40 h-40 bg-white dark:bg-moonlit rounded-lg shadow-md z-10 hidden"
            >
              <ul className="flex flex-col items-center justify-center h-full">
                <li
                  onClick={() => handleLanguaje("es")}
                  className="cursor-pointer my-2"
                >
                  Español
                </li>
                <li
                  onClick={() => handleLanguaje("en")}
                  className="cursor-pointer my-2"
                >
                  English
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </refractive.div>
    </header>
  );
}

export default Header;
