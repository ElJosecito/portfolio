import React from "react";
import ReactDOM from "react-dom/client";
import "../src/assets/styles/style.css";
import App from "./App";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <HashRouter basename="/">
      <App />
    </HashRouter>
  </>
);
