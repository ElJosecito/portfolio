import { useEffect, useRef, useState } from "react";
import { invalidate } from "@react-three/fiber";

// Rango de inclinación que se mapea a [-1, 1] (mismo sistema que
// usePointerTarget) — grados de más allá de esto ya saturan en -1/1 en vez
// de seguir creciendo, para que una inclinación extrema del teléfono no
// mande la cabeza a girar más de lo que después acota FaceModel
// (MAX_YAW/MAX_PITCH, ver ese archivo).
const MAX_GAMMA = 30; // izquierda/derecha, grados
const MAX_BETA_RANGE = 25; // adelante/atrás alrededor del reposo, grados
// Beta en reposo sosteniendo el teléfono "normal" (ligeramente inclinado
// hacia el usuario, no 0° = parado totalmente vertical): sin este offset,
// sostenerlo como se sostiene de verdad ya mandaba la cabeza al tope del
// rango de pitch.
const BETA_REST = 45;

/**
 * Variante táctil de usePointerTarget: en vez de la posición del mouse, lee
 * la orientación del dispositivo (acelerómetro/giroscopio) para que la
 * cabeza siga la inclinación del teléfono en vez de quedarse con el
 * balanceo idle (ver FaceModel, modo "rig" sin `targetRef`).
 *
 * iOS exige pedir permiso desde un gesto del usuario
 * (`DeviceOrientationEvent.requestPermission`) — no se puede pedir al
 * montar el componente, tiene que ser la respuesta directa a un tap. Por
 * eso el primer `pointerdown` de la página (no necesariamente sobre la
 * cabeza) dispara el pedido una sola vez.
 *
 * Devuelve `[targetRef, active]`: `active` en `false` significa "sin datos
 * de orientación todavía" (permiso denegado, API inexistente, o el usuario
 * todavía no tocó la pantalla en iOS) — HeadScene lo usa para decidir si
 * cae al balanceo idle en vez de pasar un target inerte en (0, 0).
 */
export function useDeviceTiltTarget(enabled) {
  const targetRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    const handleOrientation = (event) => {
      if (event.beta == null || event.gamma == null) return;
      const point = targetRef.current;
      point.x = Math.max(-1, Math.min(1, event.gamma / MAX_GAMMA));
      point.y = Math.max(-1, Math.min(1, (event.beta - BETA_REST) / MAX_BETA_RANGE));
      invalidate();
      setActive(true);
    };

    const attach = () => window.addEventListener("deviceorientation", handleOrientation);

    const needsPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (!needsPermission) {
      attach();
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }

    const requestOnFirstTap = () => {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === "granted") attach();
          // denegado: `active` se queda en `false`, HeadScene cae al idle.
        })
        .catch(() => {
          // API presente pero falló (navegador raro, contexto no seguro):
          // mismo resultado que denegado, sin romper nada.
        });
    };
    window.addEventListener("pointerdown", requestOnFirstTap, { once: true });

    return () => {
      window.removeEventListener("pointerdown", requestOnFirstTap);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [enabled]);

  return [targetRef, active];
}
