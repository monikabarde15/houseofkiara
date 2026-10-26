// src\components\Profile\ui\SectionLabel.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import "../../../styles/Profile/ui/SectionLabel.css";

const SectionLabel = ({ title, count, countLabel, linkText, onLinkClick }) => {
  return (
    <div className="profile-section-label">
      <div className="profile-section-label-left">
        {title}
        {count !== undefined && countLabel && (
          <span className="profile-section-label-count"> • {count} {countLabel}</span>
        )}
      </div>
      {linkText && (
        <button
          className="profile-section-label-link"
          onClick={onLinkClick}
        >
          <span>{linkText}</span>

          <ArrowRight
            className="profile-section-label-arrow"
            strokeWidth={1.5}
          />
        </button>
      )}
    </div>
  );
};

export default SectionLabel;