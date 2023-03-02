import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


// import required modules
import {Navigation } from "swiper";

function Slider() {
  return (
    <>
      <div>
      <Swiper
      navigation={true}
      modules={[Navigation]}
      className="mySwiper"
          >
            <SwiperSlide>
              <div className="w-full flex justify-center">
              <div className="card w-80 sm:w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/07pm0g85utcxakv/Time-Tracking-app.png?raw=1"
                    alt="Time Tracking App"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="sm:card-title text-base font-bold">
                    Tracking App
                    <a href="https://github.com/ElJosecito/time-tracking-dashboard-main">
                      <div className="badge m-1">Github</div>
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
              </div>
            </SwiperSlide>


            <SwiperSlide>
              <div className="w-full flex justify-center">
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
                  <p>Esta es una pequeña app usando la PokeApi que te muestra un pokemon random.</p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">HTML</div>
                    <div className="badge badge-outline">CSS</div>
                    <div className="badge badge-outline">JS</div>
                    <div className="badge badge-outline">API's</div>
                  </div>
                </div>
              </div>
              </div>
            </SwiperSlide>


            <SwiperSlide>
              <div className="w-full flex justify-center">
              <div className="card w-80 sm:w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/ma02g5gfxn9znsj/Advice%20app.png?raw=1"
                    alt="Time Tracking App"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="sm:card-title text-base font-bold">
                    Advice App.
                    <a href="https://github.com/ElJosecito/interactive-rating-component-main">
                      <div className="badge m-1">Github</div>
                    </a>
                    <a href="https://soft-mochi-d9cc85.netlify.app">
                      <div className="badge badge-primary">Demo</div>
                    </a>
                  </h2>
                  <p>Esta es una simple aplicacion que te muestra avisos</p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">HTML</div>
                    <div className="badge badge-outline">CSS</div>
                    <div className="badge badge-outline">JS</div>
                    <div className="badge badge-outline">API's</div>
                  </div>
                </div>
              </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full flex justify-center">
              <div className="card w-80 sm:w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src="https://www.dropbox.com/s/iigsk0bsh3yv75m/NFT.png?raw=1"
                    alt="NFT Card"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="sm:card-title text-base font-bold">
                    NFT Card.
                    <a href="https://github.com/ElJosecito/nft-interactive-responsive-card">
                      <div className="badge m-1">Github</div>
                    </a>
                    <a href="https://tangerine-gecko-a1d129.netlify.app">
                      <div className="badge badge-primary">Demo</div>
                    </a>
                  </h2>
                  <p>Esta es una simple carta de presentacion de un NFT.</p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">HTML</div>
                    <div className="badge badge-outline">CSS</div>
                  </div>
                </div>
              </div>
              </div>
            </SwiperSlide>
            
          </Swiper>
      </div>
    </>
  )
}

export default Slider