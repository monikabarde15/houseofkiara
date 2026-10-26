// src/components/Profile/layout/ProfileLayout.jsx
import React from 'react';
import LeftColumn from '../left/LeftColumn';
import RightColumn from '../right/RightColumn';
import PageTitleStrip from './PageTitleStrip';
import useAuthStore from '../../../store/authStore';
import useProfileDashboard from '../hooks/useProfileDashboard';
import "../../../styles/Profile/layout/ProfileLayout.css";

const ProfileLayout = () => {
  const { user } = useAuthStore();
  const dashboard = useProfileDashboard();

  const memberSince = user?.joinedDate || '2025';
  const activeRentalCount = dashboard?.counts?.activeRentals || 0;

  return (
    <div className="profile-layout">
      <PageTitleStrip activeRentalCount={activeRentalCount} memberSince={memberSince} />
      <div className="profile-two-column">
        <LeftColumn dashboard={dashboard} />
        <RightColumn dashboard={dashboard} />
      </div>
    </div>
  );
};

export default ProfileLayout;