import React from "react";
import "../../../styles/aboutus/mobile/hero-mobile.css";

const MobileHero = ({ getVal }) => {
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
    <section className="mob-hero mob-hero--coming-soon">
      {/* Coming Soon Content */}
      <div className="mob-hero__coming-soon">
        <div className="mob-hero__coming-soon-content">
          {/* Small tag */}
          <span className="mob-hero__coming-soon-tag">{eyebrow}</span>

          {/* Main heading */}
          <h1 className="mob-hero__coming-soon-title">
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
          <p className="mob-hero__coming-soon-desc" style={{ whiteSpace: "pre-line" }}>
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
            className="mob-hero__facts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "14px",
              width: "100%",
              margin: "14px 0 8px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(201, 169, 110, 0.2)",
              textAlign: "center"
            }}
          >
            <div className="mob-hero__fact-item">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "16px", color: "#F5D77F", fontWeight: "600" }}>
                {fact1Title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>
                {fact1Desc}
              </div>
            </div>
            <div className="mob-hero__fact-item">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "16px", color: "#F5D77F", fontWeight: "600" }}>
                {fact2Title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>
                {fact2Desc}
              </div>
            </div>
            <div className="mob-hero__fact-item">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "16px", color: "#F5D77F", fontWeight: "600" }}>
                {fact3Title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>
                {fact3Desc}
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mob-hero__coming-soon-line"></div>

          {/* Status */}
          <span className="mob-hero__coming-soon-status">
            {filmSlot}
          </span>

          {/* Scroll cue */}
          {scrollCue && (
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: "10.5px", color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic", marginTop: "6px" }}>
              {scrollCue}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
