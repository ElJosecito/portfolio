import React, { Suspense, lazy, useState } from "react";
import { resolveLandingVariant } from "../../../shared/utils/deviceCapability";
import ErrorBoundary from "../../../shared/ui/ErrorBoundary";
import josecito from "../../images/Josecito.png";
import styles from "./HeaderFaceBadge.module.css";

// three.js vive solo acá adentro, perezoso: el header es global (todas las
// rutas lo montan), así que si este import no fuera lazy, three + fiber +
// drei se colarían en el chunk principal de cada página, no solo en la
// portada. Vite comparte el vendor chunk con FaceScene porque ambos módulos
// importan los mismos paquetes.
const HeaderFaceScene = lazy(() => import("./HeaderFaceScene"));

// Foto estática importada (no `useSiteSettings`): esto se monta en TODAS las
// rutas apenas carga el header, así que no vale la pena colgarlo de un fetch
// a Supabase que puede tardar o fallar. El asset ya está bundleado.
// La foto sí va recortada en círculo: es un rectángulo con fondo. La cabeza 3D
// no, ella gira sola sin placa detrás.
function FallbackPhoto() {
  return <img src={josecito} alt="" className={styles.fallbackImg} />;
}

/**
 * "Vitrina" del header: versión mini de la cabeza 3D girando sola sobre su
 * eje Y (ver FaceModel, mode="spin"), sin placa ni fondo detrás. Reemplaza
 * al wordmark de texto que tenía el header antes.
 *
 * Mismo tamaño para el fallback (foto estática, circular) y para el canvas:
 * los dos ramales del `Suspense` llenan el mismo contenedor, así que no hay
 * salto de layout cuando el chunk de three.js termina de cargar.
 *
 * El gate es el MISMO que usa el Router para decidir el landing completo
 * (ver `resolveLandingVariant`, deviceCapability.js), no uno propio: antes
 * este badge solo miraba WebGL + reduced-motion, así que un equipo "débil"
 * (poca memoria/CPU, o con `?landing=classic` forzado) que el Router ya
 * manda al landing clásico JUSTAMENTE para no cargar three.js terminaba
 * descargándolo igual acá — ~270 kB gz de three.js más el modelo, para un
 * badge de 48px con un segundo contexto WebGL dibujando todo el tiempo (ver
 * revisión, punto 9). Reusar la misma función es lo que mantiene las dos
 * decisiones (landing completo + badge del header) consistentes entre sí.
 */
function HeaderFaceBadge() {
  const [canRender3d] = useState(() => resolveLandingVariant() === "new");

  return (
    <span aria-hidden="true" className={styles.badge}>
      {canRender3d ? (
        // Si el canvas falla después de montar (glb 404, WebGLRenderer que
        // se cae, chunk con hash viejo tras un deploy), el boundary cae a la
        // misma foto estática del Suspense en vez de tirar abajo el header
        // entero — y con él, toda la app (ver revisión, punto 6).
        <ErrorBoundary fallback={<FallbackPhoto />}>
          <Suspense fallback={<FallbackPhoto />}>
            <HeaderFaceScene />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <FallbackPhoto />
      )}
    </span>
  );
}

export default HeaderFaceBadge;
