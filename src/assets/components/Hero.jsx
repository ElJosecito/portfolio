import React from "react";
import Josecito from '../source/Josecito.png'

function Hero() {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src={Josecito}
            className="sm:max-w-md max-w-xs"
          />
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold lg:text-start text-center">Box Office News!</h1>
            <p className="py-6 lg:text-start text-center">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary bg-sky-500 hover:bg-sky-700 border-none lg:self-start self-center">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
