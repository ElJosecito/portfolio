import React from "react";
import Hero from "../assets/components/Hero";

import { Route, Routes } from "react-router-dom";
import Header from "../assets/components/layout/Header";
import Footer from "../assets/components/layout/Footer";
function Router() {


  return (
    <>
      {/* <!-- Page content here --> */}
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
            </>
          }
        ></Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default Router;
