import React from "react";

function Card({ id, img, title, github, demo, tec, alt, lenguaje }) {

  const handleUrl = (id) => {
    window.location.href = `/project/${id}`;
  }

  return (
   
     <div
      className=" w-80 sm:w-96 h-fit bg-base-100 shadow-xl bg-white rounded-lg">
      <img
        src={img}
        alt={alt}
        className="rounded-t-lg w-full object-cover object-center"
      />
      <div className="card-body p-5">
        <div className="flex justify-between w-full">
          <h2 className="sm:card-title text-lg font-bold">{title}</h2>

          <ul className="flex justify-end">
            <li className="font-bold px-3 py-1 mr-2 outline-1 rounded-full hover:bg-[#302b4e] hover:text-white transition-all duration-150">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"  
              >
                Github
              </a>
            </li>
            <li className="font-bold px-3 py-1 outline-1 rounded-full hover:bg-[#302b4e] hover:text-white transition-all duration-150">
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo
              </a>
            </li>
          </ul>
        </div>
        <div className="card-actions flex w-full">
          {tec.map((technology, index) => (
            <div className="py-1 px-3 mr-2 font-light text-xs rounded-full outline outline-1 mt-2" key={index}>{technology}</div>
          ))}
        </div>
      </div>

      {/* ver mas */}
      <div className="flex justify-center py-2">
        <button
          onClick={() => handleUrl(id)}
          className="bg-[#ffb703] text-white px-5 py-1 rounded-full hover:bg-[#302b4e] transition-all duration-150"
        >
          {lenguaje.projects.btns}
        </button>
        </div>
    </div>
  );
}

export default Card;
