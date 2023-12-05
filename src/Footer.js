// Footer.js

import React from "react";
import { FaGithub, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h6>All rights reserved &copy; Karan K Binu</h6>
        </div>
        <div className="footer-section">
          <strong>For any Queries, Contact me on : </strong>
          <a
            href="https://github.com/KaranKBinu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="icon github" />
          </a>
          <a href="mailto:karankbinu799@gmail.com">
            <FaEnvelope className="icon email" />
          </a>
          <a
            href="https://wa.me/917994667412"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="icon whatsapp" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
