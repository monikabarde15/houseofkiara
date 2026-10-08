import React, { useState, useEffect } from "react";

import DesktopTestimonials from "./DesktopTestimonials";
import MobileTestimonials from "./MobileTestimonials";
import { getTestimonialsSection } from "../../../services/testimonialsApi";
import defaultTestimonialsData from "../../../data/home/testimonialsData";

import "../../../styles/Home/Testimonials/testimonials.css";
import "../../../styles/Home/Testimonials/desktop-testimonials.css";
import "../../../styles/Home/Testimonials/mobile-testimonials.css";

const Testimonials = () => {
  const [testimonialsData, setTestimonialsData] = useState(() => ({
    isVisible: true,
    eyebrow: defaultTestimonialsData.eyebrow,
    heading: "What our customers *say*",
    layout: "Three across",
    layoutMob: "Swipe",
    testimonials: defaultTestimonialsData.testimonials,
  }));

  useEffect(() => {
    let isMounted = true;
    getTestimonialsSection().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setTestimonialsData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (testimonialsData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-testimonials">
      <div className="hok-testimonials-desktop">
        <DesktopTestimonials data={testimonialsData} />
      </div>

      <div className="hok-testimonials-mobile">
        <MobileTestimonials data={testimonialsData} />
      </div>
    </section>
  );
};

export default Testimonials;
