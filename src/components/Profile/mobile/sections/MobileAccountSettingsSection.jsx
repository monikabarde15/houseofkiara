import { useState } from "react";
import {
  User,
  Lock,
  CreditCard,
  Wallet,
  MessageCircle,
  Mail,
  Bell
} from "lucide-react";

import MobileSectionLabel from "../ui/MobileSectionLabel";
import MobileSettingsRow from "../rows/MobileSettingsRow";
import MobileToggle from "../ui/MobileToggle";
import MobileEditProfileModal from "../modals/MobileEditProfileModal";
import Toast from "../../ui/Toast";
import useAuthStore from "../../../../store/authStore";

import "../../../../styles/Profile/mobile/sections/MobileAccountSettingsSection.css";

const MobileAccountSettingsSection = () => {
  const { user, token, updateProfile } = useAuthStore();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const showToastMsg = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const firstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Customer');
  const lastName = user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const email = user?.email || 'customer@houseofkaira.com';
  const mobile = user?.phone || user?.mobile || '';
  const city = user?.location || user?.city || 'India';

  const whatsAppOn = user?.preferences?.whatsappNotifications !== false;
  const emailOn = user?.preferences?.newsletter !== false;
  const offersOn = Boolean(user?.preferences?.marketingOptIn);

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (updatedData) => {
    await updateProfile({
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      name: `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim(),
      email: updatedData.email,
      phone: updatedData.mobile,
      mobile: updatedData.mobile,
      city: updatedData.city,
      location: updatedData.city,
    });
    setIsEditProfileOpen(false);
    showToastMsg("Profile updated successfully");
  };

  const handleToggleWhatsApp = async (val) => {
    await updateProfile({
      preferences: {
        ...(user?.preferences || {}),
        whatsappNotifications: val,
      }
    });
    showToastMsg(`WhatsApp updates ${val ? "enabled" : "disabled"}`);
  };

  const handleToggleEmail = async (val) => {
    await updateProfile({
      preferences: {
        ...(user?.preferences || {}),
        newsletter: val,
      }
    });
    showToastMsg(`Email notifications ${val ? "enabled" : "disabled"}`);
  };

  const handleToggleOffers = async (val) => {
    await updateProfile({
      preferences: {
        ...(user?.preferences || {}),
        marketingOptIn: val,
      }
    });
    showToastMsg(`Offer notifications ${val ? "enabled" : "disabled"}`);
  };

  const handleSecurity = async () => {
    if (isSendingReset) return;
    setIsSendingReset(true);
    try {
      const response = await fetch('/api/customer/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.success) {
        showToastMsg(`Password reset link sent to ${email}. Check your inbox!`);
      } else {
        showToastMsg(res.message || "Failed to send reset link");
      }
    } catch (err) {
      showToastMsg("Network error. Please try again.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handlePaymentMethods = () => {
    showToastMsg("Payment methods management coming soon");
  };

  const handleOpenRentalDetail = (id) => {
    console.log("Open deposit detail:", id);
  };

  return (
    <>
      <section className="profile-mobile-account-section">
        {/* =====================================
          Section Label
         ===================================== */}

        <MobileSectionLabel title="SETTINGS" />

        {/* =====================================
          Settings List
         ===================================== */}

        <div className="profile-mobile-settings-list">
          {/* =================================
            Settings Rows
           ================================= */}

          <MobileSettingsRow
            icon={
              <User
                size={13}
                strokeWidth={1.5}
              />
            }
            label="Personal Details"
            subLabel={`${firstName} ${lastName}, ${email}`}
            onClick={
              handleEditProfile
            }
          />

          <MobileSettingsRow
            icon={
              <Lock
                size={13}
                strokeWidth={1.5}
              />
            }
            label="Security & Password"
            subLabel={isSendingReset ? "Sending reset link..." : "Send password reset link to email"}
            onClick={
              handleSecurity
            }
          />

          <MobileSettingsRow
            icon={
              <CreditCard
                size={13}
                strokeWidth={1.5}
              />
            }
            label="Payment Methods"
            subLabel="Saved cards, UPI, wallets"
            onClick={
              handlePaymentMethods
            }
          />

          {/* =================================
            Deposit Tracker
           ================================= */}

          <div className="profile-mobile-subsec">
            <div className="profile-mobile-subsec-label">
              Deposit Tracker
            </div>

            {/* Row 1 */}

            <button
              type="button"
              className="profile-mobile-deposit-row"
              onClick={() =>
                handleOpenRentalDetail(
                  "lehenga"
                )
              }
            >
              <div className="profile-mobile-set-icon">
                <Wallet
                  size={13}
                  strokeWidth={1.5}
                />
              </div>

              <div className="profile-mobile-deposit-text">
                <div className="profile-mobile-deposit-name">
                  Ivory Tissue
                  Lehenga
                </div>

                <span className="profile-mobile-dpill-p">
                  ₹15,000 pending
                </span>
              </div>
            </button>

            {/* Row 2 */}

            <button
              type="button"
              className="profile-mobile-deposit-row"
              onClick={() =>
                handleOpenRentalDetail(
                  "anarkali"
                )
              }
            >
              <div className="profile-mobile-set-icon">
                <Wallet
                  size={13}
                  strokeWidth={1.5}
                />
              </div>

              <div className="profile-mobile-deposit-text">
                <div className="profile-mobile-deposit-name">
                  Blush Anarkali
                  Set
                </div>

                <span className="profile-mobile-dpill-r">
                  Refunded
                </span>
              </div>
            </button>
          </div>

          {/* =================================
            Notifications
           ================================= */}

          <div className="profile-mobile-subsec">
            <div className="profile-mobile-subsec-label">
              Notifications
            </div>

            {/* WhatsApp */}

            <div className="profile-mobile-noti-row">
              <div className="profile-mobile-set-icon">
                <MessageCircle
                  size={13}
                  strokeWidth={1.5}
                />
              </div>

              <div className="profile-mobile-noti-text">
                <div className="profile-mobile-noti-title">
                  WhatsApp Updates
                </div>

                <div className="profile-mobile-noti-sub">
                  Bookings,
                  dispatch,
                  returns
                </div>
              </div>

              <MobileToggle
                isOn={whatsAppOn}
                onToggle={handleToggleWhatsApp}
              />
            </div>

            {/* Email */}

            <div className="profile-mobile-noti-row">
              <div className="profile-mobile-set-icon">
                <Mail
                  size={13}
                  strokeWidth={1.5}
                />
              </div>

              <div className="profile-mobile-noti-text">
                <div className="profile-mobile-noti-title">
                  Email
                  Notifications
                </div>

                <div className="profile-mobile-noti-sub">
                  Orders,
                  rentals,
                  payouts
                </div>
              </div>

              <MobileToggle
                isOn={emailOn}
                onToggle={handleToggleEmail}
              />
            </div>

            {/* Offers */}

            <div className="profile-mobile-noti-row">
              <div className="profile-mobile-set-icon">
                <Bell
                  size={13}
                  strokeWidth={1.5}
                />
              </div>

              <div className="profile-mobile-noti-text">
                <div className="profile-mobile-noti-title">
                  New Arrivals &
                  Offers
                </div>

                <div className="profile-mobile-noti-sub">
                  Curated picks,
                  occasions
                </div>
              </div>

              <MobileToggle
                isOn={offersOn}
                onToggle={handleToggleOffers}
              />
            </div>
          </div>
        </div>
      </section>

      <MobileEditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() =>
          setIsEditProfileOpen(false)
        }
        onSave={handleSaveProfile}
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

export default MobileAccountSettingsSection;