import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { hasHoverPointer, prefersReducedMotion } from "../../hero3d/motionPreferences";
import styles from "./CustomCursor.module.css";

/**
 * Cursor custom para escritorio con mouse real (`hasHoverPointer`): un
 * círculo con `mix-blend-mode: difference` que sigue al puntero, crece sobre
 * links/botones y muestra "VER →"/"VIEW →" sobre las cards de proyectos
 * (ver `data-cursor-label` en ProjectsSection). Nunca en táctil — ahí no hay
 * cursor que reemplazar, y mostrar este círculo sin un puntero real que lo
 * mueva se vería roto.
 *
 * El cursor nativo se esconde solo mientras este componente está montado
 * (clase en `<body>`, ver CustomCursor.module.css con `:global`) — se
 * restaura al desmontar, así que ninguna otra ruta queda sin cursor.
 */
function CustomCursor({ languaje }) {
  const dotRef = useRef(null);
  const enabled = hasHoverPointer();
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (!enabled) return undefined;

    document.body.classList.add(styles.cursorHideNative);

    const el = dotRef.current;
    if (!el) return undefined;

    // Reduced motion: seguimiento directo, sin el suavizado de
    // `gsap.quickTo` (pedido explícito del encargo: "no smoothing").
    const moveX = reduced ? (x) => gsap.set(el, { x }) : gsap.quickTo(el, "x", { duration: 0.15, ease: "power3.out" });
    const moveY = reduced ? (y) => gsap.set(el, { y }) : gsap.quickTo(el, "y", { duration: 0.15, ease: "power3.out" });

    const handleMove = (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const isInteractive = (target) => target.closest("a, button, [role='button']");
    const projectLabel = languaje?.landing?.projects?.viewProject
      ? `${languaje.landing.projects.viewProject} →`
      : "→";

    const handleOver = (event) => {
      const projectCard = event.target.closest("[data-cursor='view']");
      if (projectCard) {
        el.dataset.state = "project";
        el.textContent = projectLabel;
        return;
      }
      if (isInteractive(event.target)) {
        el.dataset.state = "interactive";
        el.textContent = "";
      }
    };

    const handleOut = (event) => {
      const stillInteractive =
        event.relatedTarget instanceof Element &&
        (event.relatedTarget.closest("[data-cursor='view']") || isInteractive(event.relatedTarget));
      if (!stillInteractive) {
        el.dataset.state = "default";
        el.textContent = "";
      }
    };

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);

    return () => {
      document.body.classList.remove(styles.cursorHideNative);
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      gsap.killTweensOf(el);
    };
  }, [enabled, reduced, languaje]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} aria-hidden="true" className={styles.cursor} data-state="default" />
  );
}

export default CustomCursor;
