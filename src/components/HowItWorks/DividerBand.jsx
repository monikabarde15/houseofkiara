import React from 'react';
import '../../styles/howitworks/divider-band.css';

const DividerBand = () => {
  return (
    <section className="hok-hiw-divider">
      {/* Decorative Infinity Watermark */}
      <span className="hok-hiw-divider-watermark">∞</span>
      
      <div className="hok-hiw-divider-content">
        {/* Left - Quote */}
        <div className="hok-hiw-divider-quote">
          <div className="hok-hiw-divider-eyebrow">
            <span className="hok-hiw-divider-line"></span>
            <span className="hok-hiw-divider-eyebrow-text">The Craft</span>
          </div>
          
          <blockquote className="hok-hiw-divider-quote-text">
            "The zardozi on a Sabyasachi lehenga doesn't diminish because it's been worn once. 
            Designer craftsmanship deserves to be experienced – not stored."
          </blockquote>
        </div>
        
        {/* Right - Stats */}
        <div className="hok-hiw-divider-stats">
          {/* Stat 1 */}
          <div className="hok-hiw-db-stat">
            <div className="hok-hiw-db-stat-number">
              30–<em>70%</em>
            </div>
            <div className="hok-hiw-db-stat-label">below retail, preloved</div>
          </div>
          
          {/* Stat 2 */}
          <div className="hok-hiw-db-stat">
            <div className="hok-hiw-db-stat-number">
              T+<em>3</em>
            </div>
            <div className="hok-hiw-db-stat-label">deposit return (working days)</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DividerBand;