import React from "react";
import { FaInstagram, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { HashLink } from "react-router-hash-link";


function Footer() {
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div className="grid grid-flow-col gap-4">
          <HashLink smooth to="#hero" className="link link-hover" >About me</HashLink>
          <HashLink smooth to="#contact" className="link link-hover">Contact</HashLink>
          <HashLink smooth to="#projects" className="link link-hover">Jobs</HashLink>
          <HashLink smooth to="#skills" className="link link-hover">Skills</HashLink>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a href="https://www.instagram.com/josecito.png/">
              <FaInstagram className="w-6 h-6"/>
            </a>
            <a href="https://www.linkedin.com/in/jose-martinez-b93768244/">
              <FaLinkedinIn className="w-6 h-6"/>
            </a>
            <a href="https://github.com/ElJosecito">
              <FaGithub className="h-6 w-6"/>
            </a>
          </div>
        </div>
        <div>
          <p>Copyright © 2023 - All right reserved by Josecito</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
