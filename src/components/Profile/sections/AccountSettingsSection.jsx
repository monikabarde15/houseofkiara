import React, { useState } from 'react';
import { User, Lock, Bell, Wallet, LogOut, Trash2, ChevronRight } from 'lucide-react';
import SettingsCard from '../cards/SettingsCard';
import SignOutModal from '../modals/SignOutModal';
import DeleteAccountModal from '../modals/DeleteAccountModal';
import Toast from '../ui/Toast';
import "../../../styles/Profile/sections/AccountSettingsSection.css";

const AccountSettingsSection = () => {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  const handleChangePassword = () => {
    showToastMessage("Change password email sent to your inbox");
  };

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    showToastMessage("Signed out successfully");
    console.log("User signed out");
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    showToastMessage("Account deletion request submitted");
    console.log("Account deletion requested");
  };

  const handleWhatsAppToggle = (isOn) => {
    console.log(`WhatsApp notifications ${isOn ? "enabled" : "disabled"}`);
  };

  const handleEmailToggle = (isOn) => {
    console.log(`Email notifications ${isOn ? "enabled" : "disabled"}`);
  };

  const handleOffersToggle = (isOn) => {
    console.log(`Offer notifications ${isOn ? "enabled" : "disabled"}`);
  };

  const handleOpenDetail = (detailId) => {
    console.log("Open detail:", detailId);
  };

  const settingsCards = [
    {
      title: "Personal Details",
      iconType: "gold",
      icon: <User size={13} strokeWidth={1.5} />,
      rows: [
        { label: "Full Name", value: "Priya Varma", onClick: handleEditProfile },
        { label: "Email Address", value: "priya.varma@gmail.com", onClick: handleEditProfile },
        { label: "Mobile Number", value: "+91 98765 43210", onClick: handleEditProfile },
        { label: "City", value: "Indore", onClick: handleEditProfile }
      ]
    },
    {
      title: "Security",
      iconType: "charcoal",
      icon: <Lock size={13} strokeWidth={1.5} />,
      rows: [
        { label: "Password", value: "Last changed 3 months ago", onClick: handleChangePassword },
        { label: "Login Method", value: "Email & Password" }
      ]
    },
    {
      title: "Notifications",
      iconType: "sage",
      icon: <Bell size={13} strokeWidth={1.5} />,
      rows: [
        { label: "WhatsApp Updates", subLabel: "Bookings, dispatch, returns", isToggle: true, value: true, onToggle: handleWhatsAppToggle },
        { label: "Email Notifications", subLabel: "Orders, rentals, payouts", isToggle: true, value: true, onToggle: handleEmailToggle },
        { label: "New Arrivals & Offers", subLabel: "Curated picks, occasions", isToggle: true, value: false, onToggle: handleOffersToggle }
      ]
    },
    {
      title: "Deposit Tracker",
      iconType: "terracotta",
      icon: <Wallet size={13} strokeWidth={1.5} />,
      rows: [
        { 
          label: "Ivory Tissue Lehenga", 
          value: "₹15,000 PENDING", 
          valueClass: "profile-account-dpill-p",
          onClick: () => handleOpenDetail("lehenga") 
        },
        { 
          label: "Blush Anarkali Set", 
          value: "REFUNDED", 
          valueClass: "profile-account-dpill-r",
          onClick: () => handleOpenDetail("anarkali") 
        }
      ]
    }
  ];

  const accountActions = [
    {
      label: "Change Password",
      subLabel: "Update your login credentials",
      icon: <Lock size={12} strokeWidth={1.5} />,
      iconBg: "rgba(26, 22, 18, 0.06)",
      iconStroke: "#3C3529",
      onClick: handleChangePassword
    },
    {
      label: "Sign Out",
      subLabel: "Sign out on this device",
      icon: <LogOut size={12} strokeWidth={1.5} />,
      iconBg: "rgba(184, 92, 56, 0.08)",
      iconStroke: "#B85C38",
      onClick: handleSignOut
    },
    {
      label: "Delete Account",
      subLabel: "Permanently remove your account and all data",
      icon: <Trash2 size={12} strokeWidth={1.5} />,
      iconBg: "rgba(184, 92, 56, 0.06)",
      iconStroke: "#B85C38",
      isRed: true,
      onClick: handleDeleteAccount
    }
  ];

  return (
    <>
      <div className="profile-account-section" id="settings">
        {/* Settings Grid */}
        <div className="profile-account-grid">
          {settingsCards.map((card, index) => (
            <SettingsCard key={index} card={card} />
          ))}
        </div>

        {/* Account Actions (Danger Zone) */}
        <div className="profile-account-dz">
          <div className="profile-account-dz-head">Account Actions</div>
          {accountActions.map((action, index) => (
            <div 
              key={index}
              className="profile-account-di"
              onClick={action.onClick}
            >
              <div 
                className="profile-account-di-ic"
                style={{ 
                  background: action.iconBg,
                  stroke: action.iconStroke
                }}
              >
                {action.icon}
              </div>
              <div className="profile-account-di-content">
                <div className={`profile-account-di-l ${action.isRed ? 'profile-account-di-l-red' : ''}`}>
                  {action.label}
                </div>
                <div className="profile-account-di-s">{action.subLabel}</div>
              </div>
              <div className="profile-account-di-arr">
                <ChevronRight size={12} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default AccountSettingsSection;