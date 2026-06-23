import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/aboutus/mobile/three-ways-mobile.css";
import { showToast } from "../shared/Toast";

const MobileThreeWays = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

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

    const elements = sectionRef.current?.querySelectorAll(".reveal, .reveal-stagger");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Three Ways data - Mobile Spec §13.3
  const waysData = [
    {
      id: 1,
      numeral: "I",
      dotColor: "terracotta",
      heading: "Rent",
      tagline: "For the night that deserves everything, and not a single thing more.",
      description: "Wear the showstopper. Send it back. No upkeep, no clutter, no compromise.",
      linkLabel: "Explore Rentals",
      linkAction: "Opening Rent...",
    },
    {
      id: 2,
      numeral: "II",
      dotColor: "gold",
      heading: "Buy Preloved",
      tagline: "A piece doesn't lose its story when it changes hands. It gains yours.",
      description: "Inspected, disclosed honestly, and priced like the treasure it already is.",
      linkLabel: "Shop Preloved",
      linkAction: "Opening Buy Preloved...",
    },
    {
      id: 3,
      numeral: "III",
      dotColor: "sage",
      heading: "List & Sell",
      tagline: "Somewhere in your wardrobe is a piece waiting for a second standing ovation.",
      description: "We handle pickup, photography, and payout — the piece does the rest.",
      linkLabel: "List Your Piece",
      linkAction: "Opening List Your Piece...",
    },
  ];

  // Handle link click
  const handleLinkClick = (way) => {
    showToast(way.linkAction);

  switch (way.id) {
    case 1:
      navigate("/main-page?section=rent");
      break;

    case 2:
      navigate("/main-page?section=preloved");
      break;

    case 3:
      navigate("/list-your-piece");
      break;

    default:
      break;
  }

  window.scrollTo(0, 0);
  };

  return (
    <section className="mob-ways" ref={sectionRef}>
      
      {/* Section Head - Mobile Spec §13.1 */}
      <div className="mob-ways__head reveal">
        <div className="mob-ways__eyebrow">
          <span className="mob-ways__eyebrow-line"></span>
          <span>How It Works</span>
          <span className="mob-ways__eyebrow-line"></span>
        </div>
        <h2 className="mob-ways__title">
          Three ways to belong to <em>the story</em>
        </h2>
        <p className="mob-ways__sub">
          Every door leads to the same standard: curated pieces, honest condition, 
          and a process built to feel as good as the clothes look.
        </p>
      </div>

      {/* Card Grid - Mobile Spec §13.2: flex column, gap: 16px */}
      <div className="mob-ways__grid reveal-stagger">
        {waysData.map((way, index) => (
          <div 
            key={way.id} 
            className={`mob-ways__card mob-ways__card--${way.dotColor}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {/* Top Row: Numeral + Dot - Mobile Spec §13.3 */}
            <div className="mob-ways__card-top">
              <span className="mob-ways__card-numeral">{way.numeral}</span>
              <span className={`mob-ways__card-dot mob-ways__card-dot--${way.dotColor}`}></span>
            </div>
            
            {/* Heading - Mobile: 21px */}
            <h3 className="mob-ways__card-heading">{way.heading}</h3>
            
            {/* Tagline - Mobile: 16px */}
            <p className="mob-ways__card-tagline">{way.tagline}</p>
            
            {/* Description - Mobile: 13px */}
            <p className="mob-ways__card-desc">{way.description}</p>
            
            {/* Link - Mobile: 10px */}
            <button 
              className="mob-ways__card-link"
                onClick={() => handleLinkClick(way)}
            >
              {way.linkLabel}
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M13 6L19 12L13 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Note - Mobile Spec §13.3 */}
      <p className="mob-ways__note">
        A fourth way, Buy New, joins the house soon.
      </p>

    </section>
  );
};

export default MobileThreeWays;