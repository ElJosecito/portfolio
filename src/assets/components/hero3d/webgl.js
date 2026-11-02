/**
 * Detecta soporte de WebGL sin tocar three.js.
 *
 * Así la sección decide si vale la pena pedir el chunk del 3D (three +
 * fiber + drei no son livianos) antes de importarlo: si no hay WebGL, la
 * sección queda vacía en vez de tirar un canvas roto.
 *
 * Cacheado (ver revisión, punto 12): antes cada llamada creaba un
 * `<canvas>` y un contexto WebGL nuevos y nunca los liberaba. En la ruta
 * nueva esto se llamaba tres veces (Router en cada arranque, HeadLayer,
 * HeaderFaceBadge) — tiempo de sobra en el primer pintado y, sin liberar
 * el contexto de prueba, contra el límite de contextos WebGL simultáneos
 * del navegador. El resultado se cachea en memoria del módulo porque no
 * cambia durante la vida de la pestaña.
 *
 * `failIfMajorPerformanceCaveat: true` descarta el WebGL por software
 * (SwiftShader, llvmpipe, GPUs bloqueadas por la lista negra del
 * navegador): sin esto, esos casos pasaban el filtro y terminaban
 * descargando three.js para un render que de todos modos iba a ir lento.
 */
let cached;

export function isWebglAvailable() {
  if (cached !== undefined) return cached;

  try {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    const gl = canvas.getContext("webgl2", options) || canvas.getContext("webgl", options);
    cached = !!gl;
    // Libera el contexto de prueba: sin esto queda un contexto WebGL vivo
    // sin ningún uso real, sumando contra el límite del navegador.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }

  return cached;
}
