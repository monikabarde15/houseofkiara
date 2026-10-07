import React from "react";
import { useNavigate } from "react-router-dom";
import defaultHeroData from "../../../data/home/heroData";
import { renderHeadline } from "../../../utils/headlineParser";

const MobileHero = ({ heroData: customHeroData }) => {
  const navigate = useNavigate();
  const data = customHeroData || defaultHeroData;

  const eyebrow = data.eyebrow || defaultHeroData.eyebrow;
  const headline =
    data.headlineMob ||
    data.headline ||
    data.mobileTitle ||
    defaultHeroData.mobileTitle;
  const description =
    data.descriptionMob || data.description || defaultHeroData.description;

  const primaryButtonText =
    data.primaryCta?.text || data.primaryButton || defaultHeroData.primaryButton;
  const primaryButtonLink = data.primaryCta?.link || "/main-page";
  const secondaryButtonText =
    data.secondaryCta?.text ||
    data.secondaryButton ||
    defaultHeroData.secondaryButton;
  const secondaryButtonLink = data.secondaryCta?.link || "/how-it-works";

  const mobileImageUrl =
    data.mobileImage?.url || data.mobileImage || defaultHeroData.mobileImage;
  const mobileImageAlt = data.mobileImage?.alt || "House of Kaira Hero";
  const mobileImageFocal = data.mobileImage?.focal?.toLowerCase() || "top";

  const handlePrimaryClick = () => {
    if (
      primaryButtonLink.startsWith("http://") ||
      primaryButtonLink.startsWith("https://")
    ) {
      window.location.href = primaryButtonLink;
    } else {
      navigate(primaryButtonLink);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 0);
    }
  };

  const handleSecondaryClick = () => {
    if (
      secondaryButtonLink.startsWith("http://") ||
      secondaryButtonLink.startsWith("https://")
    ) {
      window.location.href = secondaryButtonLink;
    } else {
      navigate(secondaryButtonLink);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 0);
    }
  };

  return (
    <section className="mobile-hero">
      <img
        src={mobileImageUrl}
        alt={mobileImageAlt}
        className="mobile-hero-image"
        style={{ objectPosition: `center ${mobileImageFocal}` }}
      />

      <div className="mobile-hero-overlay" />

      <div className="mobile-hero-content">
        <div className="mobile-hero-eyebrow">
          <span className="mobile-hero-eyebrow-line" />
          <span className="mobile-hero-eyebrow-text">{eyebrow}</span>
        </div>

        <h1 className="mobile-hero-title">
          {renderHeadline(headline, "span", "mobile-hero-love")}
        </h1>

        <p className="mobile-hero-description">{description}</p>

        <div className="mobile-hero-actions">
          <button
            className="mobile-hero-primary-btn"
            onClick={handlePrimaryClick}
          >
            {primaryButtonText}
          </button>

          <button
            className="mobile-hero-secondary-btn"
            onClick={handleSecondaryClick}
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
