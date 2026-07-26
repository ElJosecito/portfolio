import React from "react";

import ProjectCardSkeleton from "./ProjectCardSkeleton";

/**
 * Grilla de cards en carga.
 *
 * `featured` reproduce el reparto del Hero (una card ancha arriba y dos chicas
 * abajo); sin él son todas iguales, como en `/all-projects`. Las clases de
 * columnas son las mismas que usa cada página con los datos ya cargados, así el
 * reemplazo es pieza por pieza y no hay reacomodo.
 */
function ProjectsGridSkeleton({ count = 4, featured = false, label = "Cargando proyectos" }) {
  return (
    <div role="status" aria-live="polite" className="contents">
      {Array.from({ length: count }).map((_, index) => {
        const isLarge = featured && index === 0;

        return (
          <ProjectCardSkeleton
            key={index}
            variant={isLarge ? "large" : "small"}
            className={
              featured
                ? isLarge
                  ? "w-full col-span-6 row-span-2 items-center lg:items-start"
                  : "col-span-6 md:col-span-3 items-center"
                : ""
            }
          />
        );
      })}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default ProjectsGridSkeleton;
