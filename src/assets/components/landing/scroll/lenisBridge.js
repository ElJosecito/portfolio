/**
 * Puente mínimo entre Lenis y código que no sabe nada de Lenis (como
 * `ScrollToTop` en Router.jsx, que corre en TODAS las rutas).
 *
 * Lenis intercepta el scroll nativo y anima su propio scroll "virtual": un
 * `window.scrollTo()` de otro código cambia el scrollTop real, pero Lenis no
 * se entera y en el próximo frame lo pisa con el valor que él todavía cree
 * que es el correcto — el resultado se ve como que la página "rebota" de
 * vuelta a donde estaba. Guardar la instancia activa acá (y nada más, ningún
 * import de Lenis en este archivo) deja que Router pida el reset sin tener
 * que importar Lenis/gsap él mismo, así esos paquetes no se cuelan en el
 * chunk principal solo por culpa de `ScrollToTop`.
 */
let activeLenis = null;

// Alto del header fijo (ver layout/Header.jsx: `h-16 sm:h-20`). Usamos el
// mayor de los dos a propósito: Lenis no sabe en qué breakpoint está el
// visitante, y pasarse unos pixeles de offset en desktop (donde el header
// mide 80px) se nota mucho menos que quedar debajo del header en mobile
// (donde mide 64px) — más offset de lo necesario nunca tapa el inicio de la
// sección, menos sí.
export const HEADER_HEIGHT = 80;

export function setActiveLenis(instance) {
  activeLenis = instance;
}

export function resetScrollPosition() {
  if (activeLenis) {
    activeLenis.scrollTo(0, { immediate: true });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

/**
 * Scrollea suave a un id de sección. Mismo problema que resetScrollPosition:
 * un `element.scrollIntoView({behavior:"smooth"})` nativo mientras Lenis está
 * activo arranca, pero en el siguiente frame del rAF de Lenis el scroll
 * "vuelve" a donde Lenis cree que tiene que estar — se ve como que el nav no
 * hizo nada (o te devuelve arriba de un salto). Usa Lenis cuando está
 * montado (Header y Footer, los dos con links de navegación por sección, no
 * saben si están sobre el landing nuevo o el clásico); si no hay Lenis activo
 * (landing clásico, u otra ruta), cae al `scrollIntoView` nativo de siempre.
 */
export function scrollToSection(sectionId) {
  if (activeLenis) {
    // `offset: -HEADER_HEIGHT` resta del destino: sin esto, el tope de cada
    // sección caía justo debajo del header fijo, con sus primeros ~80px
    // tapados (ver revisión, punto 11).
    activeLenis.scrollTo(`#${sectionId}`, { offset: -HEADER_HEIGHT, duration: 1.2 });
    return;
  }
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}
