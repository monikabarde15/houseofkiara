// src\components\Profile\left\IdentityCard.jsx
import React from 'react';
import { SquarePen } from 'lucide-react';
import "../../../styles/Profile/left/IdentityCard.css";
import { useState } from 'react';
import EditProfileModal from '../modals/EditProfileModal';
import Toast from '../ui/Toast';

const IdentityCard = () => {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleSaveEditProfile = (data) => {
        console.log("Save profile data:", data);
        setIsEditModalOpen(false);
        setToastMessage("Profile updated successfully");
        setShowToast(true);
    };

    const userData = {
        firstName: "Priya",
        lastName: "Varma",
        email: "priya.varma@gmail.com",
        mobile: "+91 98765 43210",
        city: "Indore"
    };
    return (
        <div className="profile-identity-card">
            <div className="profile-identity-card-inner">
                {/* Avatar */}
                <div className="profile-avatar-container">
                    <svg className="profile-avatar-ring" width="58" height="58" viewBox="0 0 58 58">
                        <defs>
                            <linearGradient id="profile-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#C9A96E" />
                                <stop offset="100%" stopColor="#7A5B2A" />
                            </linearGradient>
                        </defs>
                        <circle cx="29" cy="29" r="27" fill="none" stroke="url(#profile-gold-gradient)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
                    </svg>
                    <div className="profile-avatar-initials">PV</div>
                </div>

                {/* Identity Text */}
                <div className="profile-identity-text">
                    <div className="profile-tier-label">Member</div>
                    <div className="profile-name">Priya Varma</div>
                    <div className="profile-email">priya.varma@gmail.com</div>
                    <div className="profile-since-member">Member since April 2025</div>
                </div>

                {/* Stats Bar */}
                <div className="profile-stats-bar">
                    <div className="profile-stat">
                        <div className="profile-stat-number">4</div>
                        <div className="profile-stat-label">RENTALS</div>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat">
                        <div className="profile-stat-number">2</div>
                        <div className="profile-stat-label">PURCHASES</div>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat">
                        <div className="profile-stat-number">7</div>
                        <div className="profile-stat-label">SAVED</div>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <button className="profile-edit-btn" onClick={handleEditProfile}>
                    <SquarePen size={10} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEditProfile}
                userData={userData}
            />

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default IdentityCard;