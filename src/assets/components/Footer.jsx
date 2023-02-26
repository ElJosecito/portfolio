import React from "react";
import { FaInstagram, FaGithub, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover" href="#aboutme">About me</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Skills</a>
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
