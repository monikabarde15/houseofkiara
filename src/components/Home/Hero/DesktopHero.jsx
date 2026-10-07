import React from "react";
import { useNavigate } from "react-router-dom";
import defaultHeroData from "../../../data/home/heroData";
import { renderHeadline } from "../../../utils/headlineParser";

const DesktopHero = ({ heroData: customHeroData }) => {
  const navigate = useNavigate();
  const data = customHeroData || defaultHeroData;

  const eyebrow = data.eyebrow || defaultHeroData.eyebrow;
  const headline = data.headline || data.title || defaultHeroData.title;
  const description = data.description || defaultHeroData.description;
  const primaryButtonText =
    data.primaryCta?.text || data.primaryButton || defaultHeroData.primaryButton;
  const primaryButtonLink = data.primaryCta?.link || "/main-page";
  const secondaryButtonText =
    data.secondaryCta?.text ||
    data.secondaryButton ||
    defaultHeroData.secondaryButton;
  const secondaryButtonLink = data.secondaryCta?.link || "/how-it-works";

  const desktopImageUrl = data.desktopImage?.url;
  const desktopImageAlt = data.desktopImage?.alt || "House of Kaira Hero";
  const desktopImageFocal = data.desktopImage?.focal?.toLowerCase() || "top";
  const fallbackImages = data.images || defaultHeroData.images;

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
    <section className="desk-hero">
      <div className="desk-hero-left">
        <div className="desk-hero-eyebrow">
          <span className="desk-hero-eyebrow-line"></span>
          <span>{eyebrow}</span>
        </div>

        <h1 className="desk-hero-title">{renderHeadline(headline, "em")}</h1>

        <p className="desk-hero-description">{description}</p>

        <div className="desk-hero-actions">
          <button className="btn-primary" onClick={handlePrimaryClick}>
            {primaryButtonText}
          </button>

          <button className="btn-outline" onClick={handleSecondaryClick}>
            {secondaryButtonText}
          </button>
        </div>
      </div>

      <div
        className="desk-hero-right"
        style={
          desktopImageUrl
            ? { gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }
            : {}
        }
      >
        {desktopImageUrl ? (
          <div className="desk-hero-image-wrapper">
            <img
              src={desktopImageUrl}
              alt={desktopImageAlt}
              className="desk-hero-image"
              style={{ objectPosition: `center ${desktopImageFocal}` }}
            />
          </div>
        ) : (
          fallbackImages.map((image, index) => (
            <div className="desk-hero-image-wrapper" key={index}>
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="desk-hero-image"
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DesktopHero;
