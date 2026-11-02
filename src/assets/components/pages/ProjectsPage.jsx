import React, { useState } from 'react'

//projects
import { useProjects } from '../../../shared/hooks/useProjects';
//card editorial del grid (ver módulo: distinta de cards/ProjectCard, que sigue
//en Tailwind y usa el Hero clásico)
import ProjectEditorialCard from '../cards/ProjectEditorialCard';
//seo
import { useSeo } from '../../../shared/hooks/useSeo';
import { isEnglish, localizeProject } from '../../../shared/utils/i18n';
import { absoluteUrl } from '../../../shared/utils/seo';
import styles from './ProjectsPage.module.css';


const FILTERS = ['all', 'web', 'mobile'];

/**
 * Rediseño en el lenguaje visual del landing nuevo (ver docs/landing-redesign-
 * review.md "Estado"), pero deliberadamente LIVIANO: esta página la ve todo
 * visitante, incluido quien cae en la variante clásica por el gate de
 * capacidad. Nada de three.js, nada de gsap — solo CSS Modules + tokens
 * compartidos (`../landing/styles/tokens.css`, vía ProjectsPage.module.css).
 */
function ProjectsPage({ languaje }) {
    const { projects, loading } = useProjects();
    const [filter, setFilter] = useState('all');

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
        <section className={styles.page}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    <p className={styles.kicker}>
                        {english ? 'Work' : 'Trabajo'}
                    </p>
                    {/* h1 y no h2: es el encabezado principal de esta página.
                        Arrancar en h2 deja la jerarquía sin raíz. */}
                    <h1 className={styles.title}>{languaje.projects.title}</h1>
                    <p className={styles.description}>{languaje.projects.description}</p>
                </div>

                <div role="tablist" aria-label={languaje.projects.title} className={styles.filters}>
                    {FILTERS.map((option) => (
                        <button
                            key={option}
                            role="tab"
                            aria-selected={filter === option}
                            onClick={() => setFilter(option)}
                            className={`${styles.filterPill} ${filter === option ? styles.filterPillActive : ''}`}
                        >
                            {languaje.projects.filters[option]}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        <>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={styles.skeletonCard}
                                    role="status"
                                    aria-label={languaje.projects.loading}
                                />
                            ))}
                        </>
                    ) : visible.length === 0 ? (
                        <div className={styles.empty}>
                            <p>{languaje.projects.empty}</p>
                        </div>
                    ) : (
                        visible.map((project) => (
                            <ProjectEditorialCard
                                key={project.id}
                                project={project}
                                languaje={languaje}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProjectsPage
