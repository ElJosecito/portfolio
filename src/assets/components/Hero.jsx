import React,{useEffect, useRef} from "react";
// import Typed from "typed.js";
import { useTypewriter, Cursor } from 'react-simple-typewriter'

function Hero() {
  
    const [text] = useTypewriter({
      words: ["Hola, Soy Jose","Bienvenido a mi Portafolio"],
      loop: true,
      cursorStyle: '|',
      cursorBlinking: true,
      typeSpeed: 100,
    })

  return (
    <>
      <section id="hero">
      <div className="hero min-h-screen h-fit bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse ">
          <img
            src="https://www.dropbox.com/s/eqmgvvzribux11s/Josecito.png?raw=1"
            className="sm:max-w-md max-w-xs"
          />
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold lg:text-start text-center h-14">
              <span>{text}</span>
              </h1>
            <p className="py-6 lg:text-start text-center mt-4">
            Soy un desarrollador Frontend Junior apasionado por crear experiencias de usuario sorprendentes. Me encanta el desafío de transformar diseños en código y trabajar en equipo para llevar proyectos al siguiente nivel. Me gusta estar al tanto de las últimas tendencias y tecnologías en el mundo del desarrollo web
            </p>
            <button className="btn btn-primary bg-sky-700 hover:bg-sky-900 border-none lg:self-start self-center">Resume</button>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}

export default Hero;
