import React, { useEffect, useState } from "react";

//import icons
import { FaBars, FaMoon, FaLanguage, FaSun } from "react-icons/fa";

//motion framer
import { motion } from "framer-motion";

function Header({onDatos}) {
  //theme
  const [theme, setTheme] = useState(() => {
    if (!localStorage.getItem("theme")) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        localStorage.setItem("theme", "dark");
        return "dark";
      } else {
        localStorage.setItem("theme", "light");
        return "light";
      }
    } else {
      return localStorage.getItem("theme");
    }
  });

  //set theme
  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  }, [theme]);

  //handle theme
  const handleTheme = () => {
    if (theme === "light") {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  //handle dropdown
  const handleDropdown = () => {
    const dropdown = document.querySelector(".dropdown");
    dropdown.classList.toggle("hidden");
  };

  //handle languaje
  const handleLanguaje = (languaje) => {
    if (languaje === "es") {
      onDatos("es");
      handleDropdown();
    } else {
      onDatos("en");
      handleDropdown();
    }
  };

  return (
    <header className="w-full absolute flex justify-center pt-5">
      <div className="flex shadow-md dark:bg-dark-grey bg-moonlit py-2 px-10 rounded-full">
        <ul className=" items-center dark:text-moonlit font-inter font-bold text-sm hidden md:flex">
          <a href="">
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              Inicio
            </li>
          </a>
          <a href="">
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              Experiencia
            </li>
          </a>
          <a href="">
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              Proyectos
            </li>
          </a>
          <a href="">
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              Sobre mi
            </li>
          </a>
          <a href="">
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              Contacto
            </li>
          </a>
        </ul>
        <div className="flex md:hidden">
          <FaBars className="w-6 h-6 dark:text-white" />
        </div>
        <div className="flex justify-end md:ml-10">
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
            <FaLanguage
              className="cursor-pointer mx-5 w-[20px] h-6 dark:text-moonlit"
              onClick={() => handleDropdown()}
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
      </div>
    </header>
  );
}

export default Header;
