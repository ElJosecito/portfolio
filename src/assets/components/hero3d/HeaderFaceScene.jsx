import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import FaceModel, { MODEL_PATH } from "./FaceModel";
import styles from "./HeaderFaceScene.module.css";

// Mismo `MODEL_PATH` que el resto de los consumidores de la cabeza: el cache
// de glTF de drei es por URL, así que si el hero ya lo pidió (o lo pide
// después), es el mismo archivo — no se descarga dos veces por tener dos
// consumidores.
useGLTF.preload(MODEL_PATH);

// Pausa el loop de render cuando la pestaña no está visible O el badge no
// está en pantalla (ver revisión, punto 14). No tiene sentido seguir girando
// la cabeza (ni gastar batería/CPU) en una pestaña en segundo plano que nadie
// está mirando — el header es `fixed`, así que hoy nunca sale del viewport
// por scroll, pero el `IntersectionObserver` es la misma defensa barata por
// si el menú móvil, un futuro rediseño o un navegador raro lo tapan.
function useCanvasVisible(nodeRef) {
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === "undefined" || !document.hidden
  );
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [nodeRef]);

  return tabVisible && onScreen;
}

/**
 * Mini escena 3D de la "vitrina" del header: la misma cabeza del hero, pero
 * en modo "spin" (gira sola, no sigue al puntero — ver FaceModel). Vive en su
 * propio módulo lazy (ver HeaderFaceBadge) para que three.js no entre al
 * chunk principal: el header es global, pero el canvas no se pide hasta que
 * hace falta.
 *
 * `dpr` tope en 1.5 (no 2 como el hero) y cámara/luces idénticas al hero para
 * que la cara se vea igual de encuadrada, solo que en miniatura: es la misma
 * composición, no una escena nueva que calibrar de cero.
 */
function HeaderFaceScene() {
  // Wrapper propio para el `IntersectionObserver` (ver useCanvasVisible):
  // `Canvas` ya mete su propio div contenedor adentro, pero necesitamos un
  // nodo ESTABLE para observar desde el primer render, antes de que r3f
  // termine de montar el suyo.
  const wrapperRef = useRef(null);
  const visible = useCanvasVisible(wrapperRef);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Canvas
        flat
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, -0.05, 5.6], fov: 35 }}
        // Mismo gotcha de r3f que HeadScene (ver su comentario): sin esto, el
        // div interno del canvas trae `pointerEvents: "auto"` inline. Acá no
        // rompe nada porque el click igual burbujea al <button> que lo envuelve
        // (ver HeaderFaceBadge), pero lo dejamos explícito y consistente: el
        // canvas es decorativo, el click lo maneja el botón, no la escena 3D.
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 2, 3]} intensity={1.8} />
        <directionalLight position={[-2, 0.5, -2]} intensity={0.35} />
        <FaceModel mode="spin" />
      </Canvas>
    </div>
  );
}

export default HeaderFaceScene;
