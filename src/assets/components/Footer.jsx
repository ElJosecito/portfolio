import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { HashLink } from "react-router-hash-link";


function Footer() {
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content bg-[#212121] flex flex-col items-center">
        <div className="  flex justify-between text-white opacity-20">
          <HashLink smooth to="#hero" className="link link-hover mx-3">Home</HashLink>
          <HashLink smooth to="#about" className="link link-hover mx-3">About me</HashLink>
          <HashLink smooth to="#projects" className="link link-hover mx-3">Proyectos</HashLink>
        </div>
        <div className="flex my-5 text-white opacity-20">
          <div className="grid grid-flow-col gap-4">
            <a href="https://www.instagram.com/josecito.png/">
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6"/>
            </a>
            <a href="https://www.linkedin.com/in/jose-martinez-b93768244/">
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6"/>
            </a>
            <a href="https://github.com/ElJosecito">
              <FontAwesomeIcon icon={faGithub} className="h-6 w-6"/>
            </a>
          </div>
        </div>
        <div className="text-white opacity-20">
          <p>Copyright © 2023 - All right reserved by Jose Martinez</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
