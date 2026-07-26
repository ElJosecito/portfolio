import React from "react";

import { Skeleton, SkeletonText } from "../../../shared/ui/Skeleton";

/**
 * Página de detalle en carga: badges de plataforma, título, bajada, botones,
 * portada, pills de tecnología y cuerpo.
 *
 * La portada va con `aspect-[16/9]` porque es lo que reserva la imagen real: sin
 * eso el markdown de abajo se dibuja arriba y baja de golpe cuando la imagen
 * termina de decodificar.
 */
function ProjectDetailSkeleton({ label = "Cargando proyecto" }) {
  return (
    <article role="status" aria-live="polite">
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>

        <Skeleton className="my-4 h-14 w-3/4 rounded-2xl lg:h-16" />
        <SkeletonText lines={2} lastLineWidth="40%" />

        <div className="mt-6 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </header>

      <Skeleton className="mb-8 aspect-[16/9] w-full rounded-3xl" />

      <div className="mb-10 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-28 rounded-lg" />
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <SkeletonText lines={4} />
        <SkeletonText lines={3} lastLineWidth="70%" />
      </div>

      <span className="sr-only">{label}</span>
    </article>
  );
}

export default ProjectDetailSkeleton;
