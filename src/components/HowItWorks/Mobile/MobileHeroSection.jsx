import React from 'react';
import '../../../styles/howitworks/mobile/mobile-hero-section.css';

const MobileHeroSection = () => {
  return (
    <section id="top" className="hok-hiw-mobile-hero">
      {/* HOK Watermark */}
      <div className="hok-hiw-mobile-watermark">HOK</div>

      <div className="hok-hiw-mobile-hero-container">
        {/* Left Column Content - Single Column */}
        <div className="hok-hiw-mobile-hero-content">
          <div className="hok-hiw-mobile-hero-eyebrow">
            <span className="hok-hiw-mobile-hero-line"></span>
            <span className="hok-hiw-mobile-hero-eyebrow-text">Simple by Design</span>
          </div>

          <h1 className="hok-hiw-mobile-hero-title">
            Fashion that moves <em>beautifully</em>
            <br />
            and keeps moving.
          </h1>

          <p className="hok-hiw-mobile-hero-body">
            Everything you need to know about shopping, renting, selling, 
            and giving beautiful pieces a longer life — in one place, laid out clearly.
          </p>

          <div className="hok-hiw-mobile-hero-buttons">
            <button 
              className="hok-hiw-mobile-hero-btn-primary" 
              onClick={() => window.hokScroll('section-shop')}
            >
              I want to shop
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L6 11M6 11L10 7M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button 
              className="hok-hiw-mobile-hero-btn-secondary" 
              onClick={() => window.hokScroll('section-sell')}
            >
              I want to list & earn
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L6 11M6 11L10 7M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Hero Summary - Below Buttons */}
        <div className="hok-hiw-mobile-hero-summary">
          <div className="hok-hiw-mobile-hero-sum-cols">
            {/* Shopping Column */}
            <div className="hok-hiw-mobile-hero-sum-col">
              <div className="hok-hiw-mobile-hero-col-mode">
                <span className="hok-hiw-mobile-hero-col-dot hok-hiw-mobile-hero-col-dot-shopping"></span>
                Shopping
              </div>
              <h3 className="hok-hiw-mobile-hero-col-title">
                Rent or buy preloved with confidence
              </h3>
              
              <div className="hok-hiw-mobile-hero-steps">
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">01</span>
                  <span className="hok-hiw-mobile-hero-step-text">Browse & discover</span>
                </div>
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">02</span>
                  <span className="hok-hiw-mobile-hero-step-text">Choose your mode</span>
                </div>
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">03</span>
                  <span className="hok-hiw-mobile-hero-step-text">Checkout & confirm</span>
                </div>
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">04</span>
                  <span className="hok-hiw-mobile-hero-step-text">Delivered, ready to wear</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hok-hiw-mobile-hero-sum-divider"></div>

            {/* Listing Column */}
            <div className="hok-hiw-mobile-hero-sum-col">
              <div className="hok-hiw-mobile-hero-col-mode">
                <span className="hok-hiw-mobile-hero-col-dot hok-hiw-mobile-hero-col-dot-listing"></span>
                Listing
              </div>
              <h3 className="hok-hiw-mobile-hero-col-title hok-hiw-mobile-hero-col-title-listing">
                Give your wardrobe a second life
              </h3>
              
              <div className="hok-hiw-mobile-hero-steps">
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">01</span>
                  <span className="hok-hiw-mobile-hero-step-text hok-hiw-mobile-hero-step-text-listing">Photograph & list</span>
                </div>
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">02</span>
                  <span className="hok-hiw-mobile-hero-step-text hok-hiw-mobile-hero-step-text-listing">HOK reviews & features</span>
                </div>
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">03</span>
                  <span className="hok-hiw-mobile-hero-step-text hok-hiw-mobile-hero-step-text-listing">A buyer finds it</span>
                </div>
                <div className="hok-hiw-mobile-hero-step">
                  <span className="hok-hiw-mobile-hero-step-num">04</span>
                  <span className="hok-hiw-mobile-hero-step-text hok-hiw-mobile-hero-step-text-listing">Paid in 3 working days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hok-hiw-mobile-hero-scroll-hint">
            <span className="hok-hiw-mobile-hero-scroll-line"></span>
            <span className="hok-hiw-mobile-hero-scroll-text">Scroll to read in full</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileHeroSection;