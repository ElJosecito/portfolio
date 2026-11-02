import React from "react";
import { createPortal } from "react-dom";

import styles from "./Lightbox.module.css";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Umbral en px: por debajo de esto un swipe se interpreta como un tap/scroll
// vertical, no como "cambiar de imagen".
const SWIPE_THRESHOLD = 50;

/**
 * Visor de imagen a pantalla completa.
 *
 * Propio y no una librería: es un portal, cuatro teclas, un contador y ahora
 * un trap de foco + swipe táctil. Lo único que hay que hacer bien es el foco
 * — al abrirse se lo lleva el diálogo, se queda adentro (Tab no se escapa a
 * la página de atrás) y al cerrarse vuelve a la miniatura desde la que se
 * abrió.
 */
export function Lightbox({ images, index, onClose, onNavigate, caption, languaje }) {
  const dialogRef = React.useRef(null);
  const previouslyFocused = React.useRef(null);
  const touchStart = React.useRef(null);
  const open = index !== null && index >= 0;

  const english = languaje?.languaje === "English";
  const labels = {
    close: english ? "Close" : "Cerrar",
    prev: english ? "Previous" : "Anterior",
    next: english ? "Next" : "Siguiente",
    dialog: english ? "Enlarged image" : "Imagen ampliada",
  };

  const goTo = React.useCallback(
    (nextIndex) => {
      if (!images.length) return;
      onNavigate(((nextIndex % images.length) + images.length) % images.length);
    },
    [images.length, onNavigate]
  );

  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        goTo(index + 1);
        return;
      }
      if (event.key === "ArrowLeft") {
        goTo(index - 1);
        return;
      }

      // Trap de foco: Tab no debe poder escaparse del diálogo mientras está
      // abierto (si no, un lector de pantalla o alguien navegando por teclado
      // termina interactuando con el contenido tapado detrás del overlay).
      if (event.key === "Tab") {
        const node = dialogRef.current;
        if (!node) return;
        const focusable = Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, index, goTo, onClose]);

  // Precarga las imágenes vecinas: al llegar a la última se nota menos el
  // "pop-in" al navegar con flechas o swipe, sin bajar TODA la galería de
  // una (que sería plata perdida para alguien que abre una sola imagen).
  React.useEffect(() => {
    if (!open || images.length < 2) return;

    [index + 1, index - 1].forEach((neighborIndex) => {
      const neighbor = images[((neighborIndex % images.length) + images.length) % images.length];
      if (!neighbor) return;
      const preload = new Image();
      preload.src = neighbor.url;
    });
  }, [open, index, images]);

  const handleTouchStart = (event) => {
    touchStart.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    // Swipe a la izquierda (deltaX negativo) avanza, igual que ArrowRight.
    goTo(deltaX < 0 ? index + 1 : index - 1);
  };

  if (!open) return null;

  const image = images[index];
  if (!image) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={labels.dialog}
      tabIndex={-1}
      className={styles.overlay}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className={styles.closeBtn}
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label={labels.prev}
            onClick={(event) => {
              event.stopPropagation();
              goTo(index - 1);
            }}
            className={`${styles.navBtn} ${styles.navPrev}`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={(event) => {
              event.stopPropagation();
              goTo(index + 1);
            }}
            className={`${styles.navBtn} ${styles.navNext}`}
          >
            ›
          </button>
        </>
      )}

      <figure className={styles.figure} onClick={(event) => event.stopPropagation()}>
        <img
          src={image.url}
          alt={caption || ""}
          width={image.width}
          height={image.height}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          {caption && <span>{caption}</span>}
          {images.length > 1 && (
            <span className={styles.counter}>
              {index + 1} / {images.length}
            </span>
          )}
        </figcaption>
      </figure>
    </div>,
    document.body
  );
}

export default Lightbox;
