import React from "react";
import ReactDOM from "react-dom/client";
import "../src/assets/styles/style.css";
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
