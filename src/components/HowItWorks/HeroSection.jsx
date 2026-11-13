import React from "react";
import "../../styles/howitworks/hero-section.css";

const HeroSection = ({ getVal }) => {
  return (
    <section id="top" className="hok-hiw-hero">
      {/* HOK Watermark */}
      <div className="hok-hiw-watermark">HOK</div>

      <div className="hok-hiw-hero-container">
        {/* Left Column */}
        <div className="hok-hiw-hero-left">
          <div className="hok-hiw-hero-eyebrow">
            <span className="hok-hiw-hero-line"></span>
            <span className="hok-hiw-hero-eyebrow-text">{getVal ? getVal("hiw_kicker", "Simple by Design") : "Simple by Design"}</span>
          </div>

          <h1 className="hok-hiw-hero-title">{getVal && getVal("hiw_heading", null) ? getVal("hiw_heading") : <>Fashion that moves <em>beautifully </em>— and keeps moving.</>}</h1>

          <p className="hok-hiw-hero-body">{getVal ? getVal("hiw_lead", "Everything you need to know about shopping, renting, selling, and giving beautiful pieces a longer life — in one place, laid out clearly.") : "Everything you need to know about shopping, renting, selling, and giving beautiful pieces a longer life — in one place, laid out clearly."}</p>

          <div className="hok-hiw-hero-buttons">
            <button
              className="hok-hiw-hero-btn-primary"
              onClick={() => window.hokScroll("section-shop")}
            >
              I want to shop
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L6 11M6 11L10 7M6 11L2 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="hok-hiw-hero-btn-secondary"
              onClick={() => window.hokScroll("section-sell")}
            >
              I want to list & earn
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L6 11M6 11L10 7M6 11L2 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="hok-hiw-hero-right">
          <div className="hok-hiw-hero-right-label">What's on this page</div>

          <div className="hok-hiw-hero-col-grid">
            {/* Shopping Column */}
            <div className="hok-hiw-hero-col">
              <div className="hok-hiw-hero-col-mode">
                <span className="hok-hiw-hero-col-dot hok-hiw-hero-col-dot-shopping"></span>
                Shopping
              </div>
              <h3 className="hok-hiw-hero-col-title">{getVal ? getVal("hiw_left_col_title", "Rent or buy preloved with confidence") : "Rent or buy preloved with confidence"}</h3>

              <div className="hok-hiw-hero-steps">
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">01</span>
                  <span className="hok-hiw-hero-step-text">
                    {getVal ? getVal("hiw_step_0_title", "Browse & discover") : "Browse & discover"}
                  </span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">02</span>
                  <span className="hok-hiw-hero-step-text">
                    {getVal ? getVal("hiw_step_1_title", "Choose your mode") : "Choose your mode"}
                  </span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">03</span>
                  <span className="hok-hiw-hero-step-text">
                    {getVal ? getVal("hiw_step_2_title", "Checkout & confirm") : "Checkout & confirm"}
                  </span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">04</span>
                  <span className="hok-hiw-hero-step-text">
                    {getVal ? getVal("hiw_step_3_title", "Delivered, ready to wear") : "Delivered, ready to wear"}
                  </span>
                </div>
              </div>
            </div>

            {/* Listing Column */}
            <div className="hok-hiw-hero-col">
              <div className="hok-hiw-hero-col-mode">
                <span className="hok-hiw-hero-col-dot hok-hiw-hero-col-dot-listing"></span>
                Listing
              </div>
              <h3 className="hok-hiw-hero-col-title hok-hiw-hero-col-title-listing">{getVal ? getVal("hiw_right_col_title", "Give your wardrobe a second life") : "Give your wardrobe a second life"}</h3>

              <div className="hok-hiw-hero-steps">
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">01</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">
                    {getVal ? getVal("hiw_lstep_0_title", "Photograph & list") : "Photograph & list"}
                  </span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">02</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">
                    HOK reviews & features
                  </span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">03</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">
                    A buyer finds it
                  </span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">04</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">
                    Paid in 3 working days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hok-hiw-hero-scroll-hint">
            <span className="hok-hiw-hero-scroll-line"></span>
            <span className="hok-hiw-hero-scroll-text">
              Scroll to read in full
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
