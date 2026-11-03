import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";

export const MODEL_PATH = "/models/face.glb";

// Cuánto gira la cabeza como máximo: sigue al cursor pero no da vueltas raras.
const MAX_YAW = THREE.MathUtils.degToRad(30);
const MAX_PITCH = THREE.MathUtils.degToRad(20);

// Qué tan rápido "alcanza" el ángulo objetivo cada frame (más alto = más
// seco). THREE.MathUtils.damp ya es independiente de los FPS.
const DAMPING = 6;

// Balanceo propio cuando no hay puntero que seguir (táctil): lento y chico,
// para que se note que está "viva" sin llamar la atención.
const IDLE_SPEED = 0.4;
const IDLE_YAW = THREE.MathUtils.degToRad(8);

// Cuánto pesa el puntero sobre la rotación "rig" (landing nuevo): la cabeza
// ya trae una rotación base que viene del scroll (ver useHeadRig), así que el
// aporte del mouse se reduce a propósito — sumar el rango completo de
// MAX_YAW/MAX_PITCH encima de una base ya rotada (ej. en la esquina, "de
// perfil") la hacía girar más de la cuenta.
//
// Este peso se multiplica por `rig.scale` (ver abajo), no es un número fijo:
// en la esquina la cabeza está mucho más chica (CORNER/CORNER_MOBILE en
// useHeadRig) que en el hero, así que el aporte del mouse ahí también se
// achica en la misma proporción. Con el yaw base de la esquina a ~65-70° de
// perfil, esto es lo que garantiza que el puntero nunca la hace "rebotar" de
// vuelta a mirar para afuera de la página — el pedido explícito del usuario.
// 0.7: en el hero (escala 0.8) da ±17° de yaw y ±11° de pitch — antes, con
// 0.4, eran ±10°/±6° y el usuario pidió que se notara más el seguimiento. En
// la esquina (escala 0.22) quedan ±5°, lejos de voltearla hacia afuera.
const RIG_POINTER_WEIGHT = 0.7;

// Umbral para considerar que el damp "llegó": por debajo de esto el ojo ya
// no distingue el movimiento, así que no vale la pena seguir pidiendo frames
// (ver `frameloop="demand"` en HeadScene, revisión punto 14). Posición en
// unidades de mundo tres.js, ángulos en radianes — por eso son dos
// constantes separadas, no una sola.
const SETTLE_POSITION_EPSILON = 0.001;
const SETTLE_ANGLE_EPSILON = 0.001;

// Entrada de la cabeza al cargar el modelo: crece desde escala 0 hasta la
// pose objetivo en vez de aparecer de golpe (ver revisión, punto 17 e "ideas
// de pulido"). Reutiliza el mismo `DAMPING` que ya ablanda posición/rotación
// en el modo "rig" — no hace falta una curva de easing aparte.
const ENTRANCE_SCALE = 0;

/**
 * La cabeza. Gira sobre un `group` propio y no sobre la escena del glTF
 * directamente, porque `<Center>` ya recentra la malla adentro de ese group y
 * no conviene mezclar ambos transforms.
 *
 * `mode`:
 *  - "rig": landing nuevo — posición, escala y rotación base vienen de
 *    `rigRef` (ver useHeadRig, que las escribe desde el progreso de scroll
 *    con gsap/ScrollTrigger, no desde React state). El seguimiento al
 *    puntero (si `targetRef` llega) se suma encima de esa base, no la
 *    reemplaza: por eso la cabeza puede estar "de perfil" en la esquina y
 *    seguir reaccionando un poco al mouse desde ahí.
 *
 * Los modos "pointer"/"idle"/"static" (el hero3d experimental viejo, antes
 * del rediseño) se borraron junto con `FaceHeroSection`/`FaceScene`, sus
 * únicos consumidores: ver revisión, P3 "Código muerto".
 */
