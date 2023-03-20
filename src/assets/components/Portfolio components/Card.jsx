import React from "react";

function Card({img, title, description, github, demo, tec, alt} = data) {
  return (
    <div className="card w-80 sm:w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src={img}
          alt={alt}
        />
      </figure>
      <div className="card-body">
        <h2 className="sm:card-title text-base font-bold">
          {title}
          <a href={github}>
            <div className="badge m-1">Github</div>
          </a>
          <a href={demo}>
            <div className="badge badge-primary">Demo</div>
          </a>
        </h2>
        <p>
          {description}
        </p>
        <div className="card-actions justify-end">
          {tec.map((technology) => (
            <div className="badge badge-outline">{technology}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Card;
