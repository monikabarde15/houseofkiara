import React from 'react';
import '../../../styles/howitworks/mobile/mobile-divider-band.css';

const MobileDividerBand = () => {
  return (
    <section className="hok-hiw-mobile-divider">
      {/* Decorative Infinity Watermark */}
      <span className="hok-hiw-mobile-divider-watermark">∞</span>
      
      <div className="hok-hiw-mobile-divider-content">
        {/* Quote - Above Stats */}
        <div className="hok-hiw-mobile-divider-quote">
          <div className="hok-hiw-mobile-divider-eyebrow">
            <span className="hok-hiw-mobile-divider-line"></span>
            <span className="hok-hiw-mobile-divider-eyebrow-text">The Craft</span>
          </div>
          
          <blockquote className="hok-hiw-mobile-divider-quote-text">
            "The zardozi on a Sabyasachi lehenga doesn't diminish because it's been worn once. 
            Designer craftsmanship deserves to be experienced – not stored."
          </blockquote>
        </div>
        
        {/* Stats - Below Quote */}
        <div className="hok-hiw-mobile-divider-stats">
          {/* Stat 1 */}
          <div className="hok-hiw-mobile-db-stat">
            <div className="hok-hiw-mobile-db-stat-number">
              30–<em>70%</em>
            </div>
            <div className="hok-hiw-mobile-db-stat-label">below retail, preloved</div>
          </div>
          
          {/* Stat 2 */}
          <div className="hok-hiw-mobile-db-stat">
            <div className="hok-hiw-mobile-db-stat-number">
              T+<em>3</em>
            </div>
            <div className="hok-hiw-mobile-db-stat-label">deposit return (working days)</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDividerBand;