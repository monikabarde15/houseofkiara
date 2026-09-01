import React from "react";
import "../../../styles/aboutus/mobile/hero-mobile.css";

const MobileHero = () => {
  return (
    <section className="mob-hero mob-hero--coming-soon">
      
      {/* Coming Soon Content */}
      <div className="mob-hero__coming-soon">
        <div className="mob-hero__coming-soon-content">
          
          {/* Small tag */}
          <span className="mob-hero__coming-soon-tag">Coming Soon</span>
          
          {/* Main heading */}
          <h1 className="mob-hero__coming-soon-title">
            The House, <br />
            <em>in Motion</em>
          </h1>
          
          {/* Description */}
          <p className="mob-hero__coming-soon-desc">
            Our brand film is currently in production. <br />
            A story of cherished beauty, renewed purpose, <br />
            and garments that deserve more than one life.
          </p>
          
          {/* Decorative line */}
          <div className="mob-hero__coming-soon-line"></div>
          
          {/* Status */}
          <span className="mob-hero__coming-soon-status">
            Brand Film — Coming Soon
          </span>

        </div>
      </div>

    </section>
  );
};

export default MobileHero;