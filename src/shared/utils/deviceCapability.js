import { isWebglAvailable } from "../../assets/components/hero3d/webgl";
import { prefersReducedMotion } from "../../assets/components/hero3d/motionPreferences";

/**
 * Gate que decide si el visitante ve el landing nuevo (3D + scroll animado) o
 * el clásico (bento estático, sin three.js ni gsap/lenis).
 *
 * Se resuelve de forma síncrona y se llama ANTES del primer render (desde
 * Router, como useState inicial): si esto fuera un efecto, se vería un
 * flash del landing nuevo (o del viejo) antes de corregirse.
 *
 * Reglas, todas deben cumplirse para "capaz":
 *  - WebGL disponible (si no, ni vale la pena pedir el chunk de three.js).
 *  - Sin `prefers-reduced-motion`: el gate ya resuelve esa preferencia acá;
 *    el landing nuevo no tiene que volver a chequearla para decidir si
 *    existir, aunque sí la respeta puntualmente en sus propias animaciones
 *    (ver useLenisScroll) para quien la activa después de cargar la página.
 *  - `navigator.deviceMemory` ausente (Safari no lo expone) o >= 4 GB.
 *  - `navigator.hardwareConcurrency` ausente o >= 4 núcleos.
 *  - `navigator.connection?.saveData` desactivado: si el visitante activó
 *    "ahorro de datos" en el navegador, no vale la pena bajarle de todos
 *    modos three.js + el glb solo porque su hardware aguanta.
 *
 * Override manual por query string para QA: `?landing=classic` fuerza el
 * viejo, `?landing=new` fuerza el nuevo, pasando por encima de las
 * heurísticas de hardware (pero no de la detección de WebGL: sin WebGL no
 * hay nada que mostrar en el nuevo, así que el override no lo fuerza).
 */
export function resolveLandingVariant() {
  if (typeof window === "undefined") return "classic";

  const override = new URLSearchParams(window.location.search).get("landing");

  const webglOk = isWebglAvailable();

  if (override === "classic") return "classic";
  if (override === "new") return webglOk ? "new" : "classic";

  if (!webglOk) return "classic";
  if (prefersReducedMotion()) return "classic";
  if (navigator.connection?.saveData) return "classic";

  const memory = navigator.deviceMemory;
  if (typeof memory === "number" && memory < 4) return "classic";

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores < 4) return "classic";

  return "new";
}
