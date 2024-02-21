import React, { useEffect, useState } from "react";

//import typewriter
import { useTypewriter } from "react-simple-typewriter";

//import images
import josecito from "../images/Josecito.png";

//framer motion
import { motion } from "framer-motion";

//icons
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdAlternateEmail, MdAutoGraph } from "react-icons/md";

//import media query
import { useMediaQuery } from "@uidotdev/usehooks";

//animated counter
import { AnimatedCounter } from "./DynamicComponents/AnimatedCounter";

function Hero() {
  const [ text ] = useTypewriter({
    words: ["Desarrollador Web", "Front-End", "Back-End", "Full-Stack"],
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
      <section className="w-full min-h-screen h-screen max-h-fit flex justify-center bg-noon dark:bg-back-dark-grey">
        <div className="w-full max-w-screen-xl max-h-fit pt-20 px-5">
          <section className="w-full grid auto-rows-[192px] grid-cols-6 gap-4">
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
                  José Miguel Martinez Florimon
                </span>
                <span className="text-lg font-medium leading-9 h-10 my-[2px]">
                  {text}
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-1 lg:gap-3">
                  <a
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-3 py-2 rounded-lg text-dusky gap-2 active:scale-[1.1] transition-transform duration-300"
                    href="https://github.com/Eljosecito"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                  >
                    <FaGithub />
                    <span className="hidden lg:flex">GitHub</span>
                  </a>
                  <a
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg text-dusky gap-2 active:scale-[1.1] transition-transform duration-300"
                    href="https://www.linkedin.com/in/jose-martinez-dev/"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                    <span className="hidden lg:flex">LinkedIn</span>
                  </a>
                  <a
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg text-dusky gap-2 active:scale-[1.1] transition-transform duration-300"
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
              <h2 className="text-2xl font-bold z-[1]">About me</h2>
              <p className="text-base w-full z-[1] opacity-70">
                Web developer with experience in designing, developing and
                maintaining front-end web applications.
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
                <AnimatedCounter from={0} to={3} />
              </p>
              <p className="text-sm font-semibold max-w-fit opacity-70 z-[1]">
                Years of experience
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
                src={josecito}
                alt="Location"
                title="Location"
              />
              <img
                className="w-11 z-[2]"
                src={josecito}
                alt="memoji"
                title="memoji"
              />
              <div className="w-24 h-24 bg-[#98d0ff] absolute z-[1] rounded-full bg-opacity-30 border-2 border-white animate__animated animate__pulse animate__infinite infinite animate__fast" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-10 backdrop-blur-sm absolute left-0 bottom-0 z-[2] flex items-center justify-center text-left text-opacity-70"
              >
                <span className="text-xs font-medium">
                  From La Romana, DO 🇲🇽
                </span>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </section>
    </>
  );
}

export default Hero;
