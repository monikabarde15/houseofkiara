// src/components/Profile/layout/ProfileLayout.jsx
import React from 'react';
import LeftColumn from '../left/LeftColumn';
import RightColumn from '../right/RightColumn';
import PageTitleStrip from './PageTitleStrip';
import useAuthStore from '../../../store/authStore';
import "../../../styles/Profile/layout/ProfileLayout.css";

const ProfileLayout = () => {
  const { user } = useAuthStore();
  const memberSince = user?.joinedDate || '2025';
  const activeRentalCount = user?.activeRentalsCount || 0;

  return (
    <div className="profile-layout">
      <PageTitleStrip activeRentalCount={activeRentalCount} memberSince={memberSince} />
      <div className="profile-two-column">
        <LeftColumn />
        <RightColumn />
      </div>
    </div>
  );
};

export default ProfileLayout;