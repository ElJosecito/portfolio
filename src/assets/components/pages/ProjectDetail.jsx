import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

import { useProject } from '../../../shared/hooks/useProjects'
import { useProjectImages } from '../../../shared/hooks/useProjectImages'
import ProjectGallery from '../ProjectGallery'
import ProjectDetailSkeleton from '../skeletons/ProjectDetailSkeleton'
import { isEnglish, localizeProject } from '../../../shared/utils/i18n'
import { useSeo } from '../../../shared/hooks/useSeo'
import { SITE_URL, absoluteUrl } from '../../../shared/utils/seo'
import { projectTransitionName } from '../../../shared/utils/viewTransition'
// Directo y no desde el barrel: importar el índice del kit haría que la página
// pública se lleve también los componentes que solo usa el panel.
import Markdown from '../../../shared/ui/Markdown'
import styles from './ProjectDetail.module.css'

/**
 * Rediseño editorial en el lenguaje del landing nuevo — hero grande en la
 * tipografía display, fila de metadata en mono, portada en mockup con
 * `object-contain` (igual criterio que las cards: la imagen YA trae su
 * propio fondo) y el contenido de markdown con tipografía legible. Ver
 * ProjectDetail.module.css para los tokens compartidos con el landing
 * (`../landing/styles/tokens.css`).
 */
function ProjectDetail({ languaje }) {
    const { slug } = useParams()
    const { project, loading, notFound } = useProject(slug)
    const { images } = useProjectImages(project?.id)

    const english = isEnglish(languaje)
    const localized = project ? localizeProject(project, languaje) : null
    const content = project
        ? (english && project.content_en) || project.content
        : null

    // El scroll al tope lo maneja ScrollToTop en el Router: el slug es parte de
    // la ruta, así que pasar de un proyecto a otro también lo dispara.

    // Mientras carga no se toca nada: el título y la tarjeta quedan con lo que
    // haya, en vez de parpadear a "Proyecto" y volver. Si el slug no existe,
    // `noindex` para que un link roto no termine indexado.
    useSeo({
        title: localized ? `${localized.name} — Jose Martinez` : '',
        description: localized?.description,
        path: `/projects/${slug}`,
        image: project?.image,
        type: 'article',
        locale: english ? 'en_US' : 'es_DO',
        lang: english ? 'en' : 'es',
        jsonLd: localized
            ? [
                  {
                      '@context': 'https://schema.org',
                      '@type': 'CreativeWork',
                      name: localized.name,
                      description: localized.description,
                      url: absoluteUrl(`/projects/${slug}`),
                      image: project.image,
                      inLanguage: english ? 'en' : 'es',
                      keywords: project.techIcons.map((tech) => tech.name).join(', '),
                      author: {
                          '@type': 'Person',
                          name: 'Jose Martinez',
                          url: SITE_URL,
                      },
                  },
                  {
                      '@context': 'https://schema.org',
                      '@type': 'BreadcrumbList',
                      itemListElement: [
                          {
                              '@type': 'ListItem',
                              position: 1,
                              name: languaje.projects.title,
                              item: absoluteUrl('/all-projects'),
                          },
                          {
                              '@type': 'ListItem',
                              position: 2,
                              name: localized.name,
                              item: absoluteUrl(`/projects/${slug}`),
                          },
                      ],
                  },
              ]
            : null,
    })

    useEffect(() => {
        if (!notFound) return

        const tag = document.createElement('meta')
        tag.setAttribute('name', 'robots')
        tag.setAttribute('content', 'noindex')
        tag.setAttribute('data-seo', 'noindex')
        document.head.appendChild(tag)

        return () => tag.remove()
    }, [notFound])

    const github = project?.urls.find((url) => /git/i.test(url.name)) || project?.urls[0]
    const live = project?.urls.find((url) => url !== github)
    const year = project?.createdAt ? new Date(project.createdAt).getFullYear() : null
    const transitionName = projectTransitionName(project?.slug)

    return (
        <section className={styles.page}>
            <div className={styles.inner}>
                <Link to="/all-projects" className={styles.back}>
                    ← {english ? 'Back to projects' : 'Volver a proyectos'}
                </Link>

                {loading ? (
                    <ProjectDetailSkeleton label={languaje.projects.loading} />
                ) : notFound || !project ? (
                    <div className={styles.notFound}>
                        <p className={styles.notFoundText}>
                            {english ? 'Project not found' : 'Proyecto no encontrado'}
                        </p>
                        <Link to="/all-projects" className={styles.notFoundCta}>
                            {languaje.projects.projectsBtn}
                        </Link>
                    </div>
                ) : (
                    <article>
                        <header className={styles.hero}>
                            <div className={styles.metaRow}>
                                {project.platforms.map((platform) => (
                                    <span key={platform} className={styles.platformChip}>
                                        {languaje.projects.filters[platform] || platform}
                                    </span>
                                ))}
                            </div>

                            <h1 className={styles.title}>{localized.name}</h1>
                            <p className={styles.description}>{localized.description}</p>

                            <dl className={styles.metaTable}>
                                {year && (
                                    <div>
                                        <dt>{english ? 'Year' : 'Año'}</dt>
                                        <dd>{year}</dd>
                                    </div>
                                )}
                                {project.techIcons.length > 0 && (
                                    <div>
                                        <dt>{english ? 'Stack' : 'Stack'}</dt>
                                        <dd>{project.techIcons.map((t) => t.name).join(' · ')}</dd>
                                    </div>
                                )}
                            </dl>

                            <div className={styles.links}>
                                {live && (
                                    <a
                                        href={live.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={styles.linkPrimary}
                                    >
                                        {live.name}
                                    </a>
                                )}
                                {github && (
                                    <a
                                        href={github.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={styles.linkSecondary}
                                    >
                                        <FaGithub />
                                        GitHub
                                    </a>
                                )}
                            </div>
                        </header>

                        {/* Mismo `view-transition-name` que la card de origen
                            (landing o /all-projects): el navegador morphea el
                            mockup de la card en esta portada cuando soporta
                            la View Transitions API (ver viewTransition.js).
                            `object-contain` sobre superficie propia, no
                            `cover`: son mockups con su propio fondo, igual
                            criterio que las cards. */}
                        <div className={styles.cover}>
                            <img
                                src={project.image}
                                alt={localized.name}
                                className={styles.coverImage}
                                style={transitionName ? { viewTransitionName: transitionName } : undefined}
                            />
                        </div>

                        {project.techIcons.length > 0 && (
                            <ul className={styles.techList}>
                                {project.techIcons.map((tech) => (
                                    <li key={tech.name} className={styles.techChip}>
                                        <img
                                            src={tech.icon}
                                            alt=""
                                            className={`${styles.techIcon} ${tech.className || ''}`}
                                        />
                                        <span>{tech.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {content && <Markdown className={styles.content}>{content}</Markdown>}

                        <ProjectGallery images={images} languaje={languaje} />
                    </article>
                )}
            </div>
        </section>
    )
}

export default ProjectDetail
