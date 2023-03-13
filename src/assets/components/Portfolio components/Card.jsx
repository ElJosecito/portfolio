import React from "react";

function Card() {
  return (
    <div className="card w-80 sm:w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://www.dropbox.com/s/pkurybyh28qvp6k/Pokemon%20App.png?raw=1"
          alt="Pokemon App"
        />
      </figure>
      <div className="card-body">
        <h2 className="sm:card-title text-base font-bold">
          Pokemon App
          <a href="https://github.com/ElJosecito/Pokemon-simple-app">
            <div className="badge m-1">Github</div>
          </a>
          <a href="https://capable-parfait-86f138.netlify.app">
            <div className="badge badge-primary">Demo</div>
          </a>
        </h2>
        <p>
          Esta es una pequeña app usando la PokeApi que te muestra un pokemon
          random.
        </p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">HTML</div>
          <div className="badge badge-outline">CSS</div>
          <div className="badge badge-outline">JS</div>
          <div className="badge badge-outline">API's</div>
        </div>
      </div>
    </div>
  );
}

export default Card;
