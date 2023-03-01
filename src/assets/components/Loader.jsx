import React from "react";
import '../styles/style.css'


function Loader() {
  return (
    <>
    <div className="flex justify-center items-center h-screen">
      {/* */}
      <div className="w-20 h-20">
      <div className="loader "></div> 

      <p className="mt-24 text-xl font-bold text-center">
      Loading...
      </p>
      </div>
    </div>
    </>
  );
}

export default Loader;
