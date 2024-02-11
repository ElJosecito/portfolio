import React, { useEffect } from "react";

//import typewriter
import { useTypewriter } from "react-simple-typewriter";
//import images
import josecito from "../images/Josecito.png";
import banklanding from "../images/bank-page.png";
import flags from "../images/flags-app.png";
import crud from "../images/crud.png";

//import fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//icons
import { faJs } from "@fortawesome/free-brands-svg-icons";
import { faHtml5 } from "@fortawesome/free-brands-svg-icons";
import { faCss3Alt } from "@fortawesome/free-brands-svg-icons";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import { faGitAlt } from "@fortawesome/free-brands-svg-icons";
import { faNodeJs } from "@fortawesome/free-brands-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons";

import { faCode } from "@fortawesome/free-solid-svg-icons";

//import AOS
import Aos from "aos";
import "aos/dist/aos.css";

function Hero({ lenguaje }) {
  useEffect(() => {
    Aos.init();
  }, []);

  const [text] = useTypewriter({
    words: lenguaje.hero.typewriter,
    loop: true,
    cursorStyle: "|",
    cursorBlinking: true,
    typeSpeed: 100,
    deleteSpeed: 50,
  });

  return (
    <>
      <section
        id="hero"
        className="w-full bg-black bg-opacity-90 flex justify-center"
      >
        <div className="min-h-screen h-fit max-w-screen-2xl w-full ">
          <div className=" w-full h-screen flex items-center justify-center relative">
            <div className="absolute filter blur-sm">
              <img
                src={josecito}
                alt=""
                className="w-96 pulse "
                data-aos="fade-up"
                data-aos-anchor-placement="center-bottom"
                data-aos-duration="3000"
              />
            </div>
            <div className="absolute w-full h-screen "></div>
            <div className="w-full h-screen flex flex-col justify-center absolute">
              <h1
                className="h1 text-4xl sm:text-6xl  md:text-8xl tracking-[0.8rem] font-frank text-center text-white overflow-hidden "
                data-aos="fade-right"
                data-aos-duration="2000"
              >
                {lenguaje.hero.title}
              </h1>
              <p
                className="font-nusar text-white w-full text-center h-1 tracking-wider text-xs"
                data-aos="fade-up"
                data-aos-duration="2000"
              >
                {text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section */}
      <section
        className="w-full flex justify-center bg-[#023047] pt-20 min-h-screen h-fit"
        id="about"
      >
        <div className="h-fit max-w-screen-xl w-full">
          <h2
            className="text-3xl tracking-[0.4rem] font-frank my-5 text-center md:text-start mx-4 text-[#ffb703]"
            data-aos="fade-right"
            data-aos-duration="500"
          >
            {lenguaje.about.title}
          </h2>
          <div className="w-full flex flex-col md:flex-row">
            <div className="px-4 max-w-2xl">
              <p
                className="py-6 md:text-start font-thin text-center mt-4 md:mt-0 text-white font-nusar"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                {/* ¡Hola! Soy un Frontend Developer apasionado por la creación de
                experiencias digitales únicas y atractivas. Mi objetivo es
                combinar diseño y funcionalidad para crear soluciones web que
                cumplan con los requisitos de los usuarios y generen un impacto
                positivo en su experiencia. */}
                {lenguaje.about.description}
                <br />
                <br />
                {/*  */}

                {lenguaje.about.text}
              </p>

              <div className="text-white flex flex-wrap justify-center md:justify-start">
                <div
                  className="group ml-0 m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full "
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="200"
                >
                  <FontAwesomeIcon
                    icon={faHtml5}
                    className="text-4xl text-[#023047]"
                  />
                </div>
                <div
                  className=" m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full"
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="300"
                >
                  <FontAwesomeIcon
                    icon={faCss3Alt}
                    className="text-4xl text-[#023047]"
                  />
                </div>
                <div
                  className="m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full"
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="400"
                >
                  <FontAwesomeIcon
                    icon={faJs}
                    className="text-4xl text-[#023047]"
                  />
                </div>
                <div
                  className="m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full"
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="500"
                >
                  <FontAwesomeIcon
                    icon={faReact}
                    className="text-4xl text-[#023047]"
                  />
                </div>
                <div
                  className="m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full"
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="600"
                >
                  <FontAwesomeIcon
                    icon={faGitAlt}
                    className="text-4xl text-[#023047]"
                  />
                </div>
                <div
                  className="m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full"
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="700"
                >
                  <FontAwesomeIcon
                    icon={faNodeJs}
                    className="text-4xl text-[#023047]"
                  />
                </div>
                <div
                  className="m-4 w-14 h-14 flex justify-center items-center bg-[#ffb703] rounded-full"
                  data-aos="fade-up"
                  data-aos-anchor-placement="center-bottom"
                  data-aos-duration="900"
                >
                  <FontAwesomeIcon
                    icon={faNpm}
                    className="text-4xl text-[#023047]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className=" hidden md:block">
                <FontAwesomeIcon
                  icon={faCode}
                  className="text-[10rem] text-[#ffb703] animate-bounce"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section */}
      <section
        className="w-full flex flex-col items-center  pt-20 min-h-screen h-fit"
        id="projects"
      >
        <div className="h-fit max-w-screen-xl w-full">
          <div className="flex items-center">
            <div
              className="border-b-2 border-[#ffb703] w-5 md:w-10 ml-4"
              data-aos="fade-right"
              data-aos-duration="800"
            ></div>
            <p
              className="self-start text-base tracking-[0.4rem] font-frank my-5 text-center md:text-start mx-4 text-[#ffb703]"
              data-aos="fade-right"
              data-aos-duration="500"
            >
              {lenguaje.projects.headTitle}
            </p>
          </div>
          <h2
            className="text-3xl tracking-[0.4rem] font-frank my-5 text-center md:text-start mx-4 text-[#023047]"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            {lenguaje.projects.title}
          </h2>
          <div className="w-full flex flex-col">
            {/*  */}
            <div
              className="border-4 border-[#ffb703] bg-[#023047] p-4 rounded-lg m-3 lg:flex"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              <div className="flex items-center">
                <img
                  src={lenguaje.projects.latestProjects[0].image}
                  alt=""
                  className="lg:max-w-lg"
                />
              </div>
              <div className="w-full lg:p-10 flex flex-col justify-between ">
                <h3 className="text-2xl font-bold text-white my-3">
                  {lenguaje.projects.latestProjects[0].title}
                </h3>
                <p className="text-white mb-  text-xs sm:text-base">
                  {lenguaje.projects.latestProjects[0].description}
                </p>
                <a
                  href={lenguaje.projects.latestProjects[0].demo}
                  target="_blank"
                >
                  <button className="bg-[#219ebc] hover:bg-[#2b7183] transition-all duration-200 sm:w-32 mt-2 w-24 p-1 sm:p-2 text-white  rounded-full">
                    {lenguaje.projects.btns}
                  </button>
                </a>
              </div>
            </div>
            {/*  */}
            <div
              className="border-4 border-[#ffb703] bg-[#023047] p-4 rounded-lg m-3 lg:flex"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              <div className="flex items-center">
                <img src={flags} alt="" className="lg:max-w-lg" />
              </div>
              <div className="w-full lg:p-10 flex flex-col justify-between ">
                <h3 className="text-2xl font-bold text-white my-3">
                  {lenguaje.projects.latestProjects[1].title}
                </h3>
                <p className="text-white mb-3 text-xs sm:text-base">
                  {lenguaje.projects.latestProjects[1].description}
                </p>
                <a
                  href={lenguaje.projects.latestProjects[1].demo}
                  target="_blank"
                >
                  <button className="bg-[#219ebc] hover:bg-[#2b7183] transition-all duration-200 sm:w-32 mt-2 w-24 p-1 sm:p-2 text-white  rounded-full">
                    {lenguaje.projects.btns}
                  </button>
                </a>
              </div>
            </div>
            {/*  */}
            <div
              className="border-4 border-[#ffb703] bg-[#023047] p-4 rounded-lg m-3 lg:flex"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              <div className="flex items-center">
                <img src={crud} alt="" className="lg:max-w-lg" />
              </div>
              <div className="w-full lg:p-10 flex flex-col justify-between ">
                <h3 className="text-2xl font-bold text-white my-3">
                  {lenguaje.projects.latestProjects[2].title}
                </h3>
                <p className="text-white mb-3  text-xs sm:text-base">
                  {lenguaje.projects.latestProjects[2].description}
                </p>
                <a
                  href={lenguaje.projects.latestProjects[2].demo}
                  target="_blank"
                >
                  <button className="bg-[#219ebc] hover:bg-[#2b7183] transition-all duration-200 sm:w-32 mt-2 w-24 p-1 sm:p-2 text-white  rounded-full">
                    {lenguaje.projects.btns}
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <a href="
            /portafolio">
            <button
            
            className="self-start text-base tracking-[0.4rem] font-frank my-5 text-center md:text-start mx-4 text-[#ffb703] bg-[#023047]  p-2 px-4 rounded-full hover:bg-[#ffb703] hover:text-[#023047] transition-all duration-200"
            data-aos="fade-right"
            data-aos-duration="500"
          >
            {lenguaje.projects.more}
          </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;

{
  /* <p className="py-6 lg:text-start text-center mt-4 md:mt-0">
                ¡Hola! Soy un Junior Frontend Developer apasionado por la
                creación de experiencias digitales únicas y atractivas. Mi
                objetivo es combinar diseño y funcionalidad para crear
                soluciones web que cumplan con los requisitos de los usuarios y
                generen un impacto positivo en su experiencia.
                <br />
                <br />
                Tengo experiencia en HTML, CSS y JavaScript, y estoy en
                constante aprendizaje para mejorar mis habilidades y conocer
                nuevas tecnologías. Me gusta trabajar en equipo y colaborar con
                otros para lograr objetivos comunes.
              </p>
              <a
                href="https://drive.google.com/file/d/1Vce4lT9KvlGgxFumDKi6_UaXMDtIZ-wI/view"
                target={"_blank"}
                className="lg:self-start self-center"
              >
                <button className="bg-sky-700 hover:bg-sky-900 border-none lg:self-start self-center">
                  Resume
                </button>
              </a> */
}
