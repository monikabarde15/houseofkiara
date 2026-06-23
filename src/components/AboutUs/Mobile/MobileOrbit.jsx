import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/mobile/orbit-mobile.css";
import { showToast } from "../shared/Toast";

const MobileOrbit = () => {
  const sectionRef = useRef(null);

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

  // Handle node click - Mobile Spec §12.2
  const handleNodeClick = (nodeName) => {
    const messages = {
      rent: "Opening Rent...",
      preloved: "Opening Buy Preloved...",
      list: "Opening List Your Piece..."
    };
    showToast(messages[nodeName] || "Coming soon...");
  };

  return (
    <section className="mob-orbit" ref={sectionRef}>
      
      {/* Mobile Layout: Orbit visual above copy — single column, stacked */}
      <div className="mob-orbit__wrapper">
        
        {/* Orbit Visual - Mobile Spec §12.1 */}
        <div className="mob-orbit__visual reveal">
          <svg 
            className="mob-orbit__svg" 
            viewBox="0 0 400 400" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Ring - Same as desktop */}
            <circle 
              cx="200" 
              cy="200" 
              r="178" 
              className="mob-orbit__outer-ring"
            />
            
            {/* Orbit Path (Dashed) */}
            <circle 
              cx="200" 
              cy="200" 
              r="148" 
              className="mob-orbit__path"
            />
            
            {/* Centre Hub - Outer */}
            <circle 
              cx="200" 
              cy="200" 
              r="92" 
              className="mob-orbit__hub-outer"
            />
            
            {/* Centre Hub - Inner */}
            <circle 
              cx="200" 
              cy="200" 
              r="80" 
              className="mob-orbit__hub-inner"
            />
            
            {/* Centre Dot */}
            <circle 
              cx="200" 
              cy="200" 
              r="2.5" 
              className="mob-orbit__hub-dot"
            />
            
            {/* Centre Text */}
            <text 
              x="200" 
              y="194" 
              textAnchor="middle" 
              className="mob-orbit__hub-text"
            >
              House
            </text>
            <text 
              x="200" 
              y="214" 
              textAnchor="middle" 
              className="mob-orbit__hub-text mob-orbit__hub-text--gold"
            >
              of Kaira
            </text>

            {/* ===== NODE 1: RENT ===== */}
            <g 
              className="mob-orbit__node" 
              style={{ transformOrigin: "200px 200px" }}
              onClick={() => handleNodeClick("rent")}
              onTouchStart={() => handleNodeClick("rent")}
              tabIndex="0"
              role="button"
              aria-label="Rent"
            >
              <g 
                className="mob-orbit__node-inner" 
                style={{ transformOrigin: "200px 52px" }}
              >
                <circle cx="200" cy="52" r="44" className="mob-orbit__node-circle mob-orbit__node-circle--rent" />
                <text x="200" y="56" textAnchor="middle" className="mob-orbit__node-text mob-orbit__node-text--rent">
                  RENT
                </text>
              </g>
            </g>

            {/* ===== NODE 2: PRELOVED ===== */}
            <g 
              className="mob-orbit__node" 
              style={{ transformOrigin: "200px 200px" }}
              onClick={() => handleNodeClick("preloved")}
              onTouchStart={() => handleNodeClick("preloved")}
              tabIndex="0"
              role="button"
              aria-label="Preloved"
            >
              <g 
                className="mob-orbit__node-inner" 
                style={{ transformOrigin: "72px 274px" }}
              >
                <circle cx="72" cy="274" r="44" className="mob-orbit__node-circle mob-orbit__node-circle--preloved" />
                <text x="72" y="270" textAnchor="middle" className="mob-orbit__node-text mob-orbit__node-text--preloved">
                  PRE
                </text>
                <text x="72" y="286" textAnchor="middle" className="mob-orbit__node-text mob-orbit__node-text--preloved">
                  LOVED
                </text>
              </g>
            </g>

            {/* ===== NODE 3: LIST & SELL ===== */}
            <g 
              className="mob-orbit__node" 
              style={{ transformOrigin: "200px 200px" }}
              onClick={() => handleNodeClick("list")}
              onTouchStart={() => handleNodeClick("list")}
              tabIndex="0"
              role="button"
              aria-label="List and Sell"
            >
              <g 
                className="mob-orbit__node-inner" 
                style={{ transformOrigin: "328px 274px" }}
              >
                <circle cx="328" cy="274" r="44" className="mob-orbit__node-circle mob-orbit__node-circle--list" />
                <text x="328" y="270" textAnchor="middle" className="mob-orbit__node-text mob-orbit__node-text--list">
                  LIST
                </text>
                <text x="328" y="286" textAnchor="middle" className="mob-orbit__node-text mob-orbit__node-text--list">
                  &amp; SELL
                </text>
              </g>
            </g>

          </svg>
        </div>

        {/* Copy Block - Mobile Spec §12.3 */}
        <div className="mob-orbit__copy reveal">
          
          {/* Eyebrow */}
          <div className="mob-orbit__eyebrow">
            <span className="mob-orbit__eyebrow-line"></span>
            <span>Why We Built It</span>
            <span className="mob-orbit__eyebrow-line"></span>
          </div>

          {/* H2 - Mobile: clamp(26px, 6.5vw, 36px) */}
          <h2 className="mob-orbit__title">
            Circularity is the mechanism. <br />
            <em>Joy</em> is the point.
          </h2>

          {/* Body Paragraphs - Mobile: 15px */}
          <p className="mob-orbit__body">
            India's luxury occasion wear market is enormous, deeply emotional, and almost 
            entirely linear. Garments are bought, worn once, and forgotten. Craftsmanship 
            worth lakhs sits folded away in boxes that are never reopened.
          </p>

          <p className="mob-orbit__body">
            We didn't build House of Kaira to lecture anyone about sustainability. We built 
            it because there is something genuinely joyful about slipping into a lehenga 
            that has already danced through three weddings, and still carries the quiet 
            energy of every room it has been in.
          </p>

          <p className="mob-orbit__body">
            Circularity is just the mechanism here. Properly done, it isn't a compromise, 
            it's the most respectful thing you can do for a garment made with that much care.
          </p>

        </div>

      </div>

    </section>
  );
};

export default MobileOrbit;