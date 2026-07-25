import React, { useEffect, useState } from 'react'
//import media query
import { useMediaQuery } from "@uidotdev/usehooks";
//projects
import { useProjects } from '../../../shared/hooks/useProjects';
//import cards
import ProjectCard from '../cards/ProjectCard';


function ProjectsPage({ languaje }) {
    const [isMobile, setIsMobile] = useState(false);
    const mobile = useMediaQuery("only screen and (max-width : 768px)");
    const { projects, loading } = useProjects();

    useEffect(() => {
        document.title = "Projectos || ElJosecito";
        setIsMobile(mobile);
        window.scrollTo(0, 0);
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
                            <p className="text-xl">{languaje.projects.loading}</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center h-96 dark:text-moonlit">
                            <p className="text-xl">{languaje.projects.empty}</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                languaje={languaje}
                                delay={isMobile ? 0.2 : 0.35}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProjectsPage
