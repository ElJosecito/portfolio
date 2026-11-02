/**
 * Preferencias de movimiento del dispositivo, leídas una sola vez.
 *
 * Ninguna de las dos cambia durante la vida de la pestaña (nadie conecta un
 * mouse y lo desconecta a mitad de sesión, ni cambia el ajuste de sistema sin
 * recargar), así que no hace falta un listener: se lee al montar y listo.
 */

// `prefers-reduced-motion`: si está activo, la cabeza no se mueve. Punto.
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Hover fino (mouse real) vs. táctil: en táctil no hay "cursor" que seguir,
// así que la cabeza hace un balanceo propio en vez de perseguir el dedo.
export function hasHoverPointer() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/**
 * Avisa cuando el visitante prende `prefers-reduced-motion` DESPUÉS de que
 * la página ya cargó (ver revisión, lista de accesibilidad: "el movimiento
 * reducido solo se revisa al montar"). Varios loops de animación
 * (`useMarqueeTicker` en StackSection, `useDomParallax`) solo chequeaban
 * `prefersReducedMotion()` una vez, al crear el efecto — cambiar el ajuste
 * del sistema a mitad de sesión no los paraba.
 *
 * Devuelve una función para dejar de escuchar. No hace nada si
 * `matchMedia` no existe (SSR, entornos de test).
 */
export function onReducedMotionChange(callback) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleChange = (event) => callback(event.matches);
  query.addEventListener("change", handleChange);
  return () => query.removeEventListener("change", handleChange);
}
