import React from "react";
import ReactDOM from "react-dom/client";
import "../src/assets/styles/style.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </>
);
