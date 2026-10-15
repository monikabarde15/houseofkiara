import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../../styles/Profile/mobile/rows/MobileSettingsRow.css";

const MobileSettingsRow = ({ icon, label, subLabel, onClick, isChevron = true }) => {
    return (
        <button
            type="button"
            className="profile-mobile-set-row"
            onClick={onClick}
        >
            {/* Icon Square */}
            <div className="profile-mobile-set-icon">
                {icon}
            </div>

            {/* Text Block */}
            <div className="profile-mobile-set-text">
                <div className="profile-mobile-set-label">{label}</div>
                {subLabel && <div className="profile-mobile-set-sub">{subLabel}</div>}
            </div>

            {/* Chevron */}
            {isChevron && (
                <ChevronRight size={14} strokeWidth={1.5} className="profile-mobile-set-chevron" />
            )}
        </button>
    );
};

export default MobileSettingsRow;