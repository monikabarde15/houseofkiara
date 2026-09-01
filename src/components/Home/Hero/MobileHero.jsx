// src\components\Home\Hero\MobileHero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import heroData from "../../../data/home/heroData";

const MobileHero = () => {

  const navigate = useNavigate();
  const handleExploreCollection = () => {
    navigate("/main-page")

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }

  const handleHowItWorks = () => {
    navigate("/how-it-works")

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }


  return (
    <section className="mobile-hero">
      <img
        src={heroData.mobileImage}
        alt="House of Kaira Hero"
        className="mobile-hero-image"
      />

      <div className="mobile-hero-overlay" />

      <div className="mobile-hero-content">
        <div className="mobile-hero-eyebrow">
          <span className="mobile-hero-eyebrow-line" />

          <span className="mobile-hero-eyebrow-text">
            {heroData.eyebrow}
          </span>
        </div>

        <h1 className="mobile-hero-title">
          {heroData.mobileTitle.line1}
          <br />
          {heroData.mobileTitle.line2Before}
          <span className="mobile-hero-love">
            {heroData.mobileTitle.highlight}
          </span>
          {heroData.mobileTitle.line2After}
          <br />
          {heroData.mobileTitle.line3}
        </h1>

        <p className="mobile-hero-description">
          {heroData.description}
        </p>

        <div className="mobile-hero-actions">
          <button className="mobile-hero-primary-btn"
            onClick={handleExploreCollection}
          >
            {heroData.primaryButton}
          </button>

          <button className="mobile-hero-secondary-btn"
            onClick={handleHowItWorks}
          >
            {heroData.secondaryButton}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;