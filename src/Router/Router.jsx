import React, { useState } from "react";
import Hero from "../assets/components/Hero";
import AdminLogin from "../assets/components/AdminLogin";
import AdminDashboard from "../assets/components/AdminDashboard";
import ProtectedRoute from "../assets/components/ProtectedRoute";
import ProjectsPage from "../assets/components/pages/ProjectsPage";

import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../assets/components/layout/Header";
import Footer from "../assets/components/layout/Footer";

//import languajes
import { English } from "../shared/utils/Languajes/English";
import { Spanish } from "../shared/utils/Languajes/Spanish";

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
        <Route path="/admin/login" element={<AdminLogin />}></Route>
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}></Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Router;
