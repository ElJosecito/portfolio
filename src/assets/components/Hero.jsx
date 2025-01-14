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
import { FaGithub, FaLinkedin, FaCopy } from "react-icons/fa";
import { MdAlternateEmail, MdAutoGraph } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

//import media query
import { useMediaQuery } from "@uidotdev/usehooks";

//animated counter
import { AnimatedCounter } from "./DynamicComponents/AnimatedCounter";

//import Components
import InfinityScroll from "./DynamicComponents/InfinityScroll";
import ExperienceCard from "./cards/ExperienceCard";

//devTools
import { DevTools } from "../../shared/utils/Global-Utils";

//hot toast
import toast, { Toaster } from "react-hot-toast";

//link
import { Link } from "react-router-dom";

function Hero({ languaje }) {
  const [text] = useTypewriter({
    words: languaje.hero.subtitle,
    loop: true,
    delaySpeed: 500,
  });

  const [copied, setCopied] = useState(false);
  const email = "josemartinezflorimon@gmail.com";
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    document.title = "Jose Martinez || Desarrollador Web";
    setIsMobile(mobile);
  }, []);

  const copyToClipboard = () => {
    const el = document.createElement("textarea");

    el.value = email;
    if (!copied) {
      document.body.appendChild(el);
      el.select();
      el.setSelectionRange(0, 99999);

      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      toast.success("Email Copiado", {
        duration: 3000,
        position: "bottom-right",
      });
    } else {
      toast.error("Email ya copiado", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };
{/* <div class="relative h-full w-full bg-neutral-900"></div> */}
  return (
    <>
      <main className="w-full min-h-fit h-fit pb-10 flex flex-col items-center bg-noon dark:bg-slate-950">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute inset-0 bg-fuchsia-300 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>
      
        {/* hero */}
        <section
          className="w-full max-w-screen-xl max-h-fit pt-20 px-5"
          id="home"
        >
          <div className="w-full grid auto-rows-[192px] grid-cols-6 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              viewport={{ once: true }}
              className="row-span-2 col-span-6 rounded-3xl relative flex flex-col overflow-hidden gap-10 justify-end p-6 text-white xl:col-span-4 lg:items-end sm:flex-row lg:p-10 dark:bg-[#372D48] bg-[#EFE0F4]"
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
              className="row-span-1 col-span-6 rounded-3xl dark:bg-[#372D48] bg-[#EFE0F4] shadow-lg relative flex flex-col overflow-hidden border-2 border-transparent gap-2 p-7  dark:text-white xl:col-span-2 lg:p-10"
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
              className="row-span-1 col-span-3 rounded-3xl dark:bg-[#372D48] bg-[#EFE0F4] shadow-lg relative flex flex-col overflow-hidden border-2 border-transparent gap-2 items-center justify-center  dark:text-white xl:col-span-1"
            >
              <p className="text-7xl z-[1] font-bold flex items-center gap-1">
                <span>+</span>
                <AnimatedCounter from={0} to={4} />
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
              className="row-span-1 col-span-3 rounded-3xl dark:bg-[#372D48] bg-[#EFE0F4] shadow-lg dark:text-white overflow-hidden border-2 border-transparent xl:col-span-1 flex items-center justify-center relative"
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
        </section>

        {/* Skills */}
        <section className="w-full max-w-screen-xl max-h-fit p-5">

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center rounded-3xl dark:bg-[#372D48] bg-[#EFE0F4] shadow-lg relative overflow-hidden dark:text-white py-10"
            >
              <div className='absolute right-0 w-28 h-full bg-gradient-to-l dark:from-[#372D48] from-[#EFE0F4] to-transparent dark:from-raisin-black dark:to-transparent z-[1]' />
              <div className='absolute left-0 w-28 h-full bg-gradient-to-r dark:from-[#372D48] from-[#EFE0F4] to-transparent dark:from-raisin-black dark:to-transparent z-[1]' />
              <InfinityScroll />
            </motion.div>
          
          {/* See more btn */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.4 }}
            viewport={{ once: true }}
            className="w-full flex justify-end mt-7"
          >
            <a
              href="#"
              className="flex items-center gap-2 font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg active:scale-[1.1] transition-transform duration-300 shadow-md"
            >
              {languaje.skills.skillsBtn}
            </a>
          </motion.div> */}
        </section>

        {/* experience */}
        <section className="w-full max-w-screen-xl max-h-fit p-5 flex flex-col items-center" id="experience">
          <div className="mt-10 mb-10 w-full text-center dark:text-moonlit">
            <h2 className="text-5xl font-bold my-3">{languaje.experience.title}</h2>
            <p className="text-lg opacity-70">{languaje.experience.description}</p>
          </div>

          <div className="w-full max-w-screen-xl lg:px-20 pb-20 pt-10">
            {languaje.experience.experiences.map((item, index) => (
              <ExperienceCard
                key={index}
                title={item.title}
                company={item.company}
                description={item.description}
                link={item.link}
                date={item.date}
              />
            ))}
          </div>


        </section>

        {/* projects */}
        <section className="w-full max-w-screen-xl p-5 pb-10" id="projects">
          <div className="mb-10 text-center w-full pl-3 dark:text-moonlit">
            <h2 className="text-5xl font-bold my-3">
              {languaje.projects.title}
            </h2>
            <p className="text-lg opacity-70">
              {languaje.projects.description}
            </p>
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.15 : 0.3, duration: 0.4 }}
              viewport={{ once: true }}
              className="w-full col-span-6 row-span-2 dark:bg-[#372D48] bg-[#EFE0F4] rounded-3xl flex flex-col items-center lg:items-start overflow-hidden p-5 shadow-md"
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
              <div className="w-full h-full lg:flex ">
                <img
                  className=" w-full lg:max-w-lg object-cover hover:cursor-pointer hover:scale-105 transition-transform duration-300  lg:mr-5"
                  src={languaje.projects.projects[0].image}
                  alt={languaje.projects.projects[0].name}
                  title={languaje.projects.projects[0].name}
                />

                <div className="pl-5 lg:pt-8 dark:text-moonlit flex flex-col">
                  <div>
                    <h3 className="text-5xl font-bold my-5">
                      {languaje.projects.projects[0].name}
                    </h3>
                    <p className="text-sm lg:text-base font-medium opacity-70 lg:ml-1 lg:pr-20 my-5">
                      {languaje.projects.projects[0].description}
                    </p>
                  </div>
                  <ul className="mt-auto flex my-6">
                    {languaje.projects.projects[0].tech.map((item, index) => (
                      <li
                        key={index}
                        className="cursor-pointer flex h-10 items-center self-end font-medium bg-[#6a4279]  text-white dark:bg-[#020617] px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md mr-2"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.4 }}
              viewport={{ once: true }}
              className=" col-span-6 md:col-span-3 dark:bg-[#372D48] bg-[#EFE0F4] rounded-3xl flex flex-col items-center overflow-hidden p-5 shadow-md"
            >
              <div className="w-full flex justify-end mb-3">
                <a
                  href={languaje.projects.projects[1].urls[1].url}
                  target="_blank"
                  rel="noreferrer"
                  className=" gap-2 font-medium text-red-600 border border-red-600 hover:scale-110 px-4 py-1 mr-4 rounded-lg transition-transform duration-300 shadow-md"
                >
                  {languaje.projects.projects[1].urls[1].name}
                </a>

                <a
                  className="flex items-center font-medium bg-noon text-dark-grey px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md"
                  href={languaje.projects.projects[1].urls[0].url}
                  target="_blank"
                  rel="noreferrer"
                  title={languaje.projects.projects[1].urls[0].name}
                >
                  <FaGithub />
                </a>
              </div>
              <div className="w-full h-full ">
                <img
                  className=" w-full object-cover hover:cursor-pointer hover:scale-105 transition-transform duration-300 lg:mr-5"
                  src={languaje.projects.projects[1].image}
                  alt={languaje.projects.projects[1].name}
                  title={languaje.projects.projects[1].name}
                />

                <div className="pl-5 lg:pt-8 dark:text-moonlit flex flex-col">
                  <div>
                    <h3 className="text-5xl font-bold my-5">
                      {languaje.projects.projects[1].name}
                    </h3>
                    <p className="text-sm lg:text-base font-normal opacity-70 my-5">
                      {languaje.projects.projects[1].description}
                    </p>
                  </div>
                  <ul className="mt-auto flex my-6">
                    {languaje.projects.projects[1].tech.map((item, index) => (
                      <li
                        key={index}
                        className="cursor-pointer flex h-10 items-center self-end font-medium bg-[#6a4279] dark:bg-[#020617] px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md mr-2"
                      >
                        <div className="w-7  flex justify-center items-center">
                          <img
                            className="w-full h-full"
                            src={DevTools.find((dev) => dev.name === item).icon}
                            alt={item}
                            title={item}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.6 }}
              viewport={{ once: true }}
              className=" col-span-6 md:col-span-3 dark:bg-[#372D48] bg-[#EFE0F4] rounded-3xl flex flex-col items-center overflow-hidden p-5 shadow-md"
            >
              <div className="w-full flex justify-end mb-3">
                <a
                  href={languaje.projects.projects[2].urls[1].url}
                  target="_blank"
                  rel="noreferrer"
                  className=" gap-2 font-medium text-red-600 border border-red-600 hover:scale-110 px-4 py-1 mr-4 rounded-lg transition-transform duration-300 shadow-md"
                >
                  {languaje.projects.projects[2].urls[1].name}
                </a>

                <a
                  className="flex items-center font-medium bg-noon text-dark-grey px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md"
                  href={languaje.projects.projects[2].urls[0].url}
                  target="_blank"
                  rel="noreferrer"
                  title={languaje.projects.projects[2].urls[0].name}
                >
                  <FaGithub />
                </a>
              </div>
              <div className="w-full h-full ">
                <img
                  className=" w-full object-cover hover:cursor-pointer hover:scale-105 transition-transform duration-300 lg:mr-5"
                  src={languaje.projects.projects[2].image}
                  alt={languaje.projects.projects[2].name}
                  title={languaje.projects.projects[2].name}
                />

                <div className="pl-5 lg:pt-8 dark:text-moonlit flex flex-col">
                  <div>
                    <h3 className="text-5xl font-bold my-5">
                      {languaje.projects.projects[2].name}
                    </h3>
                    <p className="text-sm lg:text-base font-normal opacity-70 my-5">
                      {languaje.projects.projects[2].description}
                    </p>
                  </div>
                  <ul className="mt-auto flex my-6">
                    {languaje.projects.projects[2].tech.map((item, index) => (
                      <li
                        key={index}
                        className="cursor-pointer flex h-10 items-center self-end font-medium bg-[#6a4279] dark:bg-[#020617] px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md mr-2"
                      >
                        <div className="w-7  flex justify-center items-center">
                          <img
                            className="w-full h-full"
                            src={DevTools.find((dev) => dev.name === item).icon}
                            alt={item}
                            title={item}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* See more btn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.4 }}
            viewport={{ once: true }}
            className="w-full flex justify-end mt-7"
          >
            <Link to="/all-projects" className="flex items-center gap-2 font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg active:scale-[1.1] transition-transform duration-300 shadow-md">
              {languaje.projects.projectsBtn}
            </Link>
          </motion.div>
        </section>

        {/* contact */}
        <section className="w-full max-w-screen-xl p-5" id="about">
          <div className="w-full text-center mb-10 dark:text-moonlit">
            <h2 className="text-5xl font-bold my-3">{languaje.about.title}</h2>
            <p className="text-lg opacity-70">{languaje.about.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 lg:grid-rows-1 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.3 }}
              viewport={{ once: true }}
              className="col-span-1 flex flex-col items-center justify-center gap-5"
            >
              <div className="flex flex-col gap-5 dark:text-moonlit">
                <h2 className="text-3xl font-bold">Jose Martinez</h2>

                {languaje.about.paragraphs.map((item, index) => (
                  <p key={index} className="opacity-75 text-lg">
                    {item}
                  </p>
                ))}
              </div>

              <div className="w-full flex flex-col justify-center gap-5">
                <div className="flex gap-3">
                  <a
                    href="
                  mailto:"
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg  gap-2 active:scale-[1.1] transition-transform duration-300"
                  >
                    <MdAlternateEmail />
                    <span className="hidden lg:flex">Email</span>
                  </a>
                  <a
                    href=""
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg  gap-2 active:scale-[1.1] transition-transform duration-300"
                  >
                    <FaLinkedin />
                    <span className="hidden lg:flex">LinkedIn</span>
                  </a>
                  <a
                    href=""
                    className="flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg  gap-2 active:scale-[1.1] transition-transform duration-300"
                  >
                    <FaGithub />
                    <span className="hidden lg:flex">GitHub</span>
                  </a>
                </div>
                {/* email */}

                <div className="flex justify-between w-fit">
                  <div className="w-full p-3 rounded-lg dark:bg-[#372D48] bg-[#EFE0F4]">
                    <p
                      id="email"
                      className="text-base dark:text-moonlit opacity-70"
                    >
                      josemartinezflorimon@gmail.com
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      copyToClipboard();
                    }}
                    className=" flex justify-center items-center mx-2 w-16 rounded-lg dark:bg-[#372D48] bg-[#EFE0F4] text-white"
                  >
                    <FaCopy className="w-5 h-5 opacity-70 text-back-dark-grey dark:text-moonlit" />
                  </button>
                </div>
                {/* cv button download */}
                <a
                  href={
                    languaje.languaje === "Español"
                      ? "https://drive.google.com/file/d/13RE8zqcHDTbQdHVaYjD4yAi87AqwZjNO/view?usp=sharing"
                      : "https://drive.google.com/file/d/181YCYI8vOIHw6PrdW-t5jCcTiydkff_Z/view?usp=sharing"
                  }
                  target="_blank"
                  className="w-fit   flex items-center font-medium bg-moonlit text-dark-grey px-4 py-2 rounded-lg  gap-2 active:scale-[1.1] transition-transform duration-300"
                >
                  <IoMdDownload />
                  <span className="">Download CV</span>
                </a>

              </div>
            </motion.div>
            <div className="col-span-1 flex justify-end lg:pt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0.2 : 0.45, duration: 0.3 }}
                viewport={{ once: true }}
                className="w-full h-[30rem] rounded-3xl bg-white dark:bg-dark-grey dark:text-white overflow-hidden border-2 border-transparent xl:col-span-1 flex items-center justify-center relative"
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
        </section>
      </main>
      <Toaster />
    </>
  );
}

export default Hero;
