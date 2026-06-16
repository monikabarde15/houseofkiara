import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/howitworks/mobile/mobile-closing-cta.css';

const MobileClosingCTA = () => {
  const navigate = useNavigate();

  const handleBrowseCollection = () => {
    navigate('/main-page');
  };

  const handleListYourPiece = () => {
    navigate('/list-your-piece/');
  };

  return (
    <section className="hok-hiw-mobile-closing-cta">
      {/* Decorative watermark */}
      <span className="hok-hiw-mobile-closing-watermark">∞</span>

      <div className="hok-hiw-mobile-closing-inner">
        {/* Eyebrow */}
        <div className="hok-hiw-mobile-closing-eyebrow">
          <span className="hok-hiw-mobile-closing-line"></span>
          <span className="hok-hiw-mobile-closing-eyebrow-text">Ready</span>
          <span className="hok-hiw-mobile-closing-line"></span>
        </div>

        {/* Title */}
        <h2 className="hok-hiw-mobile-closing-title">
          Every outfit has a story. <br />
          We make sure it's <em>never</em> the last chapter.
        </h2>

        {/* Body */}
        <p className="hok-hiw-mobile-closing-body">
          Whether you're dressing for a celebration or giving a beautiful piece another moment to shine – 
          this is where that story continues.
        </p>

        {/* Buttons */}
        <div className="hok-hiw-mobile-closing-buttons">
          <button 
            className="hok-hiw-mobile-closing-btn-primary" 
            onClick={handleBrowseCollection}
          >
            Browse the Collection
          </button>
          
          <button 
            className="hok-hiw-mobile-closing-btn-secondary" 
            onClick={handleListYourPiece}
          >
            List Your Piece →
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileClosingCTA;