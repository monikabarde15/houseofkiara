import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/howitworks/mobile/mobile-mode-cards.css';

const MobileModeCards = () => {
  const navigate = useNavigate();

  const handleRentClick = () => {
    navigate('/main-page?section=rent');
  };

  const handlePrelovedClick = () => {
    navigate('/main-page?section=preloved');
  };

  return (
    <section id="section-modes" className="hok-hiw-mobile-modes-section">
      {/* Section Header */}
      <div className="hok-hiw-mobile-modes-header">
        <div className="hok-hiw-mobile-modes-eyebrow">
          <span className="hok-hiw-mobile-modes-line"></span>
          <span className="hok-hiw-mobile-modes-eyebrow-text">Two ways to wear</span>
        </div>
        
        <h2 className="hok-hiw-mobile-modes-title">
           Find what <em>fits</em> your moment 
        </h2>
      </div>

      {/* Mode Cards Stack */}
      <div className="hok-hiw-mobile-modes-stack">
        {/* Rent Card - Light */}
        <div className="hok-hiw-mobile-mcard hok-hiw-mobile-mcard-rent">
          {/* Ghost Letter */}
          <span className="hok-hiw-mobile-mcard-ghost">R</span>
          
          {/* Badge */}
          <div className="hok-hiw-mobile-mcard-badge">
            <span className="hok-hiw-mobile-mcard-swatch hok-hiw-mobile-mcard-swatch-rent"></span>
            <span className="hok-hiw-mobile-mcard-badge-text">Rent</span>
          </div>
          
          {/* Title */}
          <h3 className="hok-hiw-mobile-mcard-title">
            Access couture <em>freely</em>.
          </h3>
          
          {/* Subtitle */}
          <p className="hok-hiw-mobile-mcard-subtitle">
            The whole outfit. None of the storage.
          </p>
          
          {/* Steps */}
          <div className="hok-hiw-mobile-mcard-steps">
            {/* Step 1 */}
            <div className="hok-hiw-mobile-ms-row">
              <span className="hok-hiw-mobile-ms-n">01</span>
              <div className="hok-hiw-mobile-ms-content">
                <div className="hok-hiw-mobile-ms-title">Browse and select your rental dates</div>
                <div className="hok-hiw-mobile-ms-desc">Pick your event date and we work backwards — your look arrives at least one day before.</div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="hok-hiw-mobile-ms-row">
              <span className="hok-hiw-mobile-ms-n">02</span>
              <div className="hok-hiw-mobile-ms-content">
                <div className="hok-hiw-mobile-ms-title">Checkout with a refundable deposit</div>
                <div className="hok-hiw-mobile-ms-desc">Deposit held against damage, returned in full within 3 working days of collection.</div>
              </div>
            </div>
            
            {/* Note 2 */}
            <div className="hok-hiw-mobile-ms-note">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#C9A96E" strokeWidth="1.4"/>
                <path d="M6 3.5V6M6 8.5H6.005" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span>Deposit amount varies by piece and is shown clearly on the product page.</span>
            </div>
            
            {/* Step 3 */}
            <div className="hok-hiw-mobile-ms-row">
              <span className="hok-hiw-mobile-ms-n">03</span>
              <div className="hok-hiw-mobile-ms-content">
                <div className="hok-hiw-mobile-ms-title">Doorstep delivery — dry-cleaned and pressed</div>
                <div className="hok-hiw-mobile-ms-desc">Your piece arrives ready to wear, straight from the box. No prep, no steaming required.</div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="hok-hiw-mobile-ms-row">
              <span className="hok-hiw-mobile-ms-n">04</span>
              <div className="hok-hiw-mobile-ms-content">
                <div className="hok-hiw-mobile-ms-title">We collect after your event</div>
                <div className="hok-hiw-mobile-ms-desc">Schedule pickup at your convenience. Pack it back as it came — cleaning handled entirely by HOK.</div>
              </div>
            </div>
            
            {/* Note 4 */}
            <div className="hok-hiw-mobile-ms-note">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#C9A96E" strokeWidth="1.4"/>
                <path d="M6 3.5V6M6 8.5H6.005" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span>Please don't attempt to clean the piece yourself.</span>
            </div>
          </div>
          
          {/* CTA */}
          <button className="hok-hiw-mobile-mcard-cta" onClick={handleRentClick}>
            Explore Rentals <span className="hok-hiw-mobile-mcard-arrow">→</span>
          </button>
        </div>

        {/* Preloved Card - Dark */}
        <div className="hok-hiw-mobile-mcard hok-hiw-mobile-mcard-preloved">
          {/* Ghost Letter */}
          <span className="hok-hiw-mobile-mcard-ghost hok-hiw-mobile-mcard-ghost-preloved">P</span>
          
          {/* Badge */}
          <div className="hok-hiw-mobile-mcard-badge">
            <span className="hok-hiw-mobile-mcard-swatch hok-hiw-mobile-mcard-swatch-preloved"></span>
            <span className="hok-hiw-mobile-mcard-badge-text hok-hiw-mobile-mcard-badge-text-preloved">Buy Preloved</span>
          </div>
          
          {/* Title */}
          <h3 className="hok-hiw-mobile-mcard-title hok-hiw-mobile-mcard-title-preloved">
            Own the craft. <em>Not the price.</em>
          </h3>
          
          {/* Subtitle */}
          <p className="hok-hiw-mobile-mcard-subtitle hok-hiw-mobile-mcard-subtitle-preloved">
            Every piece tells a story. Now it's yours.
          </p>
          
          {/* Steps */}
          <div className="hok-hiw-mobile-mcard-steps hok-hiw-mobile-mcard-steps-preloved">
            {/* Step 1 */}
            <div className="hok-hiw-mobile-ms-row hok-hiw-mobile-ms-row-preloved">
              <span className="hok-hiw-mobile-ms-n hok-hiw-mobile-ms-n-preloved">01</span>
              <div className="hok-hiw-mobile-ms-content hok-hiw-mobile-ms-content-preloved">
                <div className="hok-hiw-mobile-ms-title hok-hiw-mobile-ms-title-preloved">Browse the Preloved edit</div>
                <div className="hok-hiw-mobile-ms-desc hok-hiw-mobile-ms-desc-preloved">Full condition disclosure on every listing. You know exactly what you're buying.</div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="hok-hiw-mobile-ms-row hok-hiw-mobile-ms-row-preloved">
              <span className="hok-hiw-mobile-ms-n hok-hiw-mobile-ms-n-preloved">02</span>
              <div className="hok-hiw-mobile-ms-content hok-hiw-mobile-ms-content-preloved">
                <div className="hok-hiw-mobile-ms-title hok-hiw-mobile-ms-title-preloved">Buy at listed price or make an offer</div>
                <div className="hok-hiw-mobile-ms-desc hok-hiw-mobile-ms-desc-preloved">Make an Offer is exclusive to Preloved — never available on rentals.</div>
              </div>
            </div>
            
            {/* Note 2 - Preloved */}
            <div className="hok-hiw-mobile-ms-note hok-hiw-mobile-ms-note-preloved">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#C9A96E" strokeWidth="1.4"/>
                <path d="M6 3.5V6M6 8.5H6.005" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span>Make an Offer is exclusive to Preloved. Rental prices are fixed.</span>
            </div>
            
            {/* Step 3 */}
            <div className="hok-hiw-mobile-ms-row hok-hiw-mobile-ms-row-preloved">
              <span className="hok-hiw-mobile-ms-n hok-hiw-mobile-ms-n-preloved">03</span>
              <div className="hok-hiw-mobile-ms-content hok-hiw-mobile-ms-content-preloved">
                <div className="hok-hiw-mobile-ms-title hok-hiw-mobile-ms-title-preloved">Checkout securely</div>
                <div className="hok-hiw-mobile-ms-desc hok-hiw-mobile-ms-desc-preloved">Payment processed through HOK. The lister dispatches directly — HOK coordinates and confirms.</div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="hok-hiw-mobile-ms-row hok-hiw-mobile-ms-row-preloved">
              <span className="hok-hiw-mobile-ms-n hok-hiw-mobile-ms-n-preloved">04</span>
              <div className="hok-hiw-mobile-ms-content hok-hiw-mobile-ms-content-preloved">
                <div className="hok-hiw-mobile-ms-title hok-hiw-mobile-ms-title-preloved">It arrives. It's yours forever.</div>
                <div className="hok-hiw-mobile-ms-desc hok-hiw-mobile-ms-desc-preloved">No time windows, no return logistics. Yours for keeps.</div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <button className="hok-hiw-mobile-mcard-cta hok-hiw-mobile-mcard-cta-preloved" onClick={handlePrelovedClick}>
            Shop Preloved <span className="hok-hiw-mobile-mcard-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileModeCards;