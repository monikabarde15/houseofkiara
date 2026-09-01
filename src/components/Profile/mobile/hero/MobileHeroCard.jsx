import React, { useState } from 'react';
import { SquarePen } from 'lucide-react';
import MobileEditProfileModal from '../modals/MobileEditProfileModal';
import Toast from '../../ui/Toast';
import "../../../../styles/Profile/mobile/hero/MobileHeroCard.css";

const MobileHeroCard = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // User data array
  const [userData, setUserData] = useState({
    firstName: "Priya",
    lastName: "Varma",
    email: "priya.varma@gmail.com",
    mobile: "+91 98765 43210",
    city: "Indore",
    tier: "Member",
    memberSince: "April 2025",
    initials: "PV"
  });

  // Stats data array
  const [stats, setStats] = useState({
    rentals: 4,
    purchases: 2,
    saved: 7
  });

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEditProfile = (data) => {
    setUserData(prev => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      city: data.city
    }));
    setIsEditModalOpen(false);
    showToastMessage("Profile updated");
  };

  return (
    <>
      <div className="profile-mobile-hero-card" data-rise="1">
        <div className="profile-mobile-hero-inner">
          {/* Top Row: Avatar + Info + Edit Button */}
          <div className="profile-mobile-hero-top">
            {/* Avatar */}
            <div className="profile-mobile-avatar">
              <svg className="profile-mobile-avatar-ring" width="50" height="50" viewBox="0 0 50 50">
                <defs>
                  <linearGradient id="mobile-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C9A96E" />
                    <stop offset="100%" stopColor="#7A5B2A" />
                  </linearGradient>
                </defs>
                <circle cx="25" cy="25" r="23" fill="none" stroke="url(#mobile-gold-gradient)" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" />
              </svg>
              <div className="profile-mobile-avatar-initials">{userData.initials}</div>
            </div>
            
            {/* Name & Info Block */}
            <div className="profile-mobile-info">
              <div className="profile-mobile-tier">✦ {userData.tier}</div>
              <div className="profile-mobile-name">{userData.firstName} {userData.lastName}</div>
              <div className="profile-mobile-email">{userData.email}</div>
            </div>
            
            {/* Edit Button */}
            <button className="profile-mobile-edit-btn" onClick={handleEditProfile}>
              <SquarePen size={9} strokeWidth={1.5} />
              Edit
            </button>
          </div>
          
          {/* Stats Bar */}
          <div className="profile-mobile-stats">
            <div className="profile-mobile-stat">
              <div className="profile-mobile-stat-number">{stats.rentals}</div>
              <div className="profile-mobile-stat-label">RENTALS</div>
            </div>
            <div className="profile-mobile-stat-divider"></div>
            <div className="profile-mobile-stat">
              <div className="profile-mobile-stat-number">{stats.purchases}</div>
              <div className="profile-mobile-stat-label">PURCHASES</div>
            </div>
            <div className="profile-mobile-stat-divider"></div>
            <div className="profile-mobile-stat">
              <div className="profile-mobile-stat-number">{stats.saved}</div>
              <div className="profile-mobile-stat-label">SAVED</div>
            </div>
          </div>
          
          {/* Member Since Footer */}
          <div className="profile-mobile-since">Member since {userData.memberSince}</div>
        </div>
      </div>

      <MobileEditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditProfile}
        profileData={{
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobile: userData.mobile,
          city: userData.city
        }}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default MobileHeroCard;