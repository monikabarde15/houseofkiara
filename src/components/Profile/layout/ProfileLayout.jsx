// src\components\Profile\layout\ProfileLayout.jsx
import React from 'react';
import LeftColumn from '../left/LeftColumn';
import RightColumn from '../right/RightColumn';
import PageTitleStrip from './PageTitleStrip';
import "../../../styles/Profile/layout/ProfileLayout.css";

const ProfileLayout = () => {
  return (
    <div className="profile-layout">
      <PageTitleStrip activeRentalCount={1} memberSince="April 2025" />
      <div className="profile-two-column">
        <LeftColumn />
        <RightColumn />
      </div>
    </div>
  );
};

export default ProfileLayout;