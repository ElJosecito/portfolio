import "./assets/styles/tailwind.css";
import Router from "./Router";
import { Route, Routes } from "react-router-dom";
import Portfolio from "./assets/components/Portfolio components/Portfolio";
import { useEffect } from "react";



function App() {
  return (
    <>
        <Routes>
          <>
            <Route path="/" element={<Router/>}></Route>
            <Route path="portafolio" element={<Portfolio/>}></Route>
          </>
        </Routes>
    </>
  );
}

export default App;
