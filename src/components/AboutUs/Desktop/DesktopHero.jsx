import React from "react";
import "../../../styles/aboutus/desktop/hero-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopHero = () => {
  // Coming soon click handler
  const handleComingSoonClick = () => {
    showToast("Brand film coming soon");
  };

  return (
    <section className="au-hero au-hero--coming-soon">
      
      {/* Coming Soon Content */}
      <div className="au-hero__coming-soon">
        <div className="au-hero__coming-soon-content">
          
          {/* Small tag - clickable */}
          <button 
            className="au-hero__coming-soon-tag"
            onClick={handleComingSoonClick}
          >
            Coming Soon
          </button>
          
          {/* Main heading */}
          <h1 className="au-hero__coming-soon-title">
            The House, <br />
            <em>in Motion</em>
          </h1>
          
          {/* Description */}
          <p className="au-hero__coming-soon-desc">
            Our brand film is currently in production. <br />
            A story of cherished beauty, renewed purpose, <br />
            and garments that deserve more than one life.
          </p>
          
          {/* Decorative line */}
          <div className="au-hero__coming-soon-line"></div>
          
          {/* Status - clickable */}
          <button 
            className="au-hero__coming-soon-status"
            onClick={handleComingSoonClick}
          >
            Brand Film — Coming Soon
          </button>

        </div>
      </div>

    </section>
  );
};

export default DesktopHero;