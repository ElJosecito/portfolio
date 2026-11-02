/**
 * Soporte de la View Transitions API.
 *
 * Centralizado acá para que las cards (landing + /all-projects) y el detalle
 * compartan un solo feature-detect en vez de repetir `"startViewTransition"
 * in document` en cada archivo. react-router-dom (6.30, ver node_modules)
 * hace el mismo chequeo internamente cuando se le pasa `unstable_viewTransition`
 * a `<Link>`/`navigate` — si el navegador no lo soporta, navega normal, sin
 * romper nada. Esto solo se usa para decidir si vale la pena fijar el
 * `view-transition-name` (que un navegador sin soporte simplemente ignora).
 */
export function supportsViewTransitions() {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function" &&
    !prefersReducedMotionForTransitions()
  );
}

/**
 * `prefers-reduced-motion` también gatea la transición acá, no solo el CSS:
 * así un visitante que la pidió nunca dispara `unstable_viewTransition` (que
 * de todas formas se neutraliza por CSS, ver style.css) y react-router no
 * paga el costo de armar la transición para una animación que va a durar 0ms.
 */
export function prefersReducedMotionForTransitions() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Nombre único de `view-transition-name` por proyecto. Mismo nombre en la
 * card de origen (landing o /all-projects) y en la portada del detalle: es lo
 * que le dice al navegador qué par de elementos morphear entre sí. Tiene que
 * ser válido como `custom-ident` CSS (sin espacios ni caracteres raros) — el
 * slug ya lo es (se valida como tal al guardarlo en el panel).
 */
export function projectTransitionName(slug) {
  return slug ? `project-cover-${slug}` : undefined;
}

/**
 * Prop lista para pasarle a `<Link>` de react-router-dom: activa
 * `document.startViewTransition` en la navegación cuando el navegador lo
 * soporta y nadie pidió reduced motion; en cualquier otro caso queda en
 * `{}` (prop ausente) y el Link navega como siempre.
 *
 * El prop se llama `viewTransition` (sin el prefijo `unstable_`) desde que
 * react-router-dom lo estabilizó — la versión instalada acá es 6.30.4
 * (ver node_modules/react-router-dom/dist/react-router-dom.development.js,
 * que ya no reconoce `unstable_viewTransition`). Con el nombre viejo, React
 * no lo filtra como prop del router y lo cuela como atributo DOM del `<a>`,
 * lo que tira el warning "React does not recognize the `%s` prop" — se
 * reprodujo en QA manual antes de corregir el nombre acá.
 */
export function viewTransitionLinkProps() {
  return supportsViewTransitions() ? { viewTransition: true } : {};
}

export default {
  supportsViewTransitions,
  prefersReducedMotionForTransitions,
  projectTransitionName,
  viewTransitionLinkProps,
};