function FaceModel({ targetRef, mode, rigRef }) {
  const { scene: cachedScene } = useGLTF(MODEL_PATH);
  const groupRef = useRef(null);
  // Si ya se hizo la entrada desde escala 0 (ver más abajo): una sola vez
  // por instancia montada, no en cada cambio de `scene`.
  const enteredRef = useRef(false);

  // `useGLTF` cachea y devuelve SIEMPRE el mismo objeto `scene` para la misma
  // URL. Un `Object3D` de three.js solo puede tener un padre a la vez, así
  // que si dos `<primitive object={scene} />` (hero + vitrina del header)
  // montan el mismo objeto, el segundo se lo "roba" al primero en vez de
  // aparecer en los dos — por eso la cabeza desaparecía del que montaba
  // antes. Clonarlo por instancia es el patrón estándar de drei para
  // reusar un mismo glTF varias veces en la escena.
  //
  // Ojo: `clone(true)` clona los nodos pero NO los materiales — los clones
  // siguen apuntando al mismo material que el original. Se clona también
  // cada material para que cada instancia (hero del landing + vitrina del
  // header) tenga el suyo, aunque hoy ya no haga falta para un fade de
  // opacidad por instancia (la cabeza se esconde por apilamiento CSS en
  // Proyectos, no por material, ver useHeadRig/ProjectsSection). Las
  // texturas sí se siguen compartiendo (material.clone() copia la
  // referencia), así que no cuesta memoria extra mantenerlo.
  // Meshy exporta un mapa de metalicidad: sin un environment map que reflejar,
  // las zonas "metálicas" se ven oscuras y apagadas. Una cara no es metal.
  //
  // El ajuste de material vive DENTRO del `useMemo` que clona, no en un
  // `useEffect` aparte (ver revisión, "Detalles menores"): un efecto corre
  // después del primer pintado, así que los primeros frames salían con el
  // material metálico oscuro original del glTF y recién se corregían un
  // tick más tarde — un flash visible cada vez que se monta una instancia
  // nueva (hero del landing, vitrina del header).
  //
  // Materiales opacos en todos los modos: la cabeza del landing ya no se
  // esconde con un fade de opacidad (`rig.presence`) — se esconde por
  // apilamiento CSS al pasar por Proyectos (ver useHeadRig y
  // ProjectsSection, `relative z-30 isolate`). Un material `transparent` de
  // doble cara se dibuja en dos pasadas sin necesidad, así que no vale la
  // pena mantenerlo solo por si algún día vuelve un fade real.
  const scene = useMemo(() => {
    const instance = cachedScene.clone(true);
    instance.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material = child.material.clone();
      child.material.metalness = 0;
      child.material.metalnessMap = null;
      child.material.transparent = false;
      child.material.needsUpdate = true;
    });
    return instance;
  }, [cachedScene]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Entrada: la primera vez que este group tiene un frame para animar,
    // arranca en escala 0 — el damp de abajo (modo "rig") lo va a crecer
    // hacia su pose real, en vez de aparecer de golpe apenas termina de
    // descargarse el modelo (ver revisión, punto 17, y la idea de pulido de
    // "entrada de la cabeza").
    // `prefersReducedMotion` ya filtró este componente entero fuera del
    // landing nuevo (ver deviceCapability.js), así que no hace falta
    // revisarlo de nuevo acá: si este useFrame corre, es seguro animar.
    if (!enteredRef.current) {
      group.scale.setScalar(ENTRANCE_SCALE);
      enteredRef.current = true;
    }

    if (mode === "rig") {
      const rig = rigRef?.current;
      if (!rig) return;

      // nx/ny llegan en [-1, 1] con origen en el centro de la pantalla (mismo
      // sistema que usePointerTarget). Para convertirlos a mundo 3D hace
      // falta saber cuánto "mide" el frustum de la cámara en el plano z=0
      // (donde vive la cabeza, ver <Center>): mitad de esa altura es
      // tan(fov/2) * distancia, y el ancho sale de multiplicar por el aspect
      // — que r3f ya mantiene sincronizado con el tamaño del canvas, así que
      // no hace falta escuchar resize acá.
      const { camera } = state;
      const distance = camera.position.z;
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
      const halfWidth = halfHeight * camera.aspect;

      const worldX = rig.nx * halfWidth;
      // -ny: en pantalla "y" crece hacia abajo, en three.js crece hacia arriba.
      const worldY = -rig.ny * halfHeight;

      const nextX = THREE.MathUtils.damp(group.position.x, worldX, DAMPING, delta);
      const nextY = THREE.MathUtils.damp(group.position.y, worldY, DAMPING, delta);
      const nextScale = THREE.MathUtils.damp(group.scale.x, rig.scale, DAMPING, delta);

      let pointerYaw = 0;
      let pointerPitch = 0;
      if (targetRef) {
        // Ver comentario de RIG_POINTER_WEIGHT: el peso escala con
        // `rig.scale`, así que parada y chica en la esquina la cabeza casi
        // no reacciona al mouse, y de tamaño completo en el hero sigue
        // respondiendo como antes.
        const pointerWeight = RIG_POINTER_WEIGHT * THREE.MathUtils.clamp(rig.scale, 0, 1);
        pointerYaw = targetRef.current.x * MAX_YAW * pointerWeight;
        pointerPitch = targetRef.current.y * MAX_PITCH * pointerWeight;
      } else {
        // Táctil/sin hover fino: mismo balanceo propio que "idle", pero más
        // sutil porque se suma sobre una base que ya puede estar rotada.
        pointerYaw = Math.sin(state.clock.elapsedTime * IDLE_SPEED) * IDLE_YAW * 0.5;
      }

      // `rig.spin`: la reacción de click/tap (ver useHeadRig,
      // triggerHeadReaction) — un giro de 360° extra que se SUMA al yaw
      // base, no lo reemplaza, así la cabeza sigue "mirando" hacia donde
      // tenga que mirar según el scroll una vez que termina de girar.
      const yawTarget = rig.yaw + pointerYaw + (rig.spin || 0);
      const pitchTarget = rig.pitch + pointerPitch;
      const nextYaw = THREE.MathUtils.damp(group.rotation.y, yawTarget, DAMPING, delta);
      const nextPitch = THREE.MathUtils.damp(group.rotation.x, pitchTarget, DAMPING, delta);

      // Mientras el damp no "llegó" a su objetivo (ver SETTLE_*_EPSILON),
      // seguir pidiendo un frame más: con `frameloop="demand"` (HeadScene,
      // revisión punto 14) nadie vuelve a llamar a este useFrame si nada lo
      // invalida, y sin esto la cabeza se congelaría a mitad de camino en
      // cuanto dejara de llegar un `invalidate()` externo (scroll/puntero).
      // Comparado contra el OBJETIVO, no contra el paso de este frame: el
      // damp se acerca cada vez menos, así que el tamaño del paso por sí
      // solo nunca llega a cero. Sin puntero (táctil), el balanceo idle
      // nunca "se asienta" del todo — es intencional, es lo que la
      // mantiene viva sin requerir mouse.
      const settled =
        Math.abs(worldX - nextX) < SETTLE_POSITION_EPSILON &&
        Math.abs(worldY - nextY) < SETTLE_POSITION_EPSILON &&
        Math.abs(rig.scale - nextScale) < SETTLE_POSITION_EPSILON &&
        Math.abs(yawTarget - nextYaw) < SETTLE_ANGLE_EPSILON &&
        Math.abs(pitchTarget - nextPitch) < SETTLE_ANGLE_EPSILON;

      group.position.x = nextX;
      group.position.y = nextY;
      group.scale.setScalar(nextScale);
      group.rotation.y = nextYaw;
      group.rotation.x = nextPitch;

      if (!settled) state.invalidate();

      // Ya no hay nada que leer/escribir de `rig.presence`: la cabeza se
      // esconde por apilamiento (la sección opaca de Proyectos la tapa, ver
      // ProjectsSection), así que el group se queda siempre visible — es la
      // sección la que decide qué se ve, no este componente.
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default FaceModel;
