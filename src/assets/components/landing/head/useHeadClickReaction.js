import { useEffect } from "react";
import { triggerHeadReaction } from "./useHeadRig";

/**
 * Detecta clicks/taps SOBRE la cabeza 3D sin que el canvas tenga que recibir
 * eventos (sigue en `pointer-events: none`, ver HeadScene — eso es lo que
 * evita que la cabeza tape clicks al contenido real debajo, ver revisión,
 * punto 2). En vez de un raycast de three.js (que obligaría a este hook a
 * vivir DENTRO del Canvas, con acceso a cámara/escena), se aproxima la
 * cabeza como un círculo en espacio de pantalla:
 *
 *  - el centro sale de `rig.nx/ny` (mismo sistema [-1, 1] que
 *    `usePointerTarget`, origen en el centro de la pantalla);
 *  - el radio es proporcional a `rig.scale` y al lado más chico del
 *    viewport — una aproximación a ojo del tamaño real que ocupa el modelo
 *    renderizado, no una medida exacta de su geometría.
 *
 * Un listener en `window` (no en ningún nodo del layer) es justamente lo que
 * hace que esto NUNCA bloquee un click real: solo mira si el click cayó
 * dentro del círculo para decidir si dispara la reacción, nunca llama
 * `preventDefault`/`stopPropagation` — el link o botón que esté debajo
 * sigue recibiendo su propio evento sin que este hook se entere ni le
 * importe.
 */
const RADIUS_FACTOR = 0.22;

export function useHeadClickReaction(rig) {
  useEffect(() => {
    const handlePointerDown = (event) => {
      const values = rig.current;
      if (!values) return;

      const centerX = (values.nx * 0.5 + 0.5) * window.innerWidth;
      const centerY = (values.ny * 0.5 + 0.5) * window.innerHeight;
      const radius = values.scale * Math.min(window.innerWidth, window.innerHeight) * RADIUS_FACTOR;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      if (dx * dx + dy * dy <= radius * radius) {
        triggerHeadReaction(rig);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [rig]);
}
