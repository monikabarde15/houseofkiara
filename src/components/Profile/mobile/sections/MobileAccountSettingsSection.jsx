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

import "../../../../styles/Profile/mobile/sections/MobileAccountSettingsSection.css";

const MobileAccountSettingsSection = () => {
  const [whatsAppOn, setWhatsAppOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [offersOn, setOffersOn] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [profileData, setProfileData] =
    useState({
      firstName: "Priya",
      lastName: "Verma",
      email: "priya@example.com",
      mobile: "+91 98765 43210",
      city: "Indore"
    });

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleSecurity = () => {
    console.log(
      "Open security settings"
    );
  };

  const handlePaymentMethods =
    () => {
      console.log(
        "Open payment methods"
      );
    };

  const handleOpenRentalDetail =
    (id) => {
      console.log(
        "Open deposit detail:",
        id
      );
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
            subLabel="Name, email, mobile"
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
            label="Security"
            subLabel="Password, login sessions"
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
                onToggle={
                  setWhatsAppOn
                }
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
                onToggle={
                  setEmailOn
                }
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
                onToggle={
                  setOffersOn
                }
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
        onSave={(updatedData) => {
          setProfileData(updatedData);

          setIsEditProfileOpen(false);
        }}
        profileData={profileData}
      />
    </>
  );
};

export default MobileAccountSettingsSection;