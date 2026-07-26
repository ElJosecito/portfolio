import React from "react";

import { Skeleton, SkeletonText } from "../../../shared/ui/Skeleton";

/**
 * Timeline de experiencia en carga. Repite el mismo `grid` y la misma línea
 * vertical de `ExperienceCard`, incluido el punto azul, así el riel ya está
 * dibujado antes de que lleguen los puestos y no aparece de golpe.
 *
 * @param {number} rows - cuántos puestos simular. Tres es lo que suele haber.
 * @param {string} label - lo que anuncia el lector de pantalla. Los textos de
 * carga de `Languajes/` siguen sirviendo acá aunque ya no se pinten.
 */
function ExperienceSkeleton({ rows = 3, label = "Cargando experiencia" }) {
  return (
    <div role="status" aria-live="polite">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="relative mx-12 pb-12 grid before:absolute before:left-[-35px] before:block before:h-full before:border-l-2 before:border-black/20 dark:before:border-white/15 before:content-[''] md:grid-cols-5 md:gap-10 md:space-x-4"
        >
          <div className="relative pb-12 md:col-span-2">
            <div className="sticky top-0 flex flex-col gap-2">
              <span className="text-[#549eff] -left-[42px] absolute rounded-full text-5xl opacity-40">
                &bull;
              </span>
              <Skeleton className="h-5 w-40 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-3.5 w-44 rounded-full" />
            </div>
          </div>

          <div className="relative pb-4 md:col-span-3">
            <SkeletonText lines={3} />
          </div>
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default ExperienceSkeleton;
