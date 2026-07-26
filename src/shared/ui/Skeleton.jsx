import React from "react";
import { cn } from "./cn";
import { TD, TR } from "./Table";

/**
 * Bloque gris con un barrido de luz que lo cruza.
 *
 * La regla de uso es una sola: el skeleton tiene que ocupar el mismo lugar que
 * el contenido real. Un cartel de "Cargando…" centrado mide mucho menos que la
 * grilla que lo reemplaza, y esa diferencia de alto es la que hace saltar la
 * página cuando llegan los datos.
 *
 * `aria-hidden` a propósito: el lector de pantalla ya se entera del estado por
 * el `role="status"` del contenedor, no necesita que le anuncien cajas vacías.
 */
export function Skeleton({ className = "", ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-xl bg-plum-200/50 dark:bg-plum-800/60",
        "before:absolute before:inset-0 before:content-[''] before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent",
        "dark:before:via-white/10",
        // Sin movimiento lateral para quien lo pidió: queda el latido y nada más.
        "motion-reduce:animate-pulse motion-reduce:before:hidden",
        className
      )}
      {...props}
    />
  );
}

/**
 * Párrafo falso. La última línea va más corta porque un bloque de líneas todas
 * iguales se lee como una tabla, no como texto.
 */
export function SkeletonText({ lines = 3, className = "", lastLineWidth = "55%" }) {
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-3.5 rounded-full"
          style={index === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
}

/**
 * Filas de carga para las tablas del panel.
 *
 * Van tantas filas como suele traer la tabla para que el `Panel` no se encoja y
 * vuelva a crecer, que es lo que pasaba con la fila única de texto.
 */
export function SkeletonRows({ rows = 4, columns = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TR key={rowIndex}>
          {Array.from({ length: columns }).map((_, columnIndex) => {
            // La primera columna es una miniatura o un par de botones: es la que
            // le da el alto a la fila real, así que acá también. La última son
            // las acciones, alineadas a la derecha como en la tabla de verdad.
            const isFirst = columnIndex === 0;
            const isLast = columnIndex === columns - 1;

            return (
              <TD key={columnIndex}>
                <Skeleton
                  className={isFirst ? "h-12 w-12 rounded-lg" : "h-4 rounded-full"}
                  style={
                    isFirst
                      ? undefined
                      : { width: isLast ? "4rem" : "80%", marginLeft: isLast ? "auto" : undefined }
                  }
                />
              </TD>
            );
          })}
        </TR>
      ))}
    </>
  );
}

export default Skeleton;
