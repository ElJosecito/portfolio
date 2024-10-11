import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { DevTools } from '../../../shared/utils/Global-Utils'
//import media query
import { useMediaQuery } from "@uidotdev/usehooks";


function ProjectsPage({ languaje }) {


    const [isMobile, setIsMobile] = useState(false);
    const mobile = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        document.title = "Projectos || ElJosecito";
        setIsMobile(mobile);
    }, []);

    return (
        <section className="w-full  p-5 pb-10 bg-noon dark:bg-slate-950 flex justify-center pt-20" >
            {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div> */}
            <div className="absolute inset-0 bg-fuchsia-300 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>
            <div className="w-full max-w-screen-xl">
                <div className="mb-10 text-center w-full pl-3 dark:text-moonlit">
                    <h2 className="text-5xl font-bold my-3">
                        {languaje.projects.title}
                    </h2>
                    <p className="text-lg opacity-70">
                        {languaje.projects.description}
                    </p>
                </div>

                <div className="grid grid-cols-6 grid-rows-2 gap-5">
                    {/* <motion.div
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
                    </motion.div> */}

                    {
                        languaje.projects.projects.map((project, index) => (
                            <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.4 }}
                            viewport={{ once: true }}
                            className=" col-span-6 md:col-span-3 dark:bg-[#372D48] bg-[#EFE0F4] rounded-3xl flex flex-col items-center overflow-hidden p-5 shadow-md"
                        >
                            <div className="w-full flex justify-end mb-3">
                                <a
                                    href={project.urls[1].url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className=" gap-2 font-medium text-red-600 border border-red-600 hover:scale-110 px-4 py-1 mr-4 rounded-lg transition-transform duration-300 shadow-md"
                                >
                                    {project.urls[1].name}
                                </a>
    
                                <a
                                    className="flex items-center font-medium bg-noon text-dark-grey px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md"
                                    href={project.urls[0].url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={project.urls[0].name}
                                >
                                    <FaGithub />
                                </a>
                            </div>
                            <div className="w-full h-full ">
                                <img
                                    className=" w-full object-cover hover:cursor-pointer hover:scale-105 transition-transform duration-300 lg:mr-5"
                                    src={project.image}
                                    alt={project.name}
                                    title={project.name}
                                />
    
                                <div className="pl-5 lg:pt-8 dark:text-moonlit flex flex-col">
                                    <div>
                                        <h3 className="text-5xl font-bold my-5">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm lg:text-base font-normal opacity-70 my-5">
                                            {project.description}
                                        </p>
                                    </div>
                                    <ul className="mt-auto flex my-6">
                                        {project.tech.map((item, index) => (
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
                        ))
                    }

                    {/* <motion.div
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
                    </motion.div> */}
                </div>
            </div>
        </section>
    )
}

export default ProjectsPage