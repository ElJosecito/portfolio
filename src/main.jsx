import React from "react";
import ReactDOM from "react-dom/client";
import "../src/assets/styles/style.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { initTheme } from "./shared/theme";

// Antes de renderizar, para que no se vea un parpadeo en claro al entrar.
initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </>
);
