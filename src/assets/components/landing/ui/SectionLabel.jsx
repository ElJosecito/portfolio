import React from "react";
import styles from "./SectionLabel.module.css";

/**
 * Etiqueta mono de sección, tipo anotación de plano: "(02) — EXPERIENCIA".
 * Puramente decorativa/de orientación (el `<h2>` real de cada sección va
 * aparte), reusa la familia `font-tech` que ya define el hero 3D.
 */
function SectionLabel({ index, children, tone = "dark" }) {
  const toneClass = tone === "light" ? styles.toneLight : styles.toneDark;

  return (
    <p className={`${styles.label} ${toneClass}`}>
      <span className={styles.index}>({String(index).padStart(2, "0")})</span> — {children}
    </p>
  );
}

export default SectionLabel;
