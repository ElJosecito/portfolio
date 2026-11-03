import React, { useId, useRef } from "react";
import { Doodle } from "../ui/doodles/Doodle";
import { useFollowArrow } from "./useFollowArrow";
import styles from "./ContactDoodles.module.css";

/**
 * Trazos a mano del contacto (formas y animación compartidas en
 * landing/ui/doodles, ver Doodle.jsx y useDoodles.js). El `order` es el
 * orden de dibujo dentro de la sección: subrayado → destellos del título →
 * estrellita de las redes. La flecha a la cabeza va aparte (sigue al rig,
 * ver HeadArrow).
 */

/** Garabato + destellos del título: van DENTRO de `.titleWrap` (ver ContactSection). */
export function TitleDoodles() {
  return (
    <>
      <Doodle shape="underlineDouble" order={1} className={styles.scribble} />
      <Doodle shape="sparkle" order={2} className={styles.titleSparkle} />
      <Doodle shape="rays" order={2} className={styles.titleRays} />
    </>
  );
}

/**
 * Flecha texto → cabeza + nota que SIGUE a la cabeza (ver useFollowArrow):
 * un SVG del tamaño de la sección cuyos paths se recalculan en cada frame
 * con la posición real del rig, así la punta acompaña a la cabeza mientras
 * llega desde la esquina. Solo escritorio (ver CSS): en pantallas chicas la
 * cabeza se queda chica en la esquina y la flecha no tiene a qué apuntar.
 */
export function HeadArrow({ note, rig, sectionRef }) {
  const curveRef = useRef(null);
  const headRef = useRef(null);
  const noteRef = useRef(null);
  const filterId = `follow-arrow-rough-${useId().replace(/:/g, "")}`;
  useFollowArrow(sectionRef, rig, { curveRef, headRef, noteRef });

  return (
    <div aria-hidden="true" className={styles.followWrap}>
      <svg className={styles.followSvg}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path ref={curveRef} />
          <path ref={headRef} />
        </g>
      </svg>
      <span ref={noteRef} className={styles.followNote}>
        {note}
      </span>
    </div>
  );
}

/** Estrellita junto a las redes: el último trazo, cierra la sección. */
export function SocialsStar() {
  return <Doodle shape="star" order={5} className={styles.socialsStar} />;
}
