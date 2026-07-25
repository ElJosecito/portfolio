import React from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";
import Button from "./Button";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal.
 *
 * Radix nos daba todo esto gratis; al sacarlo hay que escribirlo. Sin esto el
 * modal es una trampa: el foco se queda atrás en la página, Tab se va a los
 * controles de abajo que no se ven, y Escape no hace nada.
 *
 * - Atrapa el foco adentro mientras está abierto
 * - Devuelve el foco a quien lo abrió al cerrar
 * - Escape y click en el fondo cierran
 * - Bloquea el scroll del body
 */
export function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const panelRef = React.useRef(null);
  const previouslyFocused = React.useRef(null);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // El primer control del modal recibe el foco. Si no hay ninguno, lo toma el
    // panel (por eso lleva tabIndex -1).
    const focusables = panelRef.current?.querySelectorAll(FOCUSABLE);
    (focusables?.[0] || panelRef.current)?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const items = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!items?.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-plum-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-xl focus:outline-none dark:bg-plum-900",
          sizes[size]
        )}
      >
        {(title || description) && (
          <div className="space-y-1 p-6 pb-0">
            {title && (
              <h2
                id={titleId}
                className="text-lg font-bold tracking-tight text-plum-900 dark:text-plum-50"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="text-sm text-plum-500 dark:text-plum-300/80">
                {description}
              </p>
            )}
          </div>
        )}

        {children && <div className="p-6">{children}</div>}

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-plum-100 p-4 dark:border-plum-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/**
 * Confirmación destructiva. Reemplaza a `window.confirm`, que no se puede
 * estilar, bloquea el hilo y en algunos navegadores se puede silenciar entero
 * (y entonces el borrado pasa sin preguntar).
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  description,
  confirmLabel = "Eliminar",
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}

export default Modal;
