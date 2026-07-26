import React from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

import { refractive } from "@hashintel/refractive";

import { localizeProject } from "../../../shared/utils/i18n";

// Fuera del componente: si se creara en cada render, el HOC devolvería un tipo
// nuevo cada vez y React desmontaría y volvería a montar la card entera.
const GlassCard = refractive(motion.div);

/**
 * Card de proyecto compartida entre el Hero (destacados) y la página de proyectos.
 * @param {"large"|"small"} variant - large es la card ancha del Hero: imagen a un
 * lado, texto al otro y nombres de tecnologías visibles.
 */
function ProjectCard({ project, languaje, variant = "small", className = "", delay = 0.3 }) {
  const { name, description } = localizeProject(project, languaje);
  const isLarge = variant === "large";

  // El form guarda GitHub primero y el demo después, pero buscamos por nombre
  // para que un orden distinto en la DB no cambie qué link se pinta dónde.
  const github = project.urls.find((url) => /git/i.test(url.name)) || project.urls[0];
  const live = project.urls.find((url) => url !== github);

  return (
    <GlassCard
      // radius 24 = el rounded-3xl que ya tenía la card. refractive pisa el
      // borderRadius con este número, así que los dos tienen que coincidir.
      refraction={{ radius: 24, blur: 3, bezelWidth: 12, specularOpacity: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      viewport={{ once: true }}
      className={`dark:bg-[#372D48]/45 bg-[#EFE0F4]/55 rounded-3xl flex flex-col overflow-hidden p-5 shadow-md ${className}`}
    >
      <div className={`w-full flex justify-end ${isLarge ? "mb-3 lg:mb-0" : "mb-3"}`}>
        {live && (
          <a
            href={live.url}
            target="_blank"
            rel="noreferrer"
            className=" gap-2 font-medium text-red-600 border border-red-600 hover:scale-110 px-4 py-1 mr-4 rounded-lg transition-transform duration-300 shadow-md"
          >
            {live.name}
          </a>
        )}

        {github && (
          <a
            className={`flex items-center font-medium bg-noon text-dark-grey px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md ${isLarge ? "gap-2" : ""}`}
            href={github.url}
            target="_blank"
            rel="noreferrer"
            title={github.name}
          >
            <FaGithub />
            {isLarge && <span className="hidden lg:flex">GitHub</span>}
          </a>
        )}
      </div>

      <div className={`w-full h-full ${isLarge ? "lg:flex" : ""}`}>
        {/* La imagen y el título llevan al detalle. Los links de GitHub y demo
            quedan afuera de este Link para no anidar anclas. */}
        <Link to={`/projects/${project.slug}`} className={isLarge ? "lg:max-w-lg" : ""}>
          {/* Relación de aspecto fija: las capturas de los proyectos vienen con
              proporciones distintas, así que sin esto cada card mide lo que mida
              su imagen y la grilla se reacomoda a medida que van cargando. */}
          <img
            className={`w-full aspect-[16/10] rounded-2xl object-cover hover:cursor-pointer hover:scale-105 transition-transform duration-300 lg:mr-5`}
            src={project.image}
            alt={name}
            title={name}
            loading="lazy"
            decoding="async"
          />
        </Link>

        <div className="pl-5 lg:pt-8 dark:text-moonlit flex flex-col">
          <div>
            <h3 className="text-5xl font-bold my-5">
              <Link to={`/projects/${project.slug}`} className="hover:opacity-70 transition-opacity">
                {name}
              </Link>
            </h3>
            <p
              className={`text-sm lg:text-base opacity-70 my-5 ${isLarge ? "font-medium lg:ml-1 lg:pr-20" : "font-normal"}`}
            >
              {description}
            </p>
          </div>
          <ul className="mt-auto flex my-6">
            {project.techIcons.map((tech) => (
              <li
                key={tech.name}
                className={`cursor-pointer flex h-10 items-center self-end font-medium bg-[#6a4279] dark:bg-[#020617] px-3 py-1 rounded-lg hover:scale-110 transition-transform duration-300 shadow-md mr-2 ${isLarge ? "text-white" : ""}`}
              >
                <div className={`w-7 flex justify-center items-center ${isLarge ? "lg:mr-3" : ""}`}>
                  <img
                    className={`w-full h-full ${tech.className || ""}`}
                    src={tech.icon}
                    alt={tech.name}
                    title={tech.name}
                  />
                </div>
                {isLarge && <span className="font-bold hidden lg:flex">{tech.name}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}

export default ProjectCard;
