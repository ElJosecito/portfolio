import React from "react";
import ReactDOM from "react-dom/client";
import "../src/assets/styles/style.css";
// Tokens compartidos del landing nuevo (colores, fuentes, z-layers, easings
// — ver el comentario del propio archivo). Se importa UNA sola vez acá, para
// TODA la app: así /all-projects y /projects/:slug (páginas rediseñadas con
// estos mismos tokens, ver ProjectsPage.module.css y ProjectDetail.module.css)
// los tienen disponibles sin tener que volver a declarar el `:root` entero
// en cada CSS Module (que los duplicaba por cada chunk que lo importaba).
import "./assets/components/landing/styles/tokens.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { initTheme } from "./shared/theme";

// Antes de renderizar, para que no se vea un parpadeo en claro al entrar.
initTheme();

// El navegador restaura el scroll de la visita anterior apenas hay documento,
// cuando todavía no llegaron los proyectos ni la experiencia y la página mide
// mucho menos de lo que va a medir. Después crece y la posición restaurada ya
// no corresponde: eso es el salto que se ve al recargar.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </>
);
