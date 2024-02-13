import React from "react";
import Hero from "./assets/components/Hero";
import Contact from "./assets/components/Contact";

import { Route, Routes } from "react-router-dom";
import Portfolio from "./assets/components/Portfolio components/Portfolio";
import ProjectPage from "./assets/components/Portfolio components/ProjectPage";

import { HashLink } from "react-router-hash-link";
import { useState, useEffect } from "react";
import Footer from "./assets/components/Footer";

import { SpanishData } from "./assets/Data/SpanishData";
import { EnglishData } from "./assets/Data/EnglishData";

function Router() {
  const [navBtn, setNavBtn] = useState(false);
  const [lenguaje, setLenguaje] = useState(SpanishData);

  const handlenav = () => {
    if (navBtn) {
      setNavBtn(false);
    } else {
      setNavBtn(true);
    }
  };

  //lenguaje SWitch
  const handleLenguaje = () => {
    if (lenguaje === SpanishData) {
      setLenguaje(EnglishData);
    } else {
      setLenguaje(SpanishData);
    }
  };

  useEffect(() => {
    if (navBtn) {
      document.querySelector(".drawer").classList.remove("hidden");
    } else {
      document.querySelector(".drawer").classList.add("hidden");
    }
  }, [navBtn, lenguaje]);

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
                <HashLink smooth to="/#hero">
                  {lenguaje.header.home}
                </HashLink>
              </li>
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="/#about">
                  {lenguaje.header.about}
                </HashLink>
              </li>
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="/#projects">
                  {lenguaje.header.projects}
                </HashLink>
              </li>
              <li className="px-3 hover:text-[#ffb703] transition-all duration-150">
                <HashLink smooth to="/#contact">
                  {lenguaje.header.contact}
                </HashLink>
              </li>
              <li>
                <button className="" onClick={handleLenguaje}>
                  {lenguaje === SpanishData ? (
                    <img
                      src="https://previews.dropbox.com/p/thumb/ACIGqterVnDj964bRH_WnTJn9LxHr9PAfbV7P_cAJV_P-7890kVSNOmBeUKgrK3n0echuwcXq_3i-tqP8nsQ5rhAkNkmHQh5Z5RWpUhaj4vRQ-WQXeWFZeNxbFvEjGfxNytDRu0OoxPdos6RXWCeE8KfIdEPe_nyKiyOtCJ_mW_UuzqMTfzYss_QOTkJgRyN99q0SlR8Jw2cK169HMTFTdsOUeGyaDWGy9o0vDFdJ_iCQbTZda1-JAgZEiuBWiqnSbXZkF9wO23B2Rgdo_Z6YeFedSYbcjCNcOHqMowbLtw4J7zjZf522L4k3kUmj-DtumRthabuKpV4-kRnJuBWU8yJ/p.png"
                      className="w-6 h-6"
                      alt=""
                    />
                  ) : (
                    <img
                      src="https://previews.dropbox.com/p/thumb/ACLE77hUwHk0cU32Q5XXQCG_SzrLwUJs7UOnbjszgQ9htpZLlXEtVddby6DnVzn6H6q0o_u5dvKkViRCid96F9XdAfz9warz5uZMOwE7BYK6BCpppI9vZqoEg8nFos89s2C3B3iltp58visp-JCwbKRbUGxZ6Ci08Z924OGJgY1B7HkyVoR_ENXYqLQr6ty2Dq2Zz0cI_z8rgnC9gvYM-nfb9t3wTT4IOb_GmdmQ0zdIKKQvVxZYJqrW1ZNFEH0Z7BFOdpJ__BaMG1efYcddq3RdHMkSXBlZY0HkDoFPHhdM2vaWqyNPbHdf14U5Mv4rSAJscTb-J1SJVnURmx40jw62/p.png"
                      className="w-6 h-6"
                      alt=""
                    />
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div className="flex-none lg:hidden">
            <button
              htmlFor="my-drawer-3"
              className="btn btn-square btn-ghost"
              onClick={handlenav}
            >
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
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero lenguaje={lenguaje} />
              <Contact lenguaje={lenguaje} />
            </>
          }
        ></Route>
        <Route
          path="portafolio"
          element={<Portfolio lenguaje={lenguaje} />}
        ></Route>
        <Route path="project/:id" element={<ProjectPage />}></Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>

      <div className="drawer w-full h-screen bg-white fixed top-0 hidden">
        <ul className="px-1 flex flex-col justify-around text-center h-screen">
          {/* <!-- Navbar menu content here --> */}
          <li
            className="font-frank text-4xl text-[#ffb703]"
            onClick={handlenav}
          >
            <HashLink smooth to="#hero">
              {lenguaje.header.home}
            </HashLink>
          </li>
          <li
            className="font-frank text-4xl text-[#ffb703]"
            onClick={handlenav}
          >
            <HashLink smooth to="#about">
              {lenguaje.header.about}
            </HashLink>
          </li>
          <li
            className="font-frank text-4xl text-[#ffb703]"
            onClick={handlenav}
          >
            <HashLink smooth to="#projects">
              {lenguaje.header.projects}
            </HashLink>
          </li>
          <li
            className="font-frank text-4xl text-[#ffb703]"
            onClick={handlenav}
          >
            <HashLink smooth to="#contact">
              {lenguaje.header.contact}
            </HashLink>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default Router;
