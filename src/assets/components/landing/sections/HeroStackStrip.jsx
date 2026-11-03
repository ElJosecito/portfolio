import React, { useEffect, useRef, useState } from "react";
import { useMarqueeTicker } from "../ui/useMarqueeTicker";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";
import { INTRO_DONE_EVENT } from "../intro/introState";
import { HERO_STACK_ITEMS } from "./stackData";
import styles from "./HeroStackStrip.module.css";

// Velocidad base bien baja (ver tarea: ~40px/s) a propósito — a diferencia
// de la grilla de StackSection, esto es decorado de fondo del hero, no
// contenido a leer: no debe competir por atención con el nombre gigante ni
// con la cabeza 3D.
const BASE_SPEED = 40;
const MAX_EXTRA_SPEED = 140;

/**
 * Franja de stack al pie del hero — vuelve el marquee que vivía en
 * StackSection (ver git history / ticket: se borró por error como "código
 * muerto", el usuario lo pidió de vuelta). Mismo mecanismo que antes
 * (useMarqueeTicker, ahora compartido desde landing/ui), pero una sola fila,
 * más lenta, y en bajo contraste: es textura ambiental sobre el cobalto, no
 * una segunda sección de stack (esa ya existe, dedicada, más abajo).
 */
function HeroStackStrip({ awaitIntro = false }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(!awaitIntro);

  useMarqueeTicker(sectionRef, [{ containerRef: trackRef, reverse: false }], {
    baseSpeed: BASE_SPEED,
    maxExtraSpeed: MAX_EXTRA_SPEED,
  });

  // Igual patrón que `useHeroEntrance` en HeroSection: si la intro está
  // activa, esta franja espera el mismo evento de fin de intro antes de
  // mostrarse (si no, aparecía un instante antes de que el overlay de la
  // intro termine de abrirse). Es solo un fade de opacidad por CSS, no un
  // tween de GSAP — no hay nada que la intro pudiera "grabar" mal.
  useEffect(() => {
    if (!awaitIntro) return undefined;
    const show = () => setVisible(true);
    window.addEventListener(INTRO_DONE_EVENT, show, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, show);
  }, [awaitIntro]);

  const reduced = prefersReducedMotion();

  return (
    <div
      ref={sectionRef}
      className={styles.strip}
      data-visible={visible || undefined}
    >
      <div className={styles.fadeMask}>
        {reduced ? (
          <StripCopy items={HERO_STACK_ITEMS} readable />
        ) : (
          <div ref={trackRef} className={styles.track} style={{ willChange: "transform" }}>
            {[0, 1, 2].map((copy) => (
              <StripCopy key={copy} items={HERO_STACK_ITEMS} readable={copy === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Una copia de la lista de tecnologías separadas por "✦". Solo la primera
 * copia (`readable`) queda expuesta a un lector de pantalla — las otras dos
 * son puramente decorativas (relleno del loop infinito), mismo criterio que
 * ya se usaba en el marquee viejo de StackSection.
 */
function StripCopy({ items, readable }) {
  return (
    <ul aria-hidden={readable ? undefined : "true"} className={styles.copyList}>
      {items.map(({ label, Icon }, index) => (
        <li key={index} className={styles.item}>
          {Icon ? <Icon aria-hidden="true" className={styles.icon} /> : null}
          <span>{label}</span>
          <span aria-hidden="true" className={styles.separator}>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export default HeroStackStrip;
