import React from "react";
import { createPortal } from "react-dom";

/**
 * Visor de imagen a pantalla completa.
 *
 * Propio y no una librería: es un portal, cuatro teclas y un contador. Lo único
 * que hay que hacer bien es el foco — al abrirse se lo lleva el diálogo y al
 * cerrarse vuelve a la miniatura desde la que se abrió.
 */
export function Lightbox({ images, index, onClose, onNavigate, caption }) {
  const dialogRef = React.useRef(null);
  const previouslyFocused = React.useRef(null);
  const open = index !== null && index >= 0;

  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onNavigate((index + 1) % images.length);
      else if (event.key === "ArrowLeft")
        onNavigate((index - 1 + images.length) % images.length);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, index, images.length, onClose, onNavigate]);

  if (!open) return null;

  const image = images[index];
  if (!image) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Imagen ampliada"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 focus:outline-none"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 rounded-xl p-3 text-2xl text-white/80 hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            className="absolute left-2 rounded-xl p-4 text-3xl text-white/70 hover:bg-white/10 hover:text-white md:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            className="absolute right-2 rounded-xl p-4 text-3xl text-white/70 hover:bg-white/10 hover:text-white md:right-6"
          >
            ›
          </button>
        </>
      )}

      <figure
        className="flex max-h-full flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image.url}
          alt={caption || ""}
          width={image.width}
          height={image.height}
          className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
        />
        <figcaption className="text-center text-sm text-white/70">
          {caption && <span className="block">{caption}</span>}
          {images.length > 1 && (
            <span className="text-white/50">
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
