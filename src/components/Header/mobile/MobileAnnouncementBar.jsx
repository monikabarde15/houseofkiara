// src/components/Header/mobile/MobileAnnouncementBar.jsx
import React from 'react';
import '../../../styles/Header/mobile/mobile-announcement-bar.css';

const announcementItems = [
  { text: "FREE SHIPPING ON ORDERS ABOVE ₹10,000", type: "plain" },
  { text: "—", type: "sep" },
  { text: "RENT FOR YOUR SPECIAL DAY", type: "italic" },
  { text: "—", type: "sep" },
  { text: "BUY PRELOVED LUXURY", type: "plain" },
  { text: "—", type: "sep" },
  { text: "NEW ARRIVALS WEEKLY", type: "italic" },
  { text: "—", type: "sep" },
  { text: "LIST YOUR PIECE FOR RENT", type: "plain" },
];

const MobileAnnouncementBar = () => {
  const duplicatedItems = [...announcementItems, ...announcementItems];

  return (
    <div className="mobile-announce-bar">
      <div className="mobile-announce-track">
        {duplicatedItems.map((item, index) => (
          <div key={index} className="mobile-announce-content">
            {item.type === "sep" ? (
              <span className="mobile-announce-sep"></span>
            ) : (
              <span
                className={
                  item.type === "italic"
                    ? "mobile-announce-item italic"
                    : "mobile-announce-item"
                }
              >
                {item.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileAnnouncementBar;