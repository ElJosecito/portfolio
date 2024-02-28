import React,{useState} from "react";
import Hero from "../assets/components/Hero";

import { Route, Routes } from "react-router-dom";
import Header from "../assets/components/layout/Header";
import Footer from "../assets/components/layout/Footer";

//import languajes
import { English } from "../shared/utils/Languajes/English";
import { Spanish } from "../shared/utils/Languajes/Spanish";

function Router() {

  const [languaje, setLanguaje] = useState(English);

  //handle children languaje
  const handleLanguaje = (languaje) => {
    if (languaje === "es") {
      console.log("es");
      setLanguaje(Spanish);
    } else {
      console.log("en");
      setLanguaje(English);
    }
  };
  

  return (
    <>
      {/* <!-- Page content here --> */}
      <Header onDatos={handleLanguaje} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero languaje={languaje}/>
              <section className="container mx-auto" id="prueba">
                <h1 className="text-4xl font-bold text-center my-8">
                  {languaje.title}
                </h1>
                <p className="text-xl text-center">{languaje.description}</p>
              </section>
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
