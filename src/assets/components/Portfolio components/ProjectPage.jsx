import React from "react";

//react router dom
import { useParams } from "react-router-dom";

//useEffect
import { useEffect, useState } from "react";

//data
import { data } from "../../Data/ProjectData.js";

function ProjectPage() {
  const { id } = useParams();
  const [projectObject, setProjectObject] = useState({});

  const getProject = (id) => {
    const project = data.find((project) => project.id === parseInt(id)); // Asegúrate de convertir el ID a un número si es necesario
    if (project) {
      setProjectObject(project);
    } else {
      // Manejar el caso en el que no se encuentre ningún proyecto con el ID dado
      console.log("No se encontró ningún proyecto con el ID:", id);
    }
  };

  useEffect(() => {
    getProject(id);
  }, [id]);

  return (
    <section className="min-h-screen h-fit w-full py-20 px-5 bg-[#023047]">
      <div className="flex justify-center">
        <div className="max-w-4xl h-fit bg-base-100 shadow-xl bg-white rounded-lg">
          <img
            src={projectObject.image}
            alt={projectObject.alt}
            className="rounded-t-lg w-full object-cover object-center"
          />
          <div className="card-body p-5">
            <div className="flex justify-between w-full">
              <h2 className="sm:card-title text-2xl font-bold">
                {projectObject.title}
              </h2>

              <ul className="flex justify-end">
                <li className="font-bold px-3 py-1 mr-2 outline-1 rounded-full hover:bg-[#302b4e] hover:text-white transition-all duration-150">
                  <a
                    href={projectObject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                </li>
                <li className="font-bold px-3 py-1 mr-2 outline-1 rounded-full hover:bg-[#302b4e] hover:text-white transition-all duration-150">
                  <a
                    href={projectObject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-actions flex w-full">
              {projectObject.technologies &&
                projectObject.technologies.map((technology) => (
                  <div className="py-1 px-3 mr-2 font-light text-xs rounded-full outline outline-1 mt-3">
                    {technology}
                  </div>
                ))}
            </div>
            {/* description */}
            <div className="mt-5 flex w-full">
              <p className="font">{projectObject.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectPage;
