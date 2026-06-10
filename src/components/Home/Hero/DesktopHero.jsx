import React from "react";
import heroData from "../../../data/home/heroData";

const DesktopHero = () => {
    return (
        <section className="desk-hero">
            <div className="desk-hero-left">
                <div className="desk-hero-eyebrow">
                    <span className="desk-hero-eyebrow-line"></span>
                    <span>{heroData.eyebrow}</span>
                </div>

                <h1 className="desk-hero-title">
                    {heroData.title.before}
                    <em>{heroData.title.highlight}</em>
                    {heroData.title.after}
                </h1>

                <p className="desk-hero-description">
                    {heroData.description}
                </p>

                <div className="desk-hero-actions">
                    <button className="btn-primary">
                        {heroData.primaryButton}
                    </button>

                    <button className="btn-outline">
                        {heroData.secondaryButton}
                    </button>
                </div>
            </div>

            <div className="desk-hero-right">
                {heroData.images.map((image, index) => (
                    <div
                        className="desk-hero-image-wrapper"
                        key={index}
                    >
                        <img
                            src={image}
                            alt={`Hero ${index + 1}`}
                            className="desk-hero-image"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DesktopHero;