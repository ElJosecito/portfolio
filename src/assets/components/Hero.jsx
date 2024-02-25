import React, { useEffect, useState } from "react";

//import typewriter
import { useTypewriter } from "react-simple-typewriter";

//import images
import josecito from "../images/Josecito.png";
import mapsDark from "../images/mapsDark.png";
import mapsLight from "../images/mapsLight.png";

//framer motion
import { motion } from "framer-motion";

//icons
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdAlternateEmail, MdAutoGraph } from "react-icons/md";

//import media query
import { useMediaQuery } from "@uidotdev/usehooks";

//animated counter
import { AnimatedCounter } from "./DynamicComponents/AnimatedCounter";

//import Components
import InfinityScroll from "./DynamicComponents/InfinityScroll";

//projects
import GestipolMuckUp from "../images/GestipolMockup.png";

//devTools
import { DevTools } from "../../shared/utils/Global-Utils";

function Hero({ languaje }) {
  const [text] = useTypewriter({
    words: languaje.hero.subtitle,
    loop: true,
  });

  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    document.title = "Jose Martinez || Desarrollador Web";
    setIsMobile(mobile);
  }, []);

  return (
    <>
      <section className="w-full max-h-fit flex flex-col items-center bg-noon dark:bg-back-dark-grey">
        <div className="w-full max-w-screen-xl max-h-fit pt-20 px-5">
          <div className="w-full grid auto-rows-[192px] grid-cols-6 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              viewport={{ once: true }}
              className="row-span-2 col-span-6 rounded-3xl bg-moonlit relative flex flex-col overflow-hidden gap-10 justify-end p-6 dark:bg-dark-grey text-white xl:col-span-4 lg:items-end sm:flex-row lg:p-10"
            >
              <div className="absolute bg-gradient-to-t from-dusky-alt to-transparent top-0 left-0 bottom-0 right-0 z-[2]" />
              <img
                className="absolute w-full h-full object-cover left-0 top-0"
                src={josecito}
                alt="personal"
                title="Personal"
              />
              <div className="w-full flex flex-col z-[2] absolute left-0 bottom-0 leading-4 p-5 font-inter">
                <span className="text-3xl font-bold leading-7">
                  {languaje.hero.name}
                </span>
                <span className="text-lg font-medium leading-9 h-10 my-[2px]">
                  {text}
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-1 lg:gap-3">
                  <a
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-3 py-2 rounded-lg  gap-2 active:scale-[1.1] transition-transform duration-300"
                    href="https://github.com/Eljosecito"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                  >
                    <FaGithub />
                    <span className="hidden lg:flex">GitHub</span>
                  </a>
                  <a
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg  gap-2 active:scale-[1.1] transition-transform duration-300"
                    href="https://www.linkedin.com/in/jose-martinez-dev/"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                    <span className="hidden lg:flex">LinkedIn</span>
                  </a>
                  <a
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg gap-2 active:scale-[1.1] transition-transform duration-300"
                    href="mailto:josemartinezflorimon@gmail.com"
                    title="Email"
                  >
                    <MdAlternateEmail />
                    <span className="hidden lg:flex">Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              viewport={{ once: true }}
              className="row-span-1 col-span-6 rounded-3xl bg-white relative flex flex-col overflow-hidden border-2 border-transparent gap-2 p-7 dark:bg-dark-grey dark:text-white xl:col-span-2 lg:p-10"
            >
              <h2 className="text-2xl font-bold z-[1]">
                {languaje.about.title}
              </h2>
              <p className="text-base w-full z-[1] opacity-70">
                {languaje.about.description}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.15 : 0.3, duration: 0.3 }}
              viewport={{ once: true }}
              className="row-span-1 col-span-3 rounded-3xl bg-white relative flex flex-col overflow-hidden border-2 border-transparent gap-2 items-center justify-center dark:bg-dark-grey dark:text-white xl:col-span-1"
            >
              <p className="text-7xl z-[1] font-bold flex items-center gap-1">
                <span>+</span>
                <AnimatedCounter from={0} to={2} />
              </p>
              <p className="text-sm font-semibold max-w-fit opacity-70 z-[1]">
                {languaje.experience.description}
              </p>
              <MdAutoGraph className="w-full h-full absolute -right-10 -bottom-12 opacity-5 dark:opacity-[0.02] p-5 z-[0]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.3 }}
              viewport={{ once: true }}
              className="row-span-1 col-span-3 rounded-3xl bg-white dark:bg-dark-grey dark:text-white overflow-hidden border-2 border-transparent xl:col-span-1 flex items-center justify-center relative"
            >
              <img
                className="absolute w-full h-full object-cover z-[1]"
                src={
                  document.querySelector("html").classList.contains("dark")
                    ? mapsDark
                    : mapsLight
                }
                alt="Location"
                title="Location"
              />
              <img
                className="w-28 z-10"
                src={josecito}
                alt={languaje.hero.name}
                title={languaje.hero.name}
              />
              <div className="w-24 h-24 bg-[#98d0ff] absolute z-[1] rounded-full bg-opacity-30 border-2 border-white animate-pulseandping" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-10 backdrop-blur-sm absolute left-0 bottom-0 z-[2] flex items-center justify-center text-left text-opacity-70"
              >
                <span className="text-xs font-medium">
                  {languaje.country.description}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="w-full max-w-screen-xl max-h-fit p-5">
          <div className="mt-10 mb-10 w-full text-center dark:text-moonlit">
            <h2 className="text-3xl font-bold">{languaje.skills.title}</h2>
            <p className="text-base opacity-70">
              {languaje.skills.description}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: isMobile ? 0.15 : 0.3, duration: 0.4 }}
            viewport={{ once: true }}
            className=" max-w-screen-xl max-h-fit flex items-center justify-center  py-10 overflow-hidden dark:bg-dark-grey bg-moonlit rounded-2xl shadow-lg"
          >
            <InfinityScroll />
          </motion.div>
          {/* See more btn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.4 }}
            viewport={{ once: true }}
            className="w-full flex justify-end mt-10"
          >
            <a
              href="#"
              className="flex items-center gap-2 font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg active:scale-[1.1] transition-transform duration-300 shadow-md"
            >
              {languaje.skills.skillsBtn}
            </a>
          </motion.div>
        </div>

        <div className="w-full max-w-screen-xl max-h-fit p-5">
          <div className="mt-10 mb-10 w-full text-center dark:text-moonlit">
            <h2 className="text-3xl font-bold">Experience</h2>
            <p className="text-base opacity-70">I Have worked with:</p>
          </div>
        </div>

        <div className="w-full max-w-screen-xl max-h-fit p-5">
          <div className="mt-10 mb-10 w-full text-center dark:text-moonlit">
            <h2 className="text-3xl font-bold">{languaje.projects.title}</h2>
            <p className="text-base opacity-70">
              {languaje.projects.description}
            </p>
          </div>

          <div className="w-full flex items-center justify-center gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.15 : 0.3, duration: 0.4 }}
              viewport={{ once: true }}
              className="lg:w-full bg-moonlit dark:bg-dark-grey rounded-3xl flex flex-col lg:items-start overflow-hidden p-5 shadow-md"
            >
              <div className="w-full flex justify-end mb-3 lg:mb-0">
                <a
                  href={languaje.projects.projects[0].urls[1].url}
                  target="_blank"
                  rel="noreferrer"
                  className=" gap-2 font-medium text-red-600 border border-red-600 hover:scale-110 px-4 py-1 mr-4 rounded-lg transition-transform duration-300 shadow-md"
                >
                  {languaje.projects.projects[0].urls[1].name}
                </a>

                <a
                  className="flex items-center font-medium bg-noon text-dark-grey px-3 py-1 rounded-lg  gap-2 hover:scale-110 transition-transform duration-300 shadow-md"
                  href={languaje.projects.projects[0].urls[0].url}
                  target="_blank"
                  rel="noreferrer"
                  title={languaje.projects.projects[0].urls[0].name}
                >
                  <FaGithub />
                  <span className="hidden lg:flex">GitHub</span>
                </a>
              </div>
              <div className="w-full h-full min-h-80 max-w-lg lg:max-w-full lg:flex ">
                <img
                  className="max-w-lg w-full object-cover"
                  src={languaje.projects.projects[0].image}
                  alt={languaje.projects.projects[0].name}
                  title={languaje.projects.projects[0].name}
                />

                <div className="pl-5 lg:pt-8 dark:text-moonlit flex flex-col">
                  <div>
                    <h3 className="text-5xl font-bold my-5">
                      {languaje.projects.projects[0].name}
                    </h3>
                    <p className="text-base font-medium opacity-70 ml-3 lg:pr-20 my-5">
                      {languaje.projects.projects[0].description}
                    </p>
                  </div>
                  <ul className="mt-auto flex my-6">
                    {languaje.projects.projects[0].tech.map((item, index) => (
                      <li
                        key={index}
                        className="flex h-10 items-center self-end font-medium dark:bg-back-dark-grey px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md mr-2"
                      >
                        <div className="w-7 lg:mr-3 flex justify-center items-center">
                          <img
                            className="w-full h-full"
                            src={DevTools.find((dev) => dev.name === item).icon}
                            alt={item}
                            title={item}
                          />
                        </div>

                        <span className="font-bold hidden lg:flex">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
