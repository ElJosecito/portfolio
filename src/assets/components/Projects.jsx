import React from "react";
import Slider from "./Slider";

function Projects() {
  return (
    <>
      <section
        className="w-full min-h-screen h-screen flex flex-col items-center justify-center"
        id="projects"
      >
        <h2 className="text-5xl font-extrabold text-blue-600 mb-14 md:mt-20">
          Proyectos
        </h2>

        <div className="md:max-w-7xl max-w-5xl w-full m-5 flex flex-col justify-center md:mt-10">
          <Slider/>
          {/* <div className="carousel h-fit w-full max-w-6xl p-4 space-x-4 md:bg-neutral rounded-box flex items-center">
            
            <div
              id="slide1"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <button className="btn btn-circle">❮</button>
                <button className="btn btn-circle">❯</button>
              </div>
            </div>
            
            <div
              id="slide2"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide3" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>

           

            <div
              id="slide3"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
           
            <div
              id="slide4"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide3" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
}

export default Projects;
