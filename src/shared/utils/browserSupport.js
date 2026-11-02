/**
 * Detección de soporte para el filtro SVG que usa `@hashintel/refractive`
 * (ver Header.jsx y Hero.jsx, componente `GlassPanel`). `refractive` aplica
 * el efecto de vidrio vía `backdrop-filter: url(#filtro-svg)`: la SINTAXIS
 * es válida en cualquier navegador (así que `CSS.supports` no sirve para
 * distinguir esto — todos la aceptan sin tirar error), pero solo los
 * motores Blink (Chrome, Edge, Opera, Brave de escritorio/Android) la
 * RENDERIZAN de verdad. En WebKit (Safari, y cualquier navegador en iOS,
 * incluso "Chrome" ahí, porque iOS fuerza WebKit) y en Firefox el filtro
 * simplemente no pinta nada — el panel quedaría sin ningún fondo/blur.
 *
 * Por eso la detección es por motor de render (user-agent), no por
 * feature-detection de CSS: es la única señal confiable disponible sin
 * renderizar el filtro y comparar píxeles.
 */
export function supportsSvgBackdropFilter() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;

  // Cualquier navegador en iOS (Safari, Chrome/CriOS, Firefox/FxiOS) corre
  // sobre WebKit por obligación de Apple, sin importar el nombre de marca.
  if (/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)) return false;

  // Firefox (no basado en Chromium) y Safari de escritorio: sin soporte real.
  if (/Firefox/.test(ua)) return false;
  const isSafariDesktop = /^((?!chrome|android).)*safari/i.test(ua);
  if (isSafariDesktop) return false;

  // Blink: Chrome, Edge (Chromium), Opera, Brave, Chrome Android, etc.
  return /Chrome|Chromium|Edg\//.test(ua);
}
