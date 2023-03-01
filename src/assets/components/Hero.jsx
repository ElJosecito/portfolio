import React,{useEffect, useRef} from "react";
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
            className="sm:max-w-md sm:max-h-[28rem] max-h-custom max-w-xs w-full h-full"
          />
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold lg:text-start text-center h-14">
              <span>{text}</span>
              </h1>
            <p className="py-6 lg:text-start text-center mt-4 md:mt-0">
            ¡Hola! Soy un Junior Frontend Developer apasionado por la creación de experiencias digitales únicas y atractivas. Mi objetivo es combinar diseño y funcionalidad para crear soluciones web que cumplan con los requisitos de los usuarios y generen un impacto positivo en su experiencia.
            <br/>
            <br/>
            Tengo experiencia en HTML, CSS y JavaScript, y estoy en constante aprendizaje para mejorar mis habilidades y conocer nuevas tecnologías. Me gusta trabajar en equipo y colaborar con otros para lograr objetivos comunes.
            </p>
            <a href="https://drive.google.com/file/d/1Vce4lT9KvlGgxFumDKi6_UaXMDtIZ-wI/view" target={'_blank'}>
            <button className="btn btn-primary bg-sky-700 hover:bg-sky-900 border-none lg:self-start self-center" src="">Resume</button>
            </a>          
          </div>
        </div>
      </div>
      </section>
    </>
  );
}

export default Hero;
