import { useEffect, useRef } from "react";
import { invalidate } from "@react-three/fiber";

/**
 * Posición del puntero normalizada a [-1, 1] en los dos ejes, con origen en
 * el centro de la ventana. Se escucha en `window` y no en el canvas: la
 * cabeza tiene que girar hacia el cursor esté o no arriba del 3D.
 *
 * Devuelve un ref y no estado: el valor se lee dentro de un `useFrame`, en
 * cada frame, y pasar esto por React en cada pixel de movimiento del mouse
 * sería un render por frame para algo que nadie más necesita leer.
 *
 * `enabled` en false (táctil, reduced-motion) ni siquiera agrega el listener.
 *
 * `invalidate()` sin argumentos (ver @react-three/fiber) pide un frame en
 * TODOS los canvas montados, no en uno puntual — justo lo que hace falta
 * acá, porque este hook corre afuera del Canvas (HeadScene lo llama antes
 * de montar `<FaceModel>`) y con `frameloop="demand"` (ver HeadScene, punto
 * 14) nadie vuelve a pedir un frame nuevo si el puntero se mueve sin que el
 * damping de rotación esté todavía en marcha.
 */
export function usePointerTarget(enabled) {
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (event) => {
      // Muta el mismo objeto en vez de crear uno nuevo por evento (ver
      // revisión, "Detalles menores"): `pointermove` puede disparar a
      // cientos por segundo con un mouse de gaming, y cada `{ x, y }` nuevo
      // era basura para el GC que nadie necesitaba — nadie más que
      // `FaceModel` lee este ref, y lo lee por valor, no por identidad.
      const point = targetRef.current;
      point.x = (event.clientX / window.innerWidth) * 2 - 1;
      point.y = (event.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [enabled]);

  return targetRef;
}
