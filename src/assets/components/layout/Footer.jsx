import React, { useEffect, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

//import icons

function Footer() {
  const [year, setYear] = useState(0);
  useEffect(() => {
    const date = new Date();
    setYear(date.getFullYear());
  }, []);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content bg-[#212121] flex flex-col items-center">
        <div className="flex justify-between text-white opacity-30">
          <a onClick={() => handleScroll("home")} className="link link-hover mx-3 cursor-pointer">
            Home
          </a>
          <a  onClick={() => handleScroll("about")} className="link link-hover mx-3 cursor-pointer">
            About me
          </a>
          <a  onClick={() => handleScroll("projects")} className="link link-hover mx-3 cursor-pointer">
            Proyectos
          </a>
        </div>
        <div className="flex my-5 text-white opacity-20">
          <div className="grid grid-flow-col gap-4">
            <a href="https://www.instagram.com/josecito.png/">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/jose-martinez-b93768244/">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com/ElJosecito">
              <FaGithub className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="text-white opacity-20">
          <p>Copyright © {year} - All right reserved by Jose Martinez</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
