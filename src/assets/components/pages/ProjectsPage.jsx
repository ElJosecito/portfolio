import React, { useEffect, useState } from 'react'
//import media query
import { useMediaQuery } from "@uidotdev/usehooks";
//projects
import { useProjects } from '../../../shared/hooks/useProjects';
//import cards
import ProjectCard from '../cards/ProjectCard';
//skeleton de carga
import ProjectsGridSkeleton from '../skeletons/ProjectsGridSkeleton';
//seo
import { useSeo } from '../../../shared/hooks/useSeo';
import { isEnglish, localizeProject } from '../../../shared/utils/i18n';
import { absoluteUrl } from '../../../shared/utils/seo';


const FILTERS = ['all', 'web', 'mobile'];

function ProjectsPage({ languaje }) {
    const [isMobile, setIsMobile] = useState(false);
    const mobile = useMediaQuery("only screen and (max-width : 768px)");
    const { projects, loading } = useProjects();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // El scroll al tope lo maneja ScrollToTop en el Router, para todas las rutas.
        setIsMobile(mobile);
    }, []);

    const english = isEnglish(languaje);

    // `ItemList` deja que Google entienda que esto es un listado y de qué, en vez
    // de una página suelta con imágenes. Se arma sobre `projects` y no sobre
    // `visible` a propósito: el filtro es de pantalla, no cambia lo que la URL
    // ofrece, y si lo siguiera el structured data diría algo distinto según qué
    // pestaña tenga abierta el visitante.
    useSeo({
        title: languaje.seo.projects.title,
        description: languaje.seo.projects.description,
        path: '/all-projects',
        locale: english ? 'en_US' : 'es_DO',
        lang: english ? 'en' : 'es',
        jsonLd: projects.length
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'CollectionPage',
                  name: languaje.seo.projects.title,
                  url: absoluteUrl('/all-projects'),
                  mainEntity: {
                      '@type': 'ItemList',
                      numberOfItems: projects.length,
                      itemListElement: projects.map((project, index) => ({
                          '@type': 'ListItem',
                          position: index + 1,
                          name: localizeProject(project, languaje).name,
                          url: absoluteUrl(`/projects/${project.slug}`),
                      })),
                  },
              }
            : null,
    });

    // Se filtra acá y no en la query: son pocos proyectos y ya están todos
    // traídos, así que cambiar de pestaña es instantáneo y sin ir al servidor.
    const visible =
        filter === 'all'
            ? projects
            : projects.filter((project) => project.platforms?.includes(filter));

    return (
        <section className="w-full  p-5 pb-10 bg-noon dark:bg-slate-950 flex justify-center pt-32 sm:pt-36" >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="absolute inset-0 bg-fuchsia-300 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>
            <div className="w-full max-w-screen-xl z-10">
                <div className="mb-10 text-center w-full pl-3 dark:text-moonlit">
                    {/* h1 y no h2: es el encabezado principal de esta página.
                        Arrancar en h2 deja la jerarquía sin raíz. */}
                    <h1 className="text-5xl font-bold my-3">
                        {languaje.projects.title}
                    </h1>
                    <p className="text-lg opacity-70">
                        {languaje.projects.description}
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label={languaje.projects.title}
                    className="mb-8 flex justify-center gap-2"
                >
                    {FILTERS.map((option) => (
                        <button
                            key={option}
                            role="tab"
                            aria-selected={filter === option}
                            onClick={() => setFilter(option)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-transform duration-300 hover:scale-105 ${
                                filter === option
                                    ? 'bg-[#6a4279] text-white dark:bg-[#020617]'
                                    : 'bg-[#EFE0F4] text-dark-grey dark:bg-[#372D48] dark:text-moonlit'
                            }`}
                        >
                            {languaje.projects.filters[option]}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {loading ? (
                        <ProjectsGridSkeleton count={4} label={languaje.projects.loading} />
                    ) : visible.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center h-96 dark:text-moonlit">
                            <p className="text-xl">{languaje.projects.empty}</p>
                        </div>
                    ) : (
                        visible.map((project) => (
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
