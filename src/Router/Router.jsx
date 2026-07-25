import React, { Suspense, lazy, useState } from "react";
import Hero from "../assets/components/Hero";
import ProtectedRoute from "../assets/components/ProtectedRoute";
import ProjectsPage from "../assets/components/pages/ProjectsPage";

// El panel se carga aparte: nadie que entre a ver el portfolio necesita
// descargar el dashboard, los formularios ni el kit de componentes del admin.
const AdminLogin = lazy(() => import("../assets/components/AdminLogin"));
const AdminDashboard = lazy(() => import("../assets/components/AdminDashboard"));

import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../assets/components/layout/Header";
import Footer from "../assets/components/layout/Footer";

//import languajes
import { English } from "../shared/utils/Languajes/English";
import { Spanish } from "../shared/utils/Languajes/Spanish";

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-noon text-plum-500 dark:bg-plum-950 dark:text-plum-300">
      Cargando panel…
    </div>
  );
}

function Router() {
  const [languaje, setLanguaje] = useState(English);
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  //handle children languaje
  const handleLanguaje = (languaje) => {
    if (languaje === "es") {
      setLanguaje(Spanish);
    } else {
      setLanguaje(English);
    }
  };

  return (
    <>
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
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AdminFallback />}>
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
