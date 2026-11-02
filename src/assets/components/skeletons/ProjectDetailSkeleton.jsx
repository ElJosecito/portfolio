import React from "react";

import styles from "../pages/ProjectDetail.module.css";

/**
 * Página de detalle en carga, ahora calcada del layout editorial nuevo
 * (`ProjectDetail.module.css`, ver el rediseño). Mismas cajas —chips de
 * plataforma, título, bajada, portada 16:9, chips de tecnología, cuerpo— para
 * que la carga real reemplace pieza por pieza y no haya salto de layout.
 */
function ProjectDetailSkeleton({ label = "Cargando proyecto" }) {
  return (
    <article role="status" aria-live="polite">
      <header className={styles.hero}>
        <div className={styles.metaRow}>
          <span className={styles.skeletonBlock} style={{ width: "4rem", height: "1.5rem" }} />
          <span className={styles.skeletonBlock} style={{ width: "5rem", height: "1.5rem" }} />
        </div>

        <div
          className={styles.skeletonBlock}
          style={{ width: "70%", height: "3.5rem", marginBottom: "0.9rem" }}
        />
        <div
          className={styles.skeletonBlock}
          style={{ width: "90%", height: "1rem", marginBottom: "0.5rem" }}
        />
        <div
          className={styles.skeletonBlock}
          style={{ width: "60%", height: "1rem", marginBottom: "1.5rem" }}
        />

        <div className={styles.links}>
          <span className={styles.skeletonBlock} style={{ width: "7rem", height: "2.4rem", borderRadius: "999px" }} />
          <span className={styles.skeletonBlock} style={{ width: "7rem", height: "2.4rem", borderRadius: "999px" }} />
        </div>
      </header>

      <div className={styles.cover}>
        <span className={styles.skeletonBlock} style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
      </div>

      <div className={styles.techList} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className={styles.skeletonBlock} style={{ width: "6rem", height: "2.2rem" }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={styles.skeletonBlock}
            style={{ width: index === 4 ? "70%" : "100%", height: "0.9rem" }}
          />
        ))}
      </div>

      <span className="sr-only">{label}</span>
    </article>
  );
}

export default ProjectDetailSkeleton;
