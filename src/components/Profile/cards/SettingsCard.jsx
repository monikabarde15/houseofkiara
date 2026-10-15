import React from 'react';
import { ChevronRight } from 'lucide-react';
import ToggleSwitch from '../ui/ToggleSwitch';
import "../../../styles/Profile/cards/SettingsCard.css";

const SettingsCard = ({ card }) => {
  const getIconClass = () => {
    switch(card.iconType) {
      case 'gold': return 'profile-account-shi-g';
      case 'charcoal': return 'profile-account-shi-k';
      case 'sage': return 'profile-account-shi-s';
      case 'terracotta': return 'profile-account-shi-t';
      default: return 'profile-account-shi-g';
    }
  };

  const handleRowClick = (row) => {
    if (row.onClick) {
      row.onClick();
    }
  };

  return (
    <div className="profile-account-set-card">
      {/* Card Header */}
      <div className="profile-account-set-head">
        <div className={`profile-account-shi ${getIconClass()}`}>
          {card.icon}
        </div>
        <div className="profile-account-sh-lbl">{card.title}</div>
      </div>

      {/* Setting Rows */}
      {card.rows.map((row, index) => (
        <div 
          key={index}
          className={`profile-account-sf ${row.isToggle ? 'profile-account-tog-row' : ''}`}
          onClick={() => !row.isToggle && handleRowClick(row)}
        >
          {row.isToggle ? (
            // Toggle Row
            <>
              <div className="profile-account-tog-content">
                <div className="profile-account-tog-l">{row.label}</div>
                {row.subLabel && <div className="profile-account-tog-s">{row.subLabel}</div>}
              </div>
              <ToggleSwitch isOn={row.value} onToggle={row.onToggle} />
            </>
          ) : (
            // Regular Row
            <>
              <div className="profile-account-sf-l">{row.label}</div>
              {row.value && (
                <div className={`profile-account-sf-v ${row.valueClass || ''}`}>
                  {row.value}
                </div>
              )}
              <div className="profile-account-sf-arr">
                <ChevronRight size={12} strokeWidth={1.5} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingsCard;