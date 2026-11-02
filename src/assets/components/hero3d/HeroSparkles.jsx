import React from "react";
import { prefersReducedMotion } from "./motionPreferences";
import styles from "./HeroSparkles.module.css";

// Posiciones en porcentaje del contenedor, bien repartidas para no pisar ni
// el nombre (centro) ni las notas (ver HeroNotes). `mobile: false` saca el
// sparkle en pantallas chicas: ahí el margen a los costados ya es poco.
const SPARKLES = [
  { top: "16%", left: "10%", size: 14, delay: 0, mobile: true },
  { top: "32%", left: "6%", size: 10, delay: 0.6, mobile: false },
  { top: "72%", left: "14%", size: 12, delay: 1.1, mobile: true },
  { top: "20%", left: "90%", size: 12, delay: 0.3, mobile: true },
  { top: "48%", left: "93%", size: 16, delay: 1.5, mobile: false },
  { top: "78%", left: "86%", size: 10, delay: 0.9, mobile: true },
  { top: "8%", left: "48%", size: 9, delay: 1.8, mobile: false },
  { top: "90%", left: "52%", size: 11, delay: 0.4, mobile: false },
];

/**
 * Sparkles ✦ de fondo, bajo perfil, con un titileo apenas perceptible.
 *
 * Decorativo al 100%: `aria-hidden` en el contenedor y SVG inline en vez de
 * un ícono de alguna librería, para no sumar una dependencia por un adorno
 * tan chico.
 */
function HeroSparkles() {
  const reducedMotion = prefersReducedMotion();

  return (
    <div aria-hidden="true" className={styles.sparkles}>
      {SPARKLES.map((sparkle, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          width={sparkle.size}
          height={sparkle.size}
          className={`${styles.sparkle} ${sparkle.mobile ? "" : styles.hideOnMobile} ${
            reducedMotion ? "" : styles.twinkle
          }`}
          style={{
            top: sparkle.top,
            left: sparkle.left,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <path d="M12 0c0 6.6 1 10 12 12-11 2-12 5.4-12 12 0-6.6-1-10-12-12 11-2 12-5.4 12-12Z" />
        </svg>
      ))}
    </div>
  );
}

export default HeroSparkles;
