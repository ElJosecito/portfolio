import React, { useState } from "react";
import styles from "./IntroFallback.module.css";
import { getCurrentLanguage } from "../../../../shared/utils/language";

// Duración y tope de la animación CSS del contador (ver
// IntroFallback.module.css, `intro-fallback-count`: 2.4s lineal hasta 99).
// Tienen que coincidir con el CSS: IntroLoader usa esto para continuar desde
// el mismo número que se estaba viendo cuando termina de bajar su chunk.
const FALLBACK_DURATION_MS = 2400;
const FALLBACK_MAX = 99;

let fallbackStartedAt = null;

/**
 * Número que está mostrando AHORA el contador CSS del fallback (0 si nunca
 * se pintó con contador). Este módulo vive en el chunk principal, así que
 * IntroLoader (chunk de NewLanding) lo puede importar sin arrastrar nada.
 */
export function getFallbackCount() {
  if (fallbackStartedAt === null) return 0;
  const elapsed = performance.now() - fallbackStartedAt;
  return Math.min(FALLBACK_MAX, Math.floor((elapsed / FALLBACK_DURATION_MS) * FALLBACK_MAX));
}

/**
 * Fallback del `Suspense` que envuelve a `NewLanding` en Router.jsx — SOLO
 * para "/" con el landing nuevo (ver `Router.jsx`, se resuelve antes de
 * pintar con `resolveLandingVariant`, sin flash).
 *
 * Antes acá iba `FullPageLoader` (el monograma "JM" genérico, pensado para
 * cualquier ruta) mientras bajaba el chunk de `NewLanding` — como ese chunk
 * incluye a `IntroLoader` (cobalto + contador), el resultado era un salto
 * feo: monograma gris → cobalto con contador, dos pantallas de carga
 * distintas una atrás de la otra para la MISMA espera. Esto reemplaza ese
 * salto por el primer frame real de `IntroLoader` (mismo fondo, mismo
 * layout, mismo contador gigante en Milker) — para cuando el chunk real
 * termina de bajar y `IntroLoader` se monta de verdad, la transición es
 * invisible.
 *
 * Deliberadamente SIN gsap/three ni progreso real (nada de eso puede
 * colarse en el chunk principal solo por este fallback, que se pinta ANTES
 * de que el chunk lazy exista): el contador "cuenta" con una animación CSS
 * pura (`@property` + `@counter-style`, ver el CSS) que no sabe nada del
 * progreso real de descarga — es una aproximación, no una barra de progreso
 * verdadera. Si el navegador no soporta `@property` (Safari viejo), el
 * contador se queda quieto en "000": sigue siendo el mismo fondo/layout que
 * `IntroLoader`, solo sin el tictac — ninguna rotura visible, degrada bien.
 */
/**
 * `withCounter=false` cuando la intro NO va a mostrarse esta sesión (ver
 * `shouldShowIntro`, `introState.js`): si ya se vio una vez en esta pestaña,
 * `IntroLoader` ni se monta, y mostrar el contador contando igual acá
 * terminaría en el salto contrario al que esto existe para evitar (contador
 * animando → desaparece de golpe al hero sin terminar). Sin el contador
 * queda el mismo fondo cobalto que ya comparte `HeroSection` (ver
 * `HeroSection.module.css`, `--color-hero-blue`), así que la transición
 * sigue siendo invisible, solo que sin la cuenta.
 */
function IntroFallback({ withCounter = true }) {
  // Marca el arranque del contador una sola vez (el primer render es el
  // mismo frame en que el CSS empieza la animación).
  useState(() => {
    if (withCounter && fallbackStartedAt === null) fallbackStartedAt = performance.now();
  });

  return (
    <div className={styles.overlay} aria-hidden="true" role="status" aria-live="polite">
      {withCounter && (
        <div className={styles.counterRow}>
          <span className={styles.counter} />
        </div>
      )}
      <span className="sr-only">{getCurrentLanguage().common.loading}</span>
    </div>
  );
}

export default IntroFallback;
