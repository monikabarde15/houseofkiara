import React from 'react';
import { ArrowRight } from 'lucide-react';
import "../../../styles/Profile/sections/EarnPromptBanner.css";

const EarnPromptBanner = () => {
  const handleListPiece = () => {
    console.log("Redirecting to List Your Piece form...");
  };

  const handleLearnMore = () => {
    console.log("Learn how it works...");
  };

  return (
    <div className="profile-earn-banner">
      <div className="profile-earn-inner">
        <div className="profile-earn-left">
          <div className="profile-earn-eyebrow">For Listers</div>
          <div className="profile-earn-heading">Your lehenga deserves another standing ovation.</div>
          <div className="profile-earn-body">
            List your occasion wear on House of Kaira and earn every time it goes to a new celebration — 
            we handle pickups, photography, quality checks, delivery, and returns.
          </div>
        </div>
        <div className="profile-earn-ctas">
          <button className="profile-earn-primary" onClick={handleListPiece}>
            List a Piece
            <ArrowRight size={12} strokeWidth={1.5} />
          </button>
          <button className="profile-earn-secondary" onClick={handleLearnMore}>
            Learn how it works
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarnPromptBanner;