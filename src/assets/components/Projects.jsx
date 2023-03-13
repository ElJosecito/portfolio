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
        </div>
      </section>
    </>
  );
}

export default Projects;
