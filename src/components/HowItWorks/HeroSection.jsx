import React from 'react';
import '../../styles/howitworks/hero-section.css';

const HeroSection = () => {
  return (
    <section id="top" className="hok-hiw-hero">
      {/* HOK Watermark */}
      <div className="hok-hiw-watermark">HOK</div>

      <div className="hok-hiw-hero-container">
        {/* Left Column */}
        <div className="hok-hiw-hero-left">
          <div className="hok-hiw-hero-eyebrow">
            <span className="hok-hiw-hero-line"></span>
            <span className="hok-hiw-hero-eyebrow-text">Simple by Design</span>
          </div>

          <h1 className="hok-hiw-hero-title">
            Fashion that moves <em>beautifully </em>
            {/* <br /> */}
            — and keeps moving.
          </h1>

          <p className="hok-hiw-hero-body">
            Everything you need to know about shopping, renting, selling, 
            and giving beautiful pieces a longer life — in one place, laid out clearly.
          </p>

          <div className="hok-hiw-hero-buttons">
            <button 
              className="hok-hiw-hero-btn-primary" 
              onClick={() => window.hokScroll('section-shop')}
            >
              I want to shop
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L6 11M6 11L10 7M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button 
              className="hok-hiw-hero-btn-secondary" 
              onClick={() => window.hokScroll('section-sell')}
            >
              I want to list & earn
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L6 11M6 11L10 7M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <h3 className="hok-hiw-hero-col-title">
                Rent or buy preloved with confidence
              </h3>
              
              <div className="hok-hiw-hero-steps">
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">01</span>
                  <span className="hok-hiw-hero-step-text">Browse & discover</span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">02</span>
                  <span className="hok-hiw-hero-step-text">Choose your mode</span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">03</span>
                  <span className="hok-hiw-hero-step-text">Checkout & confirm</span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">04</span>
                  <span className="hok-hiw-hero-step-text">Delivered, ready to wear</span>
                </div>
              </div>
            </div>

            {/* Listing Column */}
            <div className="hok-hiw-hero-col">
              <div className="hok-hiw-hero-col-mode">
                <span className="hok-hiw-hero-col-dot hok-hiw-hero-col-dot-listing"></span>
                Listing
              </div>
              <h3 className="hok-hiw-hero-col-title hok-hiw-hero-col-title-listing">
                Give your wardrobe a second life
              </h3>
              
              <div className="hok-hiw-hero-steps">
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">01</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">Photograph & list</span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">02</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">HOK reviews & features</span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">03</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">A buyer finds it</span>
                </div>
                <div className="hok-hiw-hero-step">
                  <span className="hok-hiw-hero-step-num">04</span>
                  <span className="hok-hiw-hero-step-text hok-hiw-hero-step-text-listing">Paid in 3 working days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hok-hiw-hero-scroll-hint">
            <span className="hok-hiw-hero-scroll-line"></span>
            <span className="hok-hiw-hero-scroll-text">Scroll to read in full</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;