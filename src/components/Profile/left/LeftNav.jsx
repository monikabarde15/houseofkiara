import React from 'react';
import { Clock, ShoppingBag, Heart, Tag, MapPin, FileText, Settings, HelpCircle } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import useWishlistStore from '../../../store/wishlistStore';
import "../../../styles/Profile/left/LeftNav.css";

const LeftNav = () => {
  const user = useAuthStore((state) => state.user);
  const wishlistItems = useWishlistStore((state) => state.items);
  
  const purchasesCount = user?.purchasesCount || 0;
  const rentalsCount = user?.rentalsCount || 0;
  const savedCount = wishlistItems?.length || 0;

  const orderCountText = purchasesCount === 1 ? "1 order" : `${purchasesCount} orders`;
  const rentalCountText = rentalsCount === 1 ? "1 booking" : `${rentalsCount} bookings`;
  const savedCountText = savedCount === 1 ? "1 saved" : `${savedCount} saved`;

  const navItems = [
    { id: "rentals", icon: Clock, label: "My Rentals", subLabel: rentalCountText, rightElement: rentalsCount > 0 ? "dot" : "none" },
    { id: "purchases", icon: ShoppingBag, label: "My Purchases", subLabel: orderCountText, rightElement: "chevron" },
    { id: "wishlist", icon: Heart, label: "Saved Pieces", subLabel: savedCountText, rightElement: "badge", badgeValue: savedCount.toString(), badgeClass: "lb-red" },
    { id: "listed", icon: Tag, label: "My Listed Pieces", subLabel: "0 active listings", rightElement: "none", badgeValue: "0", badgeClass: "lb-gold" },
    { id: "addresses", icon: MapPin, label: "Saved Addresses", subLabel: "0 addresses", rightElement: "chevron" },
    { id: "submissions", icon: FileText, label: "My Submissions", subLabel: "0 under review", rightElement: "none", badgeValue: "0", badgeClass: "lb-submission" },
    { id: "settings", icon: Settings, label: "Account Settings", subLabel: "Profile, security, notifications", rightElement: "chevron" },
    { id: "support", icon: HelpCircle, label: "Help & Support", subLabel: "FAQ, chat, contact", rightElement: "chevron" },
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const section = document.getElementById(targetId);
    const rightCol = document.getElementById('profile-right-column');
    if (section && rightCol) {
      const offset = section.offsetTop - rightCol.offsetTop - 20;
      rightCol.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="profile-left-nav">
      {navItems.map((item) => (
        <a 
          key={item.id} 
          href={`#${item.id}`} 
          className="profile-left-nav-item"
          onClick={(e) => handleNavClick(e, item.id)}
        >
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