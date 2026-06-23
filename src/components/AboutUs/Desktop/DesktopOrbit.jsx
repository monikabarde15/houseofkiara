import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/desktop/orbit-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopOrbit = () => {
  const sectionRef = useRef(null);

  // Reveal animation observer - Spec §02.3
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

  // Handle node click - Spec §12.2
  const handleNodeClick = (nodeName) => {
    const messages = {
      rent: "Opening Rent...",
      preloved: "Opening Buy Preloved...",
      list: "Opening List Your Piece..."
    };
    showToast(messages[nodeName] || "Coming soon...");
  };

  return (
    <section className="au-orbit" ref={sectionRef}>
      
      {/* Grid Container - Spec §12 */}
      <div className="au-orbit__grid">
        
        {/* Visual Column - Spec §12.1 */}
        <div className="au-orbit__visual reveal">
          <svg 
            className="au-orbit__svg" 
            viewBox="0 0 400 400" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Ring - Spec §12.1 */}
            <circle 
              cx="200" 
              cy="200" 
              r="178" 
              className="au-orbit__outer-ring"
            />
            
            {/* Orbit Path (Dashed) - Spec §12.1 */}
            <circle 
              cx="200" 
              cy="200" 
              r="148" 
              className="au-orbit__path"
            />
            
            {/* Centre Hub - Outer - Spec §12.1 */}
            <circle 
              cx="200" 
              cy="200" 
              r="92" 
              className="au-orbit__hub-outer"
            />
            
            {/* Centre Hub - Inner - Spec §12.1 */}
            <circle 
              cx="200" 
              cy="200" 
              r="80" 
              className="au-orbit__hub-inner"
            />
            
            {/* Centre Dot - Spec §12.1 */}
            <circle 
              cx="200" 
              cy="200" 
              r="2.5" 
              className="au-orbit__hub-dot"
            />
            
            {/* Centre Text - Spec §12.1 */}
            <text 
              x="200" 
              y="194" 
              textAnchor="middle" 
              className="au-orbit__hub-text"
            >
              House
            </text>
            <text 
              x="200" 
              y="214" 
              textAnchor="middle" 
              className="au-orbit__hub-text au-orbit__hub-text--gold"
            >
              of Kaira
            </text>

            {/* ===== NODE 1: RENT - Spec §12.2 ===== */}
            <g 
              className="au-orbit__node" 
              style={{ transformOrigin: "200px 200px" }}
              onClick={() => handleNodeClick("rent")}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
              onFocus={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onBlur={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
              tabIndex="0"
              role="button"
              aria-label="Rent"
            >
              <g 
                className="au-orbit__node-inner" 
                style={{ transformOrigin: "200px 52px" }}
              >
                <circle cx="200" cy="52" r="44" className="au-orbit__node-circle au-orbit__node-circle--rent" />
                <text x="200" y="56" textAnchor="middle" className="au-orbit__node-text au-orbit__node-text--rent">
                  RENT
                </text>
              </g>
            </g>

            {/* ===== NODE 2: PRELOVED - Spec §12.2 ===== */}
            <g 
              className="au-orbit__node" 
              style={{ transformOrigin: "200px 200px" }}
              onClick={() => handleNodeClick("preloved")}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
              onFocus={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onBlur={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
              tabIndex="0"
              role="button"
              aria-label="Preloved"
            >
              <g 
                className="au-orbit__node-inner" 
                style={{ transformOrigin: "72px 274px" }}
              >
                <circle cx="72" cy="274" r="44" className="au-orbit__node-circle au-orbit__node-circle--preloved" />
                <text x="72" y="270" textAnchor="middle" className="au-orbit__node-text au-orbit__node-text--preloved">
                  PRE
                </text>
                <text x="72" y="286" textAnchor="middle" className="au-orbit__node-text au-orbit__node-text--preloved">
                  LOVED
                </text>
              </g>
            </g>

            {/* ===== NODE 3: LIST & SELL - Spec §12.2 ===== */}
            <g 
              className="au-orbit__node" 
              style={{ transformOrigin: "200px 200px" }}
              onClick={() => handleNodeClick("list")}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
              onFocus={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onBlur={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
              tabIndex="0"
              role="button"
              aria-label="List and Sell"
            >
              <g 
                className="au-orbit__node-inner" 
                style={{ transformOrigin: "328px 274px" }}
              >
                <circle cx="328" cy="274" r="44" className="au-orbit__node-circle au-orbit__node-circle--list" />
                <text x="328" y="270" textAnchor="middle" className="au-orbit__node-text au-orbit__node-text--list">
                  LIST
                </text>
                <text x="328" y="286" textAnchor="middle" className="au-orbit__node-text au-orbit__node-text--list">
                  &amp; SELL
                </text>
              </g>
            </g>

          </svg>
        </div>

        {/* Copy Column - Spec §12.4 */}
        <div className="au-orbit__copy reveal">
          
          {/* Eyebrow */}
          <div className="au-orbit__eyebrow">
            <span className="au-orbit__eyebrow-line"></span>
            <span>Why We Built It</span>
            <span className="au-orbit__eyebrow-line"></span>
          </div>

          {/* H2 */}
          <h2 className="au-orbit__title">
            Circularity is the mechanism. <br />
            <em>Joy</em> is the point.
          </h2>

          {/* Paragraphs - Spec §12.4 */}
          <p className="au-orbit__body">
            India's luxury occasion wear market is enormous, deeply emotional, and almost 
            entirely linear. Garments are bought, worn once, and forgotten. Craftsmanship 
            worth lakhs sits folded away in boxes that are never reopened.
          </p>

          <p className="au-orbit__body">
            We didn't build House of Kaira to lecture anyone about sustainability. We built 
            it because there is something genuinely joyful about slipping into a lehenga 
            that has already danced through three weddings, and still carries the quiet 
            energy of every room it has been in.
          </p>

          <p className="au-orbit__body">
            Circularity is just the mechanism here. Properly done, it isn't a compromise, 
            it's the most respectful thing you can do for a garment made with that much care.
          </p>

        </div>

      </div>

    </section>
  );
};

export default DesktopOrbit;