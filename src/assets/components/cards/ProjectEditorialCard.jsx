import React from "react";
import { Link } from "react-router-dom";

import { localizeProject } from "../../../shared/utils/i18n";
import { projectTransitionName, viewTransitionLinkProps } from "../../../shared/utils/viewTransition";
import styles from "./ProjectEditorialCard.module.css";

/**
 * Card del grid de /all-projects, en el lenguaje visual del landing nuevo
 * (ver ProjectEditorialCard.module.css). Separada a propósito de
 * `cards/ProjectCard.jsx`, que sigue en Tailwind y la usa el Hero clásico —
 * tocarla hubiera significado redecorar también la landing vieja.
 *
 * El mockup lleva el mismo `view-transition-name` que su contraparte en
 * `ProjectDetail`: es lo que hace que el navegador los morphee entre sí al
 * navegar (ver viewTransition.js). `unstable_viewTransition` en el Link
 * envuelve esa navegación en `document.startViewTransition` cuando el
 * navegador lo soporta; si no, el prop queda ausente y el Link navega igual.
 */
function ProjectEditorialCard({ project, languaje }) {
  const { name, description } = localizeProject(project, languaje);
  const transitionName = projectTransitionName(project.slug);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={styles.card}
      {...viewTransitionLinkProps()}
    >
      <div className={styles.imageWrap}>
        <img
          src={project.image}
          alt={name}
          loading="lazy"
          decoding="async"
          className={styles.image}
          style={transitionName ? { viewTransitionName: transitionName } : undefined}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          {project.platforms?.map((platform) => (
            <span key={platform} className={styles.platformChip}>
              {languaje.projects.filters[platform] || platform}
            </span>
          ))}
        </div>

        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>

        {project.techIcons.length > 0 && (
          <div className={styles.techRow}>
            {project.techIcons.map((tech) => (
              <span key={tech.name} className={styles.techChip}>
                {tech.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default ProjectEditorialCard;
