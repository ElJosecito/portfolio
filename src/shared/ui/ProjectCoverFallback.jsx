import React from "react";
import styles from "./ProjectCoverFallback.module.css";

/**
 * Portada tipográfica para un proyecto SIN imagen: el nombre en Milker sobre
 * el degradé cobalto → morado del landing. Existe para dos casos reales:
 *  - proyectos de cliente que no pueden mostrar capturas (Lendy, por
 *    confidencialidad);
 *  - proyectos recién creados cuyas imágenes todavía no se subieron desde
 *    el panel.
 * Sin esto, `<img src="">` dejaba un recuadro roto en la card y el detalle.
 *
 * Ocupa el lugar de la imagen con la misma relación de aspecto que usan las
 * cards (16/10). `label` es opcional (ej. "Mobile · Web").
 */
function ProjectCoverFallback({ name, label, className, style }) {
  return (
    <div
      role="img"
      aria-label={name}
      className={[styles.cover, className].filter(Boolean).join(" ")}
      style={style}
    >
      <span aria-hidden="true" className={styles.name}>
        {name}
      </span>
      {label ? (
        <span aria-hidden="true" className={styles.label}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

export default ProjectCoverFallback;
