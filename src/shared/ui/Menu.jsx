import React from "react";
import { cn } from "./cn";

const MenuContext = React.createContext(null);

/**
 * Menú desplegable con teclado.
 *
 * Igual que el modal, esto lo daba Radix. Un menú que solo responde al mouse
 * deja el admin inusable con teclado, así que acá está lo mínimo del patrón
 * ARIA: flechas para moverse, Home/End para los extremos, Escape para cerrar
 * devolviendo el foco al botón, y click afuera para descartar.
 */
export function Menu({ children, className = "" }) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const itemsRef = React.useRef([]);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  React.useEffect(() => {
    if (open && activeIndex >= 0) itemsRef.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const close = React.useCallback(
    ({ restoreFocus = true } = {}) => {
      setOpen(false);
      setActiveIndex(-1);
      if (restoreFocus) triggerRef.current?.focus();
    },
    []
  );

  const value = {
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    close,
    triggerRef,
    itemsRef,
  };

  return (
    <MenuContext.Provider value={value}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuTrigger({ children, className = "", label = "Abrir menú" }) {
  const { open, setOpen, setActiveIndex, triggerRef } = React.useContext(MenuContext);

  const onKeyDown = (event) => {
    // Abrir con flecha ya deja parado en el primer o último item, que es lo que
    // espera quien navega con teclado.
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(-2); // lo resuelve MenuList como "el último"
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={label}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
        "text-plum-600 hover:bg-plum-100 dark:text-plum-200 dark:hover:bg-plum-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-500",
        className
      )}
    >
      {children}
    </button>
  );
}

export function MenuList({ children, align = "end", className = "" }) {
  const { open, activeIndex, setActiveIndex, close, itemsRef } =
    React.useContext(MenuContext);

  const items = React.Children.toArray(children);
  itemsRef.current = itemsRef.current.slice(0, items.length);

  React.useEffect(() => {
    if (activeIndex === -2) setActiveIndex(items.length - 1);
  }, [activeIndex, items.length, setActiveIndex]);

  if (!open) return null;

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (event.key === "Tab") {
      close({ restoreFocus: false });
    }
  };

  return (
    <div
      role="menu"
      onKeyDown={onKeyDown}
      className={cn(
        "absolute z-40 mt-1 min-w-[11rem] overflow-hidden rounded-xl border p-1 shadow-lg",
        "border-plum-200 bg-white dark:border-plum-700 dark:bg-plum-900",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {items.map((item, index) =>
        React.isValidElement(item)
          ? React.cloneElement(item, { ref: (node) => (itemsRef.current[index] = node) })
          : item
      )}
    </div>
  );
}

export function MenuLabel({ children }) {
  return (
    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-plum-400">
      {children}
    </p>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-plum-100 dark:bg-plum-800" />;
}

export const MenuItem = React.forwardRef(function MenuItem(
  { onSelect, danger = false, children, className = "", ...props },
  ref
) {
  const { close } = React.useContext(MenuContext);

  return (
    <button
      ref={ref}
      role="menuitem"
      type="button"
      tabIndex={-1}
      onClick={() => {
        // Cerrar antes de actuar: si la acción abre un modal, el foco tiene que
        // haber vuelto al trigger primero o se lo roban entre los dos.
        close();
        onSelect?.();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        "focus:outline-none",
        danger
          ? "text-red-600 hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 dark:focus:bg-red-950/50"
          : "text-plum-700 hover:bg-plum-50 focus:bg-plum-50 dark:text-plum-100 dark:hover:bg-plum-800 dark:focus:bg-plum-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default Menu;
