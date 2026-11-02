import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import FaceModel, { MODEL_PATH } from "../../hero3d/FaceModel";
import { usePointerTarget } from "../../hero3d/usePointerTarget";
import { useDeviceTiltTarget } from "../../hero3d/useDeviceTiltTarget";
import { hasHoverPointer, prefersReducedMotion } from "../../hero3d/motionPreferences";

// Mismo `MODEL_PATH` que el hero3d viejo y la vitrina del header: el cache de
// drei es por URL, así que el .glb no se descarga de nuevo si alguno de los
// otros ya lo pidió.
useGLTF.preload(MODEL_PATH);

/**
 * La escena 3D persistente del landing nuevo: un solo Canvas fijo de pantalla
 * completa (ver HeadLayer) para toda la página, no uno por sección. Así la
 * cabeza puede "viajar" del hero a la esquina sin desmontarse ni perder su
 * estado entre secciones.
 *
 * Misma cámara/luces que el hero3d original (FaceScene) a propósito: es la
 * misma composición, solo que ahora maneja su posición/escala/rotación base
 * con `rig` (ver useHeadRig) en vez de quedarse fija en el centro.
 */
// Cuánto se mueve la luz clave hacia la proyección del puntero en el plano
// z=0 de la cabeza, en unidades de mundo — bastante menos que el radio real
// de la cabeza: la idea es que la luz "se asome" desde la dirección del
// cursor, no que lo siga 1:1 (eso ya lo hace la rotación, ver FaceModel).
const LIGHT_FOLLOW_RANGE = 2.5;
const LIGHT_BASE_POSITION = [2, 2, 3];
const LIGHT_DAMPING = 4;

/**
 * Luz direccional clave que se acerca hacia la dirección del puntero (ver
 * usePointerTarget/useDeviceTiltTarget — el mismo `targetRef` que ya hace
 * girar la cabeza) en vez de quedarse fija. Un `useFrame` propio, separado
 * del de FaceModel, porque anima un objeto de la escena (la luz) y no el
 * group de la cabeza — mezclar las dos cosas en un solo callback no suma
 * nada y hace `FaceModel` más difícil de leer.
 */
function KeyLight({ targetRef }) {
  const lightRef = useRef(null);

  useFrame((state, delta) => {
    const light = lightRef.current;
    if (!light || !targetRef) return;

    const targetX = LIGHT_BASE_POSITION[0] + targetRef.current.x * LIGHT_FOLLOW_RANGE;
    const targetY = LIGHT_BASE_POSITION[1] - targetRef.current.y * LIGHT_FOLLOW_RANGE;

    const THREE_damp = (current, target, lambda, dt) =>
      // Mismo damp independiente de FPS que usa FaceModel, pero sin
      // importar `three` acá solo para esta cuenta — una exponencial simple
      // alcanza para una luz, no hace falta la precisión de MathUtils.damp.
      current + (target - current) * (1 - Math.exp(-lambda * dt));

    const nextX = THREE_damp(light.position.x, targetX, LIGHT_DAMPING, delta);
    const nextY = THREE_damp(light.position.y, targetY, LIGHT_DAMPING, delta);

    if (Math.abs(targetX - nextX) > 0.001 || Math.abs(targetY - nextY) > 0.001) {
      state.invalidate();
    }

    light.position.x = nextX;
    light.position.y = nextY;
  });

  return (
    <directionalLight
      ref={lightRef}
      position={LIGHT_BASE_POSITION}
      intensity={1.8}
    />
  );
}

function HeadScene({ rig }) {
  const followsPointer = hasHoverPointer() && !prefersReducedMotion();
  const pointerTarget = usePointerTarget(followsPointer);

  // Táctil: sin hover fino, se intenta el giroscopio (ver
  // useDeviceTiltTarget) antes de caer al balanceo idle de FaceModel.
  const isTouch = !hasHoverPointer();
  const [tiltTarget, tiltActive] = useDeviceTiltTarget(isTouch && !prefersReducedMotion());

  const targetRef = followsPointer ? pointerTarget : tiltActive ? tiltTarget : null;

  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      // "demand": no redibuja solo porque sí a 60-120 Hz un canvas de
      // pantalla completa (ver revisión, punto 14) — redibuja únicamente
      // cuando algo lo pide con `invalidate()`: el scroll (gsap ticker en
      // useHeadRig), el puntero (usePointerTarget) y, mientras el damping
      // de FaceModel no se asentó todavía, el propio useFrame de FaceModel
      // (modo "rig") pide un frame más en cada vuelta hasta alcanzar el
      // target.
      frameloop="demand"
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, -0.05, 5.6], fov: 35 }}
      // @react-three/fiber 9.8.2 envuelve el canvas en un div con
      // `pointerEvents: "auto"` inline cuando no se le pasa `eventSource`
      // (ver react-three-fiber.esm.js). Ese `auto` le gana al
      // `pointer-events-none` del contenedor de HeadLayer: un canvas
      // invisible de pantalla completa en z-20 se comía los clics/hover del
      // footer y de las cards de proyectos (ver revisión, punto 2). El
      // `style` de este prop se aplica DESPUÉS del valor por defecto de r3f,
      // así que pisa el `auto`. La cabeza no necesita eventos del canvas: el
      // puntero se lee desde `window` (ver usePointerTarget).
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <KeyLight targetRef={targetRef} />
      <directionalLight position={[-2, 0.5, -2]} intensity={0.35} />
      <Suspense fallback={null}>
        <FaceModel mode="rig" rigRef={rig} targetRef={targetRef} />
      </Suspense>
    </Canvas>
  );
}

export default HeadScene;
