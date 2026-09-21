// src/components/Profile/left/IdentityCard.jsx
import React, { useState } from 'react';
import { SquarePen } from 'lucide-react';
import "../../../styles/Profile/left/IdentityCard.css";
import EditProfileModal from '../modals/EditProfileModal';
import Toast from '../ui/Toast';
import useAuthStore from '../../../store/authStore';

const IdentityCard = () => {
    const { user, updateProfile } = useAuthStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

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
                setToastMessage("Profile updated successfully");
            } else {
                setToastMessage(res.message || "Failed to update profile");
            }
        } catch (err) {
            setToastMessage("Failed to update profile");
        }
        setIsEditModalOpen(false);
        setShowToast(true);
    };

    // Dynamic user details
    const firstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Customer');
    const lastName = user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '');
    const fullName = user?.name || [firstName, lastName].filter(Boolean).join(' ') || 'Customer';
    const email = user?.email || 'customer@houseofkaira.com';
    const mobile = user?.phone || user?.mobile || '';
    const city = user?.location || user?.city || 'India';
    const memberSince = user?.joinedDate || '2025';

    // Compute Initials (e.g., "Priya Varma" -> "PV", "Priya" -> "P")
    const initials = (
        (firstName?.[0] || '') + (lastName?.[0] || (firstName?.[1] || ''))
    ).toUpperCase() || 'HK';

    const userData = {
        firstName,
        lastName,
        email,
        mobile,
        city
    };

    const rentalsCount = user?.ordersCount || 0;
    const purchasesCount = user?.purchasesCount || 0;
    const savedCount = user?.wishlist?.length || user?.wishlistCount || 0;

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
                    <div className="profile-avatar-initials">{initials}</div>
                </div>

                {/* Identity Text */}
                <div className="profile-identity-text">
                    <div className="profile-tier-label">Member</div>
                    <div className="profile-name">{fullName}</div>
                    <div className="profile-email">{email}</div>
                    <div className="profile-since-member">Member since {memberSince}</div>
                </div>

                {/* Stats Bar */}
                <div className="profile-stats-bar">
                    <div className="profile-stat">
                        <div className="profile-stat-number">{rentalsCount}</div>
                        <div className="profile-stat-label">RENTALS</div>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat">
                        <div className="profile-stat-number">{purchasesCount}</div>
                        <div className="profile-stat-label">PURCHASES</div>
                    </div>
                    <div className="profile-stat-divider"></div>
                    <div className="profile-stat">
                        <div className="profile-stat-number">{savedCount}</div>
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