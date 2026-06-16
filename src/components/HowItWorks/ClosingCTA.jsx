import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/howitworks/closing-cta.css';

const ClosingCTA = () => {
  const navigate = useNavigate();

  const handleBrowseCollection = () => {
    navigate('/main-page');
  };

  const handleListYourPiece = () => {
    navigate('/list-your-piece/');
  };

  return (
    <section className="hok-hiw-closing-cta">
      {/* Decorative watermark */}
      <span className="hok-hiw-closing-watermark">∞</span>

      <div className="hok-hiw-closing-inner">
        {/* Eyebrow */}
        <div className="hok-hiw-closing-eyebrow">
          <span className="hok-hiw-closing-line"></span>
          <span className="hok-hiw-closing-eyebrow-text">Ready</span>
          <span className="hok-hiw-closing-line"></span>
        </div>

        {/* Title */}
        <h2 className="hok-hiw-closing-title">
          Every outfit has a story. <br />
          We make sure it's <em>never</em> the last chapter.
        </h2>

        {/* Body */}
        <p className="hok-hiw-closing-body">
          Whether you're dressing for a celebration or giving a beautiful piece another moment to shine – 
          this is where that story continues.
        </p>

        {/* Buttons */}
        <div className="hok-hiw-closing-buttons">
          <button 
            className="hok-hiw-closing-btn-primary" 
            onClick={handleBrowseCollection}
          >
            Browse the Collection
          </button>
          
          <button 
            className="hok-hiw-closing-btn-secondary" 
            onClick={handleListYourPiece}
          >
            List Your Piece →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;