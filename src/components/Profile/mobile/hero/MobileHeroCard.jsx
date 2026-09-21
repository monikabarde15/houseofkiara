import React, { useState } from 'react';
import { SquarePen } from 'lucide-react';
import MobileEditProfileModal from '../modals/MobileEditProfileModal';
import Toast from '../../ui/Toast';
import useAuthStore from '../../../../store/authStore';
import "../../../../styles/Profile/mobile/hero/MobileHeroCard.css";

const MobileHeroCard = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEditProfile = async (data) => {
    try {
      const res = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email,
        phone: data.mobile,
        mobile: data.mobile,
        city: data.city,
        location: data.city,
      });

      if (res.success) {
        showToastMessage("Profile updated successfully");
      } else {
        showToastMessage(res.message || "Failed to update profile");
      }
    } catch (err) {
      showToastMessage("Failed to update profile");
    }
    setIsEditModalOpen(false);
  };

  // Dynamic values
  const firstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Customer');
  const lastName = user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const fullName = user?.name || [firstName, lastName].filter(Boolean).join(' ') || 'Customer';
  const email = user?.email || 'customer@houseofkaira.com';
  const mobile = user?.phone || user?.mobile || '';
  const city = user?.location || user?.city || 'India';
  const memberSince = user?.joinedDate || '2025';

  const initials = (
    (firstName?.[0] || '') + (lastName?.[0] || (firstName?.[1] || ''))
  ).toUpperCase() || 'HK';

  const rentalsCount = user?.ordersCount || 0;
  const purchasesCount = user?.purchasesCount || 0;
  const savedCount = user?.wishlist?.length || user?.wishlistCount || 0;

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
              <div className="profile-mobile-avatar-initials">{initials}</div>
            </div>
            
            {/* Name & Info Block */}
            <div className="profile-mobile-info">
              <div className="profile-mobile-tier">✦ Member</div>
              <div className="profile-mobile-name">{fullName}</div>
              <div className="profile-mobile-email">{email}</div>
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
              <div className="profile-mobile-stat-number">{rentalsCount}</div>
              <div className="profile-mobile-stat-label">RENTALS</div>
            </div>
            <div className="profile-mobile-stat-divider"></div>
            <div className="profile-mobile-stat">
              <div className="profile-mobile-stat-number">{purchasesCount}</div>
              <div className="profile-mobile-stat-label">PURCHASES</div>
            </div>
            <div className="profile-mobile-stat-divider"></div>
            <div className="profile-mobile-stat">
              <div className="profile-mobile-stat-number">{savedCount}</div>
              <div className="profile-mobile-stat-label">SAVED</div>
            </div>
          </div>
          
          {/* Member Since Footer */}
          <div className="profile-mobile-since">Member since {memberSince}</div>
        </div>
      </div>

      <MobileEditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditProfile}
        profileData={{
          firstName,
          lastName,
          email,
          mobile,
          city
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