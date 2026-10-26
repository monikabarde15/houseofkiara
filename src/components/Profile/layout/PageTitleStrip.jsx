// src\components\Profile\layout\PageTitleStrip.jsx
import React from 'react';
import "../../../styles/Profile/layout/PageTitleStrip.css";

const PageTitleStrip = ({ activeRentalCount = 1, memberSince = "April 2025" }) => {
  return (
    <div className="profile-title-strip">
      <div className="profile-title-strip-content">
        <div className="profile-title-left">
          <h1>
            My <span className="profile-title-italic">Profile</span>
          </h1>
        </div>
        
        <div className="profile-title-right">
          <div className="profile-live-badge">
            <span className="profile-pulse-dot"></span>
            <span className="profile-active-rental-text">{activeRentalCount} active rental</span>
          </div>
          <div className="profile-member-since">
            Member since {memberSince}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTitleStrip;