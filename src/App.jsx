import "./assets/styles/tailwind.css";
import Hero from "./assets/components/Hero";
import Skills from "./assets/components/Skills";
import Projects from "./assets/components/Projects";
import Contact from "./assets/components/Contact";
import Footer from "./assets/components/Footer";
import Loader from "./assets/components/Loader";

import { HashLink} from "react-router-hash-link";

function App() {



  return (
    <>
      {/* <Navbar/> */}
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          <div className="w-full navbar flex justify-between bg-base-100 fixed z-50">
            <div className="btn btn-ghost normal-case text-xl font-semibold">
              Josecito
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal px-1">
                {/* <!-- Navbar menu content here --> */}
                <li>
                  <HashLink smooth to="#hero">Sobre mi</HashLink>
                </li>
                <li>
                  <HashLink smooth to="#skills">Habilidades</HashLink>
                </li>
                <li>
                  <HashLink smooth to="#projects">Projectos</HashLink>
                </li>
                <li>
                  <HashLink smooth to="#contact">Contacto</HashLink>
                </li>
              </ul>
            </div>

            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
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
              </label>
            </div>
          </div>
          {/* <!-- Page content here --> */}
            <Hero/>
          
            <Skills />
          
          <div className="w-full flex justify-center">
          <div className="flex flex-col justify-center w-full max-w-6xl border-opacity-50">
            <div className="divider"></div>
          </div>
          </div>
          <Projects />
          <div className="w-full flex justify-center">
          <div className="flex flex-col justify-center w-full max-w-6xl border-opacity-50">
            <div className="divider"></div>
          </div>
          </div>
          <Contact />
          
          <Footer/>
          <Loader/>
          {/* Page content ends here */}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100">
          <div className="btn btn-ghost normal-case text-start text-xl font-semibold">
              Josecito
            </div>
            {/* <!-- Sidebar content here --> */}

                <li>
                  <HashLink smooth to="#hero">Sobre mi</HashLink>
                </li>
                <li>
                  <HashLink smooth to="#skills">Habilidades</HashLink>
                </li>
                <li>
                  <HashLink smooth to="#projects">Projectos</HashLink>
                </li>
                <li>
                  <HashLink smooth to="#contact">Contacto</HashLink>
                </li>
              
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
