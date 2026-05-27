import React, { useState } from 'react';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobileWishlistCard from '../rows/MobileWishlistCard';
import "../../../../styles/Profile/mobile/fullviews/MobileSavedPiecesFullView.css";

const MobileSavedPiecesFullView = ({ onBack }) => {
  const [savedPieces] = useState([
    { id: 1, name: "Midnight Blue Lehenga", mode: "Rental", price: 6500, imageGradient: "linear-gradient(160deg, #1A1612, #2C2520)" },
    { id: 2, name: "Crimson Benarasi Saree", mode: "Preloved", price: 22000, imageGradient: "linear-gradient(160deg, #F5EDE5, #EAD8C8)" },
    { id: 3, name: "Pistachio Sharara", mode: "Rental", price: 4200, imageGradient: "linear-gradient(160deg, #EAF0E5, #D5E8C8)" },
    { id: 4, name: "Gold Tissue Lehenga", mode: "Rental", price: 9800, imageGradient: "linear-gradient(160deg, #F5EDD8, #E8D5B0)" },
    { id: 5, name: "Mulberry Silk Sharara", mode: "Rental", price: 5400, imageGradient: "linear-gradient(160deg, #F0E5F0, #E0C8E0)" },
    { id: 6, name: "Navy Chanderi Kurta", mode: "Buy New", price: 28000, imageGradient: "linear-gradient(160deg, #EEF1F7, #D0D8E8)" },
    { id: 7, name: "Champagne Zardozi Lehenga", mode: "Rental", price: 15000, imageGradient: "linear-gradient(160deg, #F5F0E8, #E8D8C8)" }
  ]);

  // Phantom 8th item for odd number grid
  const allItems = [...savedPieces];
  if (allItems.length % 2 !== 0) {
    allItems.push({ id: "phantom", isPhantom: true });
  }

  return (
    <div className="profile-mobile-fv-container">
      <MobileFullViewBar title="Saved Pieces" count="7 saved" onBack={onBack} />
      <div className="profile-mobile-fv-content">
        <div className="profile-mobile-wl-grid">
          {allItems.map((piece) => (
            piece.isPhantom ? (
              <div key="phantom" className="profile-mobile-wl-phantom"></div>
            ) : (
              <MobileWishlistCard key={piece.id} piece={piece} />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSavedPiecesFullView;