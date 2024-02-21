import React, { useEffect, useState } from "react";

//import icons
import { FaBars, FaMoon, FaLanguage, FaSun } from "react-icons/fa";

function Header() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  });

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  
  }, [theme]);

  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
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
          <FaLanguage className="cursor-pointer w-[25px] h-6 dark:text-white text-dark-grey" />
        </div>
      </div>
    </header>
  );
}

export default Header;
