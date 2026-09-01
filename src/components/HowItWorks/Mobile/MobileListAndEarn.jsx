import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/howitworks/mobile/mobile-list-and-earn.css';

const MobileListAndEarn = () => {
  const navigate = useNavigate();

  const handleListYourPiece = () => {
    navigate('/list-your-piece/');
  };

  return (
    <section id="section-sell" className="hok-hiw-mobile-list-earn">
      {/* Earn Watermark */}
      <span className="hok-hiw-mobile-le-watermark">Earn</span>

      <div className="hok-hiw-mobile-le-container">
        {/* Left Column */}
        <div className="hok-hiw-mobile-le-left">
          {/* Eyebrow */}
          <div className="hok-hiw-mobile-le-eyebrow">
            <span className="hok-hiw-mobile-le-line"></span>
            <span className="hok-hiw-mobile-le-eyebrow-text">List & Earn</span>
          </div>

          {/* Title */}
          <h2 className="hok-hiw-mobile-le-title">
            Your wardrobe has been waiting <em>for this</em>.
          </h2>

          {/* Lead */}
          <p className="hok-hiw-mobile-le-lead">
            The wedding lehenga in the back of your cupboard. The bridal set that deserves another evening. 
            Every designer piece you loved and wore once is a piece someone is searching for right now.
          </p>

          {/* Commission Table */}
          <div className="hok-hiw-mobile-le-table">
            {/* Row 1 */}
            <div className="hok-hiw-mobile-le-row">
              <div className="hok-hiw-mobile-le-row-left">
                <div className="hok-hiw-mobile-le-mode-label">Rental listing</div>
                <div className="hok-hiw-mobile-le-sub-label">Per booking, to you</div>
              </div>
              <div className="hok-hiw-mobile-le-figure">40%</div>
            </div>

            {/* Row 2 */}
            <div className="hok-hiw-mobile-le-row">
              <div className="hok-hiw-mobile-le-row-left">
                <div className="hok-hiw-mobile-le-mode-label">Preloved resale</div>
                <div className="hok-hiw-mobile-le-sub-label">Of sale price, to you</div>
              </div>
              <div className="hok-hiw-mobile-le-figure">75%</div>
            </div>

            {/* Row 3 */}
            <div className="hok-hiw-mobile-le-row">
              <div className="hok-hiw-mobile-le-row-left">
                <div className="hok-hiw-mobile-le-mode-label">Payout timeline</div>
                <div className="hok-hiw-mobile-le-sub-label">Direct bank transfer</div>
              </div>
              <div className="hok-hiw-mobile-le-figure hok-hiw-mobile-le-figure-small">
                T+<em>3</em> <span className="hok-hiw-mobile-le-working-days">working days</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="hok-hiw-mobile-le-row">
              <div className="hok-hiw-mobile-le-row-left">
                <div className="hok-hiw-mobile-le-mode-label">Listing fee</div>
                <div className="hok-hiw-mobile-le-sub-label">It costs nothing to list</div>
              </div>
              <div className="hok-hiw-mobile-le-figure hok-hiw-mobile-le-figure-none">None</div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="hok-hiw-mobile-le-cta" onClick={handleListYourPiece}>
            List Your Piece
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L6 11M6 11L10 7M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="hok-hiw-mobile-le-divider"></div>

        {/* Right Column */}
        <div className="hok-hiw-mobile-le-right">
          <div className="hok-hiw-mobile-le-right-label">The Lister Journey — four steps</div>

          {/* Step 1 */}
          <div className="hok-hiw-mobile-sstep">
            <div className="hok-hiw-mobile-sstep-connector"></div>
            <div className="hok-hiw-mobile-sstep-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect width="11" height="11" x="2" y="2" rx="1.5" ry="1.5" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="6" cy="6" r="1.2" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 9.5l-2.1-2.1a1.4 1.4 0 0 0-2 0L4 14" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hok-hiw-mobile-sstep-content">
              <div className="hok-hiw-mobile-sstep-title">Photograph & List</div>
              <div className="hok-hiw-mobile-sstep-tag">
                <span className="hok-hiw-mobile-sstep-tag-line"></span>
                Under 10 minutes to list
              </div>
              <div className="hok-hiw-mobile-sstep-desc">
                Upload photos of your piece and set your price. For preloved pieces, complete 
                the Honest Disclosure block — condition, wear count, alterations. Your listing goes 
                live after our team reviews it.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="hok-hiw-mobile-sstep">
            <div className="hok-hiw-mobile-sstep-connector"></div>
            <div className="hok-hiw-mobile-sstep-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M10 13v-1.3a2.6 2.6 0 0 0-2.6-2.6H3.9A2.6 2.6 0 0 0 1.3 11.7V13" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 1.9a2.6 2.6 0 0 1 0 5" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 13v-1.3a2.6 2.6 0 0 0-2-2.5" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5.6" cy="4.4" r="2.6" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hok-hiw-mobile-sstep-content">
              <div className="hok-hiw-mobile-sstep-title">HOK Reviews & Features</div>
              <div className="hok-hiw-mobile-sstep-tag">
                <span className="hok-hiw-mobile-sstep-tag-line"></span>
                You do nothing at this stage
              </div>
              <div className="hok-hiw-mobile-sstep-desc">
                Our curation team reviews every listing before it goes live. Approved pieces are 
                promoted to the right audience — featured in the editorial, surfaced in searches. 
                Reviewed within 48 hours.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="hok-hiw-mobile-sstep">
            <div className="hok-hiw-mobile-sstep-connector"></div>
            <div className="hok-hiw-mobile-sstep-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M7.5 4.4v9.2" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 6.9v5.2a1.3 1.3 0 0 1-1.3 1.3H3.8a1.3 1.3 0 0 1-1.3-1.3V6.9" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.7 4.4a0.7 0.7 0 0 1 0-3.3A3.2 5.3 0 0 1 7.5 4.4a3.2 5.3 0 0 1 2.8-3.3 0.7 0.7 0 0 1 0 3.3" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="4.4" width="11" height="2.6" rx="0.7" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hok-hiw-mobile-sstep-content">
              <div className="hok-hiw-mobile-sstep-title">A Buyer Finds It</div>
              <div className="hok-hiw-mobile-sstep-tag">
                <span className="hok-hiw-mobile-sstep-tag-line"></span>
                Prepaid logistics label provided
              </div>
              <div className="hok-hiw-mobile-sstep-desc">
                When a buyer commits, you receive dispatch instructions and a prepaid logistics 
                label. For rental pieces, HOK coordinates all logistics end-to-end — you don't 
                need to arrange anything.
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="hok-hiw-mobile-sstep">
            <div className="hok-hiw-mobile-sstep-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect width="12.5" height="9" x="1.3" y="3.1" rx="1.3" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="1.3" x2="13.7" y1="6.3" y2="6.3" stroke="#EBD5B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hok-hiw-mobile-sstep-content">
              <div className="hok-hiw-mobile-sstep-title">Paid in 3 Working Days</div>
              <div className="hok-hiw-mobile-sstep-tag">
                <span className="hok-hiw-mobile-sstep-tag-line"></span>
                Direct to your bank account
              </div>
              <div className="hok-hiw-mobile-sstep-desc">
                Once the buyer confirms receipt (or the rental period concludes), earnings are 
                processed directly to your registered bank account. T+3 working days. No 
                chasing, no ambiguity.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileListAndEarn;