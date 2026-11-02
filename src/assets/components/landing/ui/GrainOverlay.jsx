import React from "react";
import styles from "./GrainOverlay.module.css";

/**
 * Textura de grano sutil para las secciones de color plano (cobalto del
 * hero/contacto, morado oscuro de stack): sin esto una superficie de color
 * liso a pantalla completa se ve "digital". Un único tile de ruido en SVG
 * (barato, no un PNG pesado) repetido y con una animación por `steps()` que
 * salta entre un puñado de posiciones — un grano real necesitaría
 * recalcularse por frame, esto es la versión barata que igual rompe la
 * uniformidad del color de fondo.
 *
 * `pointer-events: none` y `aria-hidden`: puramente decorativo, nunca debe
 * interceptar clicks ni ser lo que lee un lector de pantalla.
 */
function GrainOverlay() {
  return <div aria-hidden="true" className={styles.grain} />;
}

export default GrainOverlay;
