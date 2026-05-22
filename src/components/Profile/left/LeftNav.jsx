// src\components\Profile\left\LeftNav.jsx
import React from 'react';
import { Clock, ShoppingBag, Heart, Tag, MapPin, FileText, Settings,HelpCircle } from 'lucide-react';
import "../../../styles/Profile/left/LeftNav.css";

const LeftNav = () => {
  const navItems = [
    { id: "rentals", icon: Clock, label: "My Rentals", subLabel: "4 bookings", rightElement: "dot" },
    { id: "purchases", icon: ShoppingBag, label: "My Purchases", subLabel: "2 orders", rightElement: "chevron" },
    { id: "wishlist", icon: Heart, label: "Saved Pieces", subLabel: "7 saved", rightElement: "badge", badgeValue: "7",  badgeClass: "lb-red" },
    { id: "listed", icon: Tag, label: "My Listed Pieces", subLabel: "2 active listings", rightElement: "badge", badgeValue: "2",  badgeClass: "lb-gold" },
    { id: "addresses", icon: MapPin, label: "Saved Addresses", subLabel: "2 addresses", rightElement: "chevron" },
    { id: "submissions", icon: FileText, label: "My Submissions", subLabel: "1 under review", rightElement: "badge", badgeValue: "1",  badgeClass: "lb-submission" },
    { id: "settings", icon: Settings, label: "Account Settings", subLabel: "Profile, security, notifications", rightElement: "chevron" },
    { id: "support", icon: HelpCircle, label: "Help & Support", subLabel: "FAQ, chat, contact", rightElement: "chevron" },
  ];

  return (
    <div className="profile-left-nav">
      {navItems.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="profile-left-nav-item">
          <div className="profile-left-nav-icon">
            <item.icon size={14} strokeWidth={1.5} />
          </div>
          <div className="profile-left-nav-content">
            <div className="profile-left-nav-label">{item.label}</div>
            <div className="profile-left-nav-sub-label">{item.subLabel}</div>
          </div>
          <div className="profile-left-nav-right">
            {item.rightElement === "dot" && <span className="profile-left-pulsing-dot"></span>}
            {item.rightElement === "chevron" && (
              <svg className="profile-left-chevron" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M4 2L8 5.5L4 9" stroke="#E8E0D4" strokeWidth="1.5" fill="none"/>
              </svg>
            )}
            {item.rightElement === "badge" && (
              <span className={`profile-left-badge ${item.badgeClass}`}>
                {item.badgeValue}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default LeftNav;