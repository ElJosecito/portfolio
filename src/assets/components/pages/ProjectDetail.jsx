import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

import { useProject } from '../../../shared/hooks/useProjects'
import { useProjectImages } from '../../../shared/hooks/useProjectImages'
import ProjectGallery from '../ProjectGallery'
import { isEnglish, localizeProject } from '../../../shared/utils/i18n'
// Directo y no desde el barrel: importar el índice del kit haría que la página
// pública se lleve también los componentes que solo usa el panel.
import Markdown from '../../../shared/ui/Markdown'

function ProjectDetail({ languaje }) {
    const { slug } = useParams()
    const { project, loading, notFound } = useProject(slug)
    const { images } = useProjectImages(project?.id)

    const english = isEnglish(languaje)
    const localized = project ? localizeProject(project, languaje) : null
    const content = project
        ? (english && project.content_en) || project.content
        : null

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    useEffect(() => {
        document.title = localized
            ? `${localized.name} || ElJosecito`
            : 'Proyecto || ElJosecito'
    }, [localized])

    const github = project?.urls.find((url) => /git/i.test(url.name)) || project?.urls[0]
    const live = project?.urls.find((url) => url !== github)

    return (
        <section className="relative flex w-full justify-center bg-noon p-5 pb-20 pt-32 dark:bg-slate-950 sm:pt-36">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute inset-0 bg-fuchsia-300 opacity-20 blur-[100px]" />

            <div className="z-10 w-full max-w-4xl dark:text-moonlit">
                <Link
                    to="/all-projects"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100"
                >
                    ← {english ? 'Back to projects' : 'Volver a proyectos'}
                </Link>

                {loading ? (
                    <p className="flex h-96 items-center justify-center text-xl">
                        {languaje.projects.loading}
                    </p>
                ) : notFound || !project ? (
                    <div className="flex h-96 flex-col items-center justify-center gap-4">
                        <p className="text-xl">
                            {english ? 'Project not found' : 'Proyecto no encontrado'}
                        </p>
                        <Link
                            to="/all-projects"
                            className="rounded-lg bg-[#6a4279] px-4 py-2 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105"
                        >
                            {languaje.projects.projectsBtn}
                        </Link>
                    </div>
                ) : (
                    <article>
                        <header className="mb-8">
                            <div className="mb-3 flex flex-wrap gap-2">
                                {project.platforms.map((platform) => (
                                    <span
                                        key={platform}
                                        className="rounded-lg bg-[#6a4279] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white dark:bg-[#020617]"
                                    >
                                        {languaje.projects.filters[platform] || platform}
                                    </span>
                                ))}
                            </div>

                            <h1 className="my-4 text-5xl font-bold lg:text-6xl">{localized.name}</h1>
                            <p className="text-lg opacity-70">{localized.description}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {live && (
                                    <a
                                        href={live.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg border border-red-600 px-4 py-2 font-medium text-red-600 shadow-md transition-transform duration-300 hover:scale-105"
                                    >
                                        {live.name}
                                    </a>
                                )}
                                {github && (
                                    <a
                                        href={github.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-noon px-4 py-2 font-medium text-dark-grey shadow-md transition-transform duration-300 hover:scale-105"
                                    >
                                        <FaGithub />
                                        GitHub
                                    </a>
                                )}
                            </div>
                        </header>

                        <img
                            src={project.image}
                            alt={localized.name}
                            className="mb-8 w-full rounded-3xl object-cover shadow-md"
                        />

                        {project.techIcons.length > 0 && (
                            <ul className="mb-10 flex flex-wrap gap-2">
                                {project.techIcons.map((tech) => (
                                    <li
                                        key={tech.name}
                                        className="flex h-10 items-center gap-2 rounded-lg bg-[#6a4279] px-3 py-1 font-medium text-white shadow-md dark:bg-[#020617]"
                                    >
                                        <img
                                            src={tech.icon}
                                            alt=""
                                            className={`h-6 w-6 ${tech.className || ''}`}
                                        />
                                        <span className="text-sm font-bold">{tech.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {content && <Markdown>{content}</Markdown>}

                        <ProjectGallery images={images} languaje={languaje} />
                    </article>
                )}
            </div>
        </section>
    )
}

export default ProjectDetail
