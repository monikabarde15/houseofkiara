import React from 'react';
import "../../../../styles/Profile/mobile/ui/MobileSectionLabel.css";

const MobileSectionLabel = ({ title, count, countLabel,linkText, onLinkClick }) => {
  return (
    <div className="profile-mobile-section-eyebrow">
      <div className="profile-mobile-section-left">
        {title}
        {count !== undefined && (
          <span className="profile-mobile-section-count"> • {count} {countLabel} </span>
        )}
      </div>
      {linkText && (
        <button className="profile-mobile-section-link" onClick={onLinkClick}>
          {linkText}
        </button>
      )}
    </div>
  );
};

export default MobileSectionLabel;