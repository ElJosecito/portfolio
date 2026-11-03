import React from "react";
import { cn } from "./cn";
import { Skeleton } from "./Skeleton";
import styles from "./Loader.module.css";

/**
 * Espera de página completa: skeleton con la silueta de una página del sitio
 * (etiqueta, título, bajada y una grilla de cards) más una barra de progreso
 * fina arriba. Reemplaza al monograma "JM" que se escribía en bucle en el
 * centro de la pantalla: un logo animado se siente como "pantalla de carga";
 * la silueta de lo que viene se siente como que la página ya está llegando, y
 * ocupa más o menos el mismo lugar que el contenido real, así el cambio no
 * salta.
 *
 * Se usa en los `Suspense` de las rutas con carga diferida (landing clásica,
 * /all-projects, panel, verificación de sesión). NO en "/" con el landing
 * nuevo: ese usa IntroFallback, continuo con la intro real.
 *
 * El texto solo existe para el lector de pantalla (`role="status"`).
 */
export function FullPageLoader({ label = "Cargando", className = "" }) {
  return (
    <div role="status" aria-live="polite" className={cn(styles.page, className)}>
      <span aria-hidden="true" className={styles.progress} />

      <div aria-hidden="true" className={styles.content}>
        <Skeleton className={styles.kicker} />
        <Skeleton className={styles.title} />
        <Skeleton className={styles.lead} />

        <div className={styles.grid}>
          {[0, 1, 2].map((index) => (
            <div key={index} className={styles.card}>
              <Skeleton className={styles.cardImage} />
              <Skeleton className={styles.cardLine} />
              <Skeleton className={styles.cardLineShort} />
            </div>
          ))}
        </div>
      </div>

      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}

export default FullPageLoader;
