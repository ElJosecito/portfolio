import React from "react";

function Projects() {
  return (
    <>
      <section className="w-full min-h-screen h-fit flex flex-col items-center justify-center " id="projects">
        <h2 className="text-5xl font-extrabold text-blue-600 mt-20">
          Projectos
        </h2>

        <div className="max-w-7xl w-full h-screen flex flex-col justify-center items-center">
          <div className="carousel w-full max-w-6xl p-4 space-x-4 md:bg-neutral rounded-box">
            {/*  */}
            <div id="slide1" className="carousel-item relative w-full flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/07pm0g85utcxakv/Time-Tracking-app.png?raw=1"
                    alt="Time Tracking App"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    Tracking App
                    <a href="https://github.com/ElJosecito/time-tracking-dashboard-main">
                      <div className="badge">Github</div>
                    </a>
                    <a href="https://ornate-empanada-9b5558.netlify.app/">
                      <div className="badge badge-primary">Demo</div>
                    </a>
                  </h2>
                  <p>Esta es una aplicacion que monitorea tu tiempo.</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">HTML</div>
                        <div className="badge badge-outline">CSS</div>
                        <div className="badge badge-outline">JSON</div>
                     </div>
                    </div>
                </div>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                
                <a href="#slide4" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide2" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            {/*  */}
            <div id="slide2" className="carousel-item relative w-full flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/pkurybyh28qvp6k/Pokemon%20App.png?raw=1"
                    alt="Pokemon App"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    Pokemon App
                    <a href="https://github.com/ElJosecito/Pokemon-simple-app">
                      <div className="badge">Github</div>
                    </a>
                    <a href="https://capable-parfait-86f138.netlify.app">
                      <div className="badge badge-primary">Demo</div>
                    </a>
                  </h2>
                  <p>Esta es una pequeña app usando la PokeApi.</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">HTML</div>
                        <div className="badge badge-outline">CSS</div>
                        <div className="badge badge-outline">JS</div>
                        <div className="badge badge-outline">API's</div>

                     </div>
                    </div>
                </div>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide3" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>

            {/*  */}

            <div id="slide3" className="carousel-item relative w-full flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/ma02g5gfxn9znsj/Advice%20app.png?raw=1"
                    alt="Time Tracking App"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    Advice App.
                    <a href="https://github.com/ElJosecito/interactive-rating-component-main">
                      <div className="badge">Github</div>
                    </a>
                    <a href="https://soft-mochi-d9cc85.netlify.app">
                      <div className="badge badge-primary">Demo</div>
                    </a>
                  </h2>
                  <p>Esta es una aplicacion que monitorea tu tiempo.</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">HTML</div>
                        <div className="badge badge-outline">CSS</div>
                        <div className="badge badge-outline">JS</div>
                        <div className="badge badge-outline">API's</div>
                     </div>
                    </div>
                </div>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            {/*  */}
            <div id="slide4" className="carousel-item relative w-full flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/iigsk0bsh3yv75m/NFT.png?raw=1"
                    alt="NFT Card"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    NFT Card.
                    <a href="https://github.com/ElJosecito/nft-interactive-responsive-card">
                      <div className="badge">Github</div>
                    </a>
                    <a href="https://tangerine-gecko-a1d129.netlify.app">
                      <div className="badge badge-primary">Demo</div>
                    </a>
                  </h2>
                  <p>Esta es una simple carta de presentacionde un NFT.</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">HTML</div>
                        <div className="badge badge-outline">CSS</div>
                     </div>
                    </div>
                </div>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide3" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;
