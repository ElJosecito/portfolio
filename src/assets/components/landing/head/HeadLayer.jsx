import React, { Suspense, lazy, useState } from "react";
import { isWebglAvailable } from "../../hero3d/webgl";
import ErrorBoundary from "../../../../shared/ui/ErrorBoundary";
import { useHeadClickReaction } from "./useHeadClickReaction";
import styles from "./HeadLayer.module.css";

// three.js (+ fiber/drei) vive en su propio chunk: el gate de variante
// (deviceCapability.js) ya filtró a quien no tiene WebGL antes de montar
// `NewLanding`, pero este `isWebglAvailable()` de acá es la misma defensa que
// ya usaba FaceHeroSection — si por lo que sea no hay WebGL, el layer no pide
// el chunk y el landing sigue andando sin cabeza, sin canvas roto.
const HeadScene = lazy(() => import("./HeadScene"));

/**
 * Capa fija de pantalla completa para la cabeza 3D: un solo Canvas para TODO
 * el landing (no uno por sección), para que pueda "viajar" entre secciones
 * sin desmontarse. `pointer-events-none` todo el tiempo — es decorativo,
 * nunca debe robarle clicks al contenido real debajo o alrededor.
 *
 * z-20: mismo nivel que tenía el canvas del hero3d viejo respecto al nombre
 * gigante (z-10, ver HeroSection) — el efecto de que la cabeza se superponga
 * al nombre se mantiene. El resto de las secciones ponen su contenido en
 * z-30 o más, así el header (z-50) y el texto de cada sección quedan siempre
 * por encima de esta capa.
 */
function HeadLayer({ rig }) {
  const [webglOk] = useState(() => isWebglAvailable());
  // El listener de click/tap vive siempre (no dentro del `if` de abajo): si
  // mañana `webglOk` cambia de falso a verdadero no pasa en esta sesión, así
  // que en la práctica el early return de abajo ya decide si hace falta.
  useHeadClickReaction(rig);
  if (!webglOk) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      {/* Sin fallback visible a propósito: la cabeza es decorativa, así que
          si el 3D falla (glb 404, WebGLRenderer caído, chunk viejo tras un
          deploy) el landing simplemente sigue sin ella en vez de quedar en
          blanco entero (ver revisión, punto 6). */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <HeadScene rig={rig} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default HeadLayer;
