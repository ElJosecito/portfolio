import React, { forwardRef } from "react";
import styles from "./HeroLeaves.module.css";

// Una hoja tipo monstera/banana, simplificada a una forma que sirve para las
// dos esquinas (se espeja con `scaleX(-1)` en vez de dibujar dos paths). El
// corte en el borde (el "mordisco" de la silueta) es lo que la hace leer como
// hoja y no como una gota.
function LeafShape({ className }) {
  return (
    <svg viewBox="0 0 200 220" className={className} fill="none">
      <path
        d="M180 220C170 150 150 90 95 55C60 32 25 28 2 40C35 20 85 10 125 28C168 47 190 95 185 150C183 175 182 198 180 220Z"
        fill="currentColor"
      />
      <path
        d="M95 55C110 95 118 140 112 190M95 55C72 70 48 78 25 78M95 55C118 65 140 80 158 102"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

/**
 * Hojas tropicales fuera de foco, en las dos esquinas inferiores, encima del
 * canvas (pero detrás del strip del pie). Sin imágenes externas: son
 * siluetas SVG inline, con `blur` de CSS para el efecto "foreground
 * desenfocado" en vez de un asset real.
 *
 * `forwardRef` sobre el contenedor completo: es una sola capa para futuras
 * animaciones de scroll, aunque visualmente son dos clusters en esquinas
 * opuestas.
 */
const HeroLeaves = forwardRef(function HeroLeaves(_, ref) {
  return (
    <div ref={ref} aria-hidden="true" className={styles.leaves}>
      {/* Esquina inferior izquierda.
          El parallax (ver FaceHeroSection, `useDomParallax`) mueve todo este
          contenedor hasta `amplitude` px. Antes el cluster solo se corría
          -56px/-48px del borde, bastante menos que eso + el radio del blur:
          cuando el puntero empujaba el cluster hacia el centro, el filtro
          `blur` dejaba de tener de dónde "difuminar" y se veía un corte duro
          justo donde el borde del contenedor (no el de la hoja) topaba con el
          `overflow-hidden` de la sección.
          Ahora el offset (-6rem/-96px) más el tamaño más grande del cluster
          dejan margen de sobra incluso en el peor caso (amplitude 10px +
          blur-lg 16px ≈ 26px de "zona de riesgo"), así el borde recortado
          siempre queda bien afuera de la pantalla. */}
      <div className={styles.leafClusterLeft}>
        <LeafShape className={`${styles.leafFront} ${styles.leafFrontLeft}`} />
        <LeafShape className={`${styles.leafBack} ${styles.leafBackLeft}`} />
      </div>

      {/* Esquina inferior derecha, espejada */}
      <div className={styles.leafClusterRight}>
        <LeafShape className={`${styles.leafFront} ${styles.leafFrontRight}`} />
        <LeafShape className={`${styles.leafBack} ${styles.leafBackRight}`} />
      </div>
    </div>
  );
});

export default HeroLeaves;
