import React from "react";

/**
 * Error boundary genérico y chico, pensado puntualmente para envolver el 3D
 * (ver landing/head/HeadLayer).
 *
 * El motivo (ver revisión, punto 6): el `<Canvas>` de r3f relanza en el
 * componente padre los errores del renderer y de la escena, y `React.lazy`
 * relanza los fallos de import — sin ningún boundary en la app, cualquier
 * falla del 3D (un `.glb` con 404 por un deploy sin `public/models`, un chunk
 * con hash viejo, un `WebGLRenderer` que falla aunque `isWebglAvailable()` ya
 * haya dado `true`) desmonta TODA la app, no solo el pedacito 3D, y deja la
 * página en blanco.
 *
 * Solo las clases pueden usar `getDerivedStateFromError`/`componentDidCatch`
 * — no hay equivalente en hooks todavía (React 19 incluido).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Solo log: no hay telemetría propia en el front todavía. Lo importante
    // es que el resto de la página siga de pie, no perder el error.
    console.error("[ErrorBoundary] se cayó el 3D:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
