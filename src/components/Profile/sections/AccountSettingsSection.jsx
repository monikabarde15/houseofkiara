import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Wallet, LogOut, Trash2, ChevronRight } from 'lucide-react';
import SettingsCard from '../cards/SettingsCard';
import SignOutModal from '../modals/SignOutModal';
import DeleteAccountModal from '../modals/DeleteAccountModal';
import EditProfileModal from '../modals/EditProfileModal';
import Toast from '../ui/Toast';
import useAuthStore from '../../../store/authStore';
import "../../../styles/Profile/sections/AccountSettingsSection.css";

const AccountSettingsSection = () => {
  const navigate = useNavigate();
  const { user, token, updateProfile, logout } = useAuthStore();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

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

  const handleChangePassword = async () => {
    if (isSendingReset) return;
    setIsSendingReset(true);
    const userEmail = user?.email;

    try {
      let response = await fetch('/api/customer/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: userEmail }),
      });

      // Fallback to customer auth forgot-password if profile route fails
      if (!response.ok && userEmail) {
        response = await fetch('/api/customer/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        });
      }

      const res = await response.json().catch(() => ({}));
      if (response.ok && res.success) {
        showToastMessage(res.message || `Password reset link sent to ${userEmail || 'your email'}. Check your inbox!`);
      } else {
        showToastMessage(res.message || "Please restart backend server to apply route changes.");
      }
    } catch (err) {
      showToastMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    logout(true);
    navigate('/auth');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    showToastMessage("Account deletion request submitted to support");
  };

  const handleWhatsAppToggle = async (isOn) => {
    await updateProfile({
      preferences: {
        ...(user?.preferences || {}),
        whatsappNotifications: isOn,
      }
    });
    showToastMessage(`WhatsApp updates ${isOn ? "enabled" : "disabled"}`);
  };

  const handleEmailToggle = async (isOn) => {
    await updateProfile({
      preferences: {
        ...(user?.preferences || {}),
        newsletter: isOn,
      }
    });
    showToastMessage(`Email notifications ${isOn ? "enabled" : "disabled"}`);
  };

  const handleOffersToggle = async (isOn) => {
    await updateProfile({
      preferences: {
        ...(user?.preferences || {}),
        marketingOptIn: isOn,
      }
    });
    showToastMessage(`Offer notifications ${isOn ? "enabled" : "disabled"}`);
  };

  const handleOpenDetail = (detailId) => {
    console.log("Open detail:", detailId);
  };

  const firstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Customer');
  const lastName = user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const fullName = user?.name || [firstName, lastName].filter(Boolean).join(' ') || 'Customer';
  const email = user?.email || 'customer@houseofkaira.com';
  const mobile = user?.phone || user?.mobile || 'Not provided';
  const city = user?.location || user?.city || 'India';

  const settingsCards = [
    {
      title: "Personal Details",
      iconType: "gold",
      icon: <User size={13} strokeWidth={1.5} />,
      rows: [
        { label: "Full Name", value: fullName, onClick: handleEditProfile },
        { label: "Email Address", value: email, onClick: handleEditProfile },
        { label: "Mobile Number", value: mobile, onClick: handleEditProfile },
        { label: "City", value: city, onClick: handleEditProfile }
      ]
    },
    {
      title: "Security",
      iconType: "charcoal",
      icon: <Lock size={13} strokeWidth={1.5} />,
      rows: [
        { label: "Password", value: isSendingReset ? "Sending link..." : "Send reset link to email", onClick: handleChangePassword },
        { label: "Login Method", value: user?.googleId ? "Google Account" : "Email / Mobile & Password" }
      ]
    },
    {
      title: "Notifications",
      iconType: "sage",
      icon: <Bell size={13} strokeWidth={1.5} />,
      rows: [
        { 
          label: "WhatsApp Updates", 
          subLabel: "Bookings, dispatch, returns", 
          isToggle: true, 
          value: user?.preferences?.whatsappNotifications !== false, 
          onToggle: handleWhatsAppToggle 
        },
        { 
          label: "Email Notifications", 
          subLabel: "Orders, rentals, payouts", 
          isToggle: true, 
          value: user?.preferences?.newsletter !== false, 
          onToggle: handleEmailToggle 
        },
        { 
          label: "New Arrivals & Offers", 
          subLabel: "Curated picks, occasions", 
          isToggle: true, 
          value: Boolean(user?.preferences?.marketingOptIn), 
          onToggle: handleOffersToggle 
        }
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
      label: isSendingReset ? "Sending Reset Link..." : "Change Password",
      subLabel: "Send password reset link to your email",
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditProfile}
        userData={{
          firstName,
          lastName,
          email,
          mobile,
          city
        }}
      />

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