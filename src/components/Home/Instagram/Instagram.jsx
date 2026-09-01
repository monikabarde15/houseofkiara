import React from "react";

import DesktopInstagram from "./DesktopInstagram";
import MobileInstagram from "./MobileInstagram";

import "../../../styles/Home/Instagram/instagram.css";
import "../../../styles/Home/Instagram/desktop-instagram.css";
import "../../../styles/Home/Instagram/mobile-instagram.css";

const InstagramSection = () => {
  return (
    <section className="hok-instagram">
      <div className="hok-instagram-desktop">
        <DesktopInstagram />
      </div>

      <div className="hok-instagram-mobile">
        <MobileInstagram />
      </div>
    </section>
  );
};

export default InstagramSection;