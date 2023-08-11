import React from "react";
import Hero from "./assets/components/Hero";
import Contact from "./assets/components/Contact";
import Footer from "./assets/components/Footer";

import { HashLink } from "react-router-hash-link";
import { useState, useEffect } from "react";


function Router() {

  const [navBtn, setNavBtn] = useState(false)


  const handlenav = () => {
    if(navBtn){
      setNavBtn(false)
    }else{
      setNavBtn(true)
    }
  }

  useEffect(() => {
    if (navBtn) {
      document.querySelector('.drawer').classList.remove('hidden')
    }else{
      document.querySelector('.drawer').classList.add('hidden')
    }
  }, [navBtn])
  
  return (
    <>
      {/* <Navbar/> */}
      <header className="px-10 h-14 flex  w-full items-center bg-white fixed z-50">
        {/* <!-- Navbar --> */}
        <div className="w-full flex justify-between">
          <div className="text-xl font-semibold">Jose</div>
          <div className="flex-none hidden lg:block">
            <ul className="px-1 flex justify-around font-frank">
              {/* <!-- Navbar menu content here --> */}
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="#hero">
                  Home
                </HashLink>
              </li>
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="#about">
                  Sobre mi
                </HashLink>
              </li>
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="#projects">
                  Proyectos
                </HashLink>
              </li>
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="#contact">
                  Contacto
                </HashLink>
              </li>
            </ul>
          </div>

          <div className="flex-none lg:hidden">
            <button htmlFor="my-drawer-3" className="btn btn-square btn-ghost" onClick={handlenav}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* <!-- Page content here --> */}
      <Hero />

      <Contact />

      <Footer />

      <div className="drawer w-full h-screen bg-white fixed top-0 hidden">
        <ul className="px-1 flex flex-col justify-around text-center h-screen">
          {/* <!-- Navbar menu content here --> */}
          <li className="font-frank text-4xl text-[#ffb703]" onClick={handlenav}>
            <HashLink smooth to="#hero">
              Home
            </HashLink>
          </li>
          <li className="font-frank text-4xl text-[#ffb703]" onClick={handlenav}>
            <HashLink smooth to="#about">
              Sobre mi
            </HashLink>
          </li>
          <li className="font-frank text-4xl text-[#ffb703]" onClick={handlenav}>
            <HashLink smooth to="#projects">
              Proyectos
            </HashLink>
          </li>
          <li className="font-frank text-4xl text-[#ffb703] onClick={handlenav}">
            <HashLink smooth to="#contact">
              Contacto
            </HashLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Router;
