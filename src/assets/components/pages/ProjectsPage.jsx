import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
//import media query
import { useMediaQuery } from "@uidotdev/usehooks";
//supabase
import { supabase } from '../../../shared/supabaseClient';
//hot toast
import toast from 'react-hot-toast';


function ProjectsPage({ languaje }) {
    const [isMobile, setIsMobile] = useState(false);
    const mobile = useMediaQuery("only screen and (max-width : 768px)");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Projectos || ElJosecito";
        setIsMobile(mobile);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select(`
                        *,
                        project_technologies (
                            technologies (
                                name,
                                icon_url,
                                class_name
                            )
                        )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Filter out any null or undefined technologies
                const formattedProjects = data?.map(project => {
                    const validTechnologies = project.project_technologies?.filter(pt => pt?.technologies) || [];

                    return {
                        name: project.title,
                        description: project.description,
                        image: project.image_url,
                        urls: project.urls,
                        tech: validTechnologies.map(pt => pt.technologies.name),
                        techIcons: validTechnologies.map(pt => ({
                            name: pt.technologies.name,
                            icon: pt.technologies.icon_url,
                            className: pt.technologies.class_name
                        }))
                    }
                }) || [];

                setProjects(formattedProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Error al cargar proyectos');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section className="w-full  p-5 pb-10 bg-noon dark:bg-slate-950 flex justify-center pt-20" >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="absolute inset-0 bg-fuchsia-300 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>
            <div className="w-full max-w-screen-xl z-10">
                <div className="mb-10 text-center w-full pl-3 dark:text-moonlit">
                    <h2 className="text-5xl font-bold my-3">
                        {languaje.projects.title}
                    </h2>
                    <p className="text-lg opacity-70">
                        {languaje.projects.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center h-96 dark:text-moonlit">
                            <p className="text-xl">Cargando proyectos...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center h-96 dark:text-moonlit">
                            <p className="text-xl">No hay proyectos disponibles</p>
                        </div>
                    ) : (
                        projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: isMobile ? 0.2 : 0.35, duration: 0.4 }}
                                viewport={{ once: true }}
                                className="dark:bg-[#372D48] bg-[#EFE0F4] rounded-3xl flex flex-col overflow-hidden p-5 shadow-md"
                            >
                                <div className="w-full flex justify-end mb-3">
                                    {project.urls?.[1] && (
                                        <a
                                            href={project.urls[1].url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className=" gap-2 font-medium text-red-600 border border-red-600 hover:scale-110 px-4 py-1 mr-4 rounded-lg transition-transform duration-300 shadow-md"
                                        >
                                            {project.urls[1].name}
                                        </a>
                                    )}

                                    {project.urls?.[0] && (
                                        <a
                                            className="flex items-center font-medium bg-noon text-dark-grey px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md"
                                            href={project.urls[0].url}
                                            target="_blank"
                                            rel="noreferrer"
                                            title={project.urls[0].name}
                                        >
                                            <FaGithub />
                                        </a>
                                    )}
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
                                            {project.techIcons?.map((tech, techIndex) => (
                                                <li
                                                    key={techIndex}
                                                    className="cursor-pointer flex h-10 items-center self-end font-medium bg-[#6a4279] dark:bg-[#020617] px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md mr-2"
                                                >
                                                    <div className="w-7  flex justify-center items-center">
                                                        <img
                                                            className={`w-full h-full ${tech.className || ''}`}
                                                            src={tech.icon}
                                                            alt={tech.name}
                                                            title={tech.name}
                                                        />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProjectsPage