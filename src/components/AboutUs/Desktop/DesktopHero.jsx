import React from "react";
import "../../../styles/aboutus/desktop/hero-desktop.css";
import { showToast } from "../shared/Toast";

const DesktopHero = ({ getVal }) => {
  // Coming soon click handler
  const handleComingSoonClick = () => {
    showToast("Brand film coming soon");
  };

  const eyebrow = getVal ? getVal("about_eyebrow", "Coming Soon") : "Coming Soon";
  const heading = getVal ? getVal("about_heading", null) : null;
  const lead = getVal ? getVal("about_lead", null) : null;
  const filmSlot = getVal ? getVal("about_film_slot", "Brand Film — Coming Soon") : "Brand Film — Coming Soon";

  const fact1Title = getVal ? getVal("about_fact1_title", "100% genuine") : "100% genuine";
  const fact1Desc = getVal ? getVal("about_fact1_desc", "Authenticated before every wear") : "Authenticated before every wear";
  const fact2Title = getVal ? getVal("about_fact2_title", "Complimentary care") : "Complimentary care";
  const fact2Desc = getVal ? getVal("about_fact2_desc", "Surgically cleaned, always") : "Surgically cleaned, always";
  const fact3Title = getVal ? getVal("about_fact3_title", "Door to door") : "Door to door";
  const fact3Desc = getVal ? getVal("about_fact3_desc", "Direct delivery across India") : "Direct delivery across India";
  const scrollCue = getVal ? getVal("about_scroll_cue", "Scroll to read the story ↓") : "Scroll to read the story ↓";

  return (
    <section className="au-hero au-hero--coming-soon">
      {/* Coming Soon Content */}
      <div className="au-hero__coming-soon">
        <div className="au-hero__coming-soon-content">
          {/* Small tag - clickable */}
          <button
            className="au-hero__coming-soon-tag"
            onClick={handleComingSoonClick}
          >
            {eyebrow}
          </button>

          {/* Main heading */}
          <h1 className="au-hero__coming-soon-title">
            {heading ? (
              heading
            ) : (
              <>
                The House, <br />
                <em>in Motion</em>
              </>
            )}
          </h1>

          {/* Description with dynamic figures */}
          <p className="au-hero__coming-soon-desc" style={{ whiteSpace: "pre-line" }}>
            {lead ? (
              lead
            ) : (
              <>
                Our brand film is currently in production. <br />
                A story of cherished beauty, renewed purpose, <br />
                and garments that deserve more than one life.
              </>
            )}
          </p>

          {/* Three Facts / Figures Row */}
          <div
            className="au-hero__facts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              width: "100%",
              maxWidth: "600px",
              margin: "16px 0 10px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(201, 169, 110, 0.2)",
              textAlign: "center"
            }}
          >
            <div className="au-hero__fact-item">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "17px", color: "#F5D77F", fontWeight: "600" }}>
                {fact1Title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11.5px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                {fact1Desc}
              </div>
            </div>
            <div className="au-hero__fact-item">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "17px", color: "#F5D77F", fontWeight: "600" }}>
                {fact2Title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11.5px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                {fact2Desc}
              </div>
            </div>
            <div className="au-hero__fact-item">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "17px", color: "#F5D77F", fontWeight: "600" }}>
                {fact3Title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11.5px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                {fact3Desc}
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="au-hero__coming-soon-line"></div>

          {/* Status - clickable */}
          <button
            className="au-hero__coming-soon-status"
            onClick={handleComingSoonClick}
          >
            {filmSlot}
          </button>

          {/* Scroll cue */}
          {scrollCue && (
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic", marginTop: "8px" }}>
              {scrollCue}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DesktopHero;
