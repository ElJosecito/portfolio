import React from "react";

// Directo y no desde el barrel del kit: el índice arrastra los componentes que
// solo usa el panel, y esto lo renderiza la portada.
import { Skeleton, SkeletonText } from "../../../shared/ui/Skeleton";

/**
 * Copia la caja de `ProjectCard` bloque por bloque —fila de botones, imagen,
 * título, descripción y pills de tecnología— para que la card real entre en el
 * mismo hueco y la página no se mueva cuando llegan los datos.
 *
 * @param {"large"|"small"} variant - large es la card ancha del Hero.
 */
function ProjectCardSkeleton({ variant = "small", className = "" }) {
  const isLarge = variant === "large";

  return (
    <div
      className={`dark:bg-[#372D48]/45 bg-[#EFE0F4]/55 rounded-3xl flex flex-col overflow-hidden p-5 shadow-md ${className}`}
    >
      <div className="w-full flex justify-end gap-3 mb-3">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-14 rounded-lg" />
      </div>

      <div className={`w-full h-full ${isLarge ? "lg:flex" : ""}`}>
        <Skeleton
          className={`w-full aspect-[16/10] rounded-2xl ${isLarge ? "lg:max-w-lg lg:mr-5" : ""}`}
        />

        <div className="pl-5 lg:pt-8 flex flex-1 flex-col">
          <Skeleton className="my-5 h-11 w-2/3 rounded-2xl" />
          <SkeletonText lines={isLarge ? 3 : 2} className="my-5" />

          <div className="mt-auto my-6 flex gap-2">
            {Array.from({ length: isLarge ? 4 : 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCardSkeleton;
