import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/aboutus/desktop/closing-cta-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopClosingCTA = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate()

  // Reveal animation observer 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handle button clicks
  const handleExploreClick = () => {
    showToast("Opening the Collection...");
    navigate("/main-page")

    setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 0);
  };

  const handleListClick = () => {
    showToast("Opening List Your Piece...");
    navigate("/list-your-piece")
  };

  return (
    <section className="au-closing" ref={sectionRef}>
      
      {/* Background Glow  */}
      <div className="au-closing__glow"></div>

      {/* Inner Content  */}
      <div className="au-closing__inner reveal">
        
        {/* H2  */}
        <h2 className="au-closing__title">
          Your piece's <em>next chapter</em> starts here.
        </h2>
        
        {/* Paragraph  */}
        <p className="au-closing__paragraph">
          Whether you're here to wear something unforgettable or to give something 
          unforgettable a second life, there's a place for you at House of Kaira.
        </p>

        {/* Buttons */}
        <div className="au-closing__buttons">
          <button 
            className="au-closing__btn au-closing__btn--gold"
            onClick={handleExploreClick}
          >
            Explore The Collection
          </button>
          <button 
            className="au-closing__btn au-closing__btn--outline"
            onClick={handleListClick}
          >
            List Your Piece
          </button>
        </div>

        {/* Instagram Line */}
        <div className="au-closing__instagram">
          <span>Follow our story at </span>
          <a 
            href="https://instagram.com/house_of_kaira" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            @house_of_kaira
          </a>
        </div>

      </div>

    </section>
  );
};

export default DesktopClosingCTA;