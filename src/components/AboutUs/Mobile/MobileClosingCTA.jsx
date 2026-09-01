import React, { useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../../../styles/aboutus/mobile/closing-cta-mobile.css";
import { showToast } from "../shared/Toast";

const MobileClosingCTA = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate()

  // Reveal animation observer - Mobile Spec §02.3
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handle button clicks
  const handleExploreClick = () => {
    showToast("Opening the Collection...");
    navigate("/main-page")

    // setTimeout(()=>{
    //   window.scrollTo({
    //     top:0,
    //     behavior:smooth,
    //   })
    // },0);
  };

  const handleListClick = () => {
    showToast("Opening List Your Piece...");
    navigate("/list-your-piece")
  };

  return (
    <section className="mob-closing" ref={sectionRef}>
      
      {/* Background Glow - Mobile Spec §14 */}
      <div className="mob-closing__glow"></div>

      {/* Inner Content - Mobile Spec §14 */}
      <div className="mob-closing__inner reveal">
        
        {/* H2 - Mobile: clamp(28px, 7vw, 42px) */}
        <h2 className="mob-closing__title">
          Your piece's <em>next chapter</em> starts here.
        </h2>
        
        {/* Paragraph - Mobile: 15px */}
        <p className="mob-closing__paragraph">
          Whether you're here to wear something unforgettable or to give something 
          unforgettable a second life, there's a place for you at House of Kaira.
        </p>

        {/* Buttons - Mobile: flex column, gap 12px, each full width */}
        <div className="mob-closing__buttons">
          <button 
            className="mob-closing__btn mob-closing__btn--gold"
            onClick={handleExploreClick}
          >
            Explore The Collection
          </button>
          <button 
            className="mob-closing__btn mob-closing__btn--outline"
            onClick={handleListClick}
          >
            List Your Piece
          </button>
        </div>

        {/* Instagram Line - Mobile Spec §14.3 */}
        <div className="mob-closing__instagram">
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

export default MobileClosingCTA;