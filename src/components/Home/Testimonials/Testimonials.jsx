import React from "react";

import DesktopTestimonials from "./DesktopTestimonials";
import MobileTestimonials from "./MobileTestimonials";

import "../../../styles/Home/Testimonials/testimonials.css";
import "../../../styles/Home/Testimonials/desktop-testimonials.css";
import "../../../styles/Home/Testimonials/mobile-testimonials.css";

const Testimonials = () => {
  return (
    <section className="hok-testimonials">
      <div className="hok-testimonials-desktop">
        <DesktopTestimonials />
      </div>

      <div className="hok-testimonials-mobile">
        <MobileTestimonials />
      </div>
    </section>
  );
};

export default Testimonials;