import React, { useEffect, useState } from "react";

//import icons
import { FaBars, FaMoon, FaLanguage, FaSun } from "react-icons/fa";
import { IoLanguageOutline } from "react-icons/io5";

//motion framer
import { motion } from "framer-motion";

//react router
import { Link } from "react-router-dom";

function Header({ onDatos, languaje }) {
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

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full fixed z-50 flex justify-center pt-2">
      <div className="flex shadow-md dark:bg-dark-grey bg-moonlit py-2 px-10 rounded-full">
        <ul className="items-center dark:text-moonlit font-inter font-bold text-sm hidden md:flex">
          <a className="cursor-pointer" onClick={() => handleScroll("home")}>
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              {languaje.header.home}
            </li>
          </a>
          {/* <a href="">
            <li className="mx-4 transform hover:scale-150 transition-transform duration-200">
              Experiencia
            </li>
          </a> */}
          <a  className="cursor-pointer" onClick={() => handleScroll("projects")}>
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
        <div className="flex md:hidden">
          <FaBars className="w-6 h-6 dark:text-white" />
        </div>
        <div className="flex justify-between items-center">
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
              className="cursor-pointer w-10 dark:text-moonlit"
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
