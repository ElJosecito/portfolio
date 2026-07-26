import React, { Suspense, lazy, useEffect, useState } from "react";
import Hero from "../assets/components/Hero";
import ProtectedRoute from "../assets/components/ProtectedRoute";
import ProjectsPage from "../assets/components/pages/ProjectsPage";

// El panel se carga aparte: nadie que entre a ver el portfolio necesita
// descargar el dashboard, los formularios ni el kit de componentes del admin.
const AdminLogin = lazy(() => import("../assets/components/AdminLogin"));
const AdminDashboard = lazy(() => import("../assets/components/AdminDashboard"));

// El detalle también, porque arrastra el renderer de markdown y la portada no
// lo necesita.
const ProjectDetail = lazy(() => import("../assets/components/pages/ProjectDetail"));

import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../assets/components/layout/Header";
import Footer from "../assets/components/layout/Footer";

//import languajes
import { initLanguage, storeLanguage } from "../shared/utils/language";

//loader
import { FullPageLoader } from "../shared/ui/Loader";

//telón de entrada de la portada
import Curtain from "../assets/components/layout/Curtain";

//fallback del detalle: el mismo skeleton que usa la página ya cargada
import ProjectDetailFallback from "../assets/components/skeletons/ProjectDetailFallback";

/**
 * Sube al tope cada vez que cambia la ruta.
 *
 * Antes cada página lo hacía por su cuenta desde un `useEffect`, así que la
 * portada —que no lo hacía— heredaba el scroll de donde venías. `instant` es
 * explícito para que no dependa de que nadie vuelva a poner `scroll-behavior:
 * smooth` global: ahí el salto se vuelve un deslizamiento y parece un glitch.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function Router() {
  // Inicializador perezoso: el idioma guardado se resuelve antes del primer
  // render, no en un efecto posterior. Ver shared/utils/language.js.
  const [languaje, setLanguaje] = useState(initLanguage);
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  //handle children languaje
  const handleLanguaje = (code) => {
    setLanguaje(storeLanguage(code === "es" ? "es" : "en"));
  };

  return (
    <>
      <ScrollToTop />
      {/* El telón es solo de la portada. Va acá y no dentro del Hero porque
          tiene que tapar también la barra fija, que se monta a este nivel. */}
      {location.pathname === "/" && <Curtain />}
      {/* <!-- Page content here --> */}
      {!hideLayout && <Header onDatos={handleLanguaje} languaje={languaje} />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero languaje={languaje} />
            </>
          }
        ></Route>
        <Route path="/all-projects" element={<ProjectsPage languaje={languaje} />}></Route>
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<ProjectDetailFallback />}>
              <ProjectDetail languaje={languaje} />
            </Suspense>
          }
        ></Route>
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<FullPageLoader label="Cargando panel" />}>
              <AdminLogin />
            </Suspense>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<FullPageLoader label="Cargando panel" />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Router;
