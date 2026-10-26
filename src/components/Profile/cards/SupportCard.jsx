import React from 'react';
import "../../../styles/Profile/cards/SupportCard.css";

const SupportCard = ({ card, onClick }) => {
  const getIconClass = () => {
    switch(card.iconType) {
      case 'sage': return 'profile-support-shi-s';
      case 'gold': return 'profile-support-shi-g';
      case 'terracotta': return 'profile-support-shi-t';
      default: return 'profile-support-shi-s';
    }
  };

  return (
    <div className="profile-support-c" onClick={() => onClick(card)}>
      <div className={`profile-support-ic ${getIconClass()}`}>
        {card.icon}
      </div>
      <div className="profile-support-l">{card.title}</div>
      <div className="profile-support-s">{card.subtitle}</div>
    </div>
  );
};

export default SupportCard;