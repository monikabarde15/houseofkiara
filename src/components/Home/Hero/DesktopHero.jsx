import React from "react";
import { useNavigate } from "react-router-dom";
import heroData from "../../../data/home/heroData";

const DesktopHero = () => {
    const navigate = useNavigate();

    const handleExploreCollection = ()=>{
        navigate("/main-page")

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, 0);
    }

    const handleHowItWorks = () =>{
        navigate("/how-it-works")

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, 0);
    }

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
                    <button className="btn-primary"
                    onClick={handleExploreCollection}
                    >
                        {heroData.primaryButton}
                    </button>

                    <button className="btn-outline"
                    onClick={handleHowItWorks}
                    >
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