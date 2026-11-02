import React, { forwardRef } from "react";
import styles from "./HeroNotes.module.css";

/**
 * Anotaciones técnicas a los costados de la cabeza, tipo notas al margen de
 * un plano. Puramente decorativas (no son contenido que un lector necesite
 * para entender la página), así que van `aria-hidden`: lo mismo ya se dice
 * en prosa real más abajo, en la sección "Sobre mí" del hero clásico.
 *
 * Ocultas por debajo de `lg`: a ese ancho ya no queda margen a los costados
 * de la cabeza (que ocupa casi todo el ancho del hero en mobile, ver
 * useHeadRig/HeroSection) para que una nota de 4 líneas no la toque.
 */
const HeroNotes = forwardRef(function HeroNotes({ notes }, ref) {
  const { topLeft, midLeft, topRight, midRight } = notes;

  return (
    <div ref={ref} aria-hidden="true" className={styles.notes}>
      <NoteBlock lines={topLeft} className={styles.topLeft} />
      <NoteBlock lines={midLeft} className={styles.midLeft} />
      <NoteBlock lines={topRight} className={styles.topRight} />
      <NoteBlock lines={midRight} className={styles.midRight} />
    </div>
  );
});

function NoteBlock({ lines, className }) {
  return (
    <div className={`${styles.noteBlock} ${className}`}>
      {lines.map((line, index) => (
        <span key={index}>{line}</span>
      ))}
    </div>
  );
}

export default HeroNotes;
