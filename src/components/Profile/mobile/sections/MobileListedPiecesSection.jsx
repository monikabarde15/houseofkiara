import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileListedRow from '../rows/MobileListedRow';
import MobileListedDetailSheet from '../sheets/MobileListedDetailSheet';
import "../../../../styles/Profile/mobile/sections/MobileListedPiecesSection.css";

const MobileListedPiecesSection = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const listedPieces = [
    {
      id: "LST-001-2025",
      name: "Crimson Bridal Lehenga",
      mode: "Rental",
      listedSince: "Jan 2025",
      size: "L",
      pieceType: "Bridal Lehenga",
      designer: "Tarun Tahiliani",
      rentalPrice: 9500,
      totalEarned: 15200,
      timesRented: 4,
      nextPayout: 3800,
      imageGradient: "linear-gradient(160deg, #2C2018, #1A1210)"
    },
    {
      id: "LST-002-2025",
      name: "Blue Tissue Kanjivaram Saree",
      mode: "Resale",
      listedSince: "Apr 2025",
      size: "6-yard",
      pieceType: "Saree",
      designer: "Kanjivaram Weavers Co-op",
      resalePrice: 42000,
      totalEarned: 0,
      timesRented: null,
      nextPayout: null,
      imageGradient: "linear-gradient(160deg, #1E2530, #131820)"
    },
    {
      id: "LST-003-2025",
      name: "Ivory Silk Anarkali Set",
      mode: "Dual",
      listedSince: "Mar 2025",
      size: "M",
      pieceType: "Anarkali Set",
      designer: "Anita Dongre",
      rentalPrice: 5500,
      resalePrice: 28000,
      totalEarned: 2200,
      timesRented: 1,
      nextPayout: 2200,
      imageGradient: "linear-gradient(160deg, #2A3828, #1A2418)"
    }
  ];

  const handleRowClick = (id) => {
    const piece = listedPieces.find(p => p.id === id);
    setSelectedPiece(piece);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="profile-mobile-listed-section">
        <div className="profile-mobile-section-container">
          <MobileSectionLabel 
            title="MY LISTED PIECES"
            count={3}
            linkText="+ List another piece"
            onLinkClick={() => console.log("List another piece")}
          />
          
          {/* Earn Note Banner */}
          <div className="profile-mobile-earn-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" />
            </svg>
            <div className="profile-mobile-earn-note-text">
              Earnings attributed per completed booking. Payouts processed manually by the HOK team.
            </div>
          </div>

          <div className="profile-mobile-item-block">
            {listedPieces.map((piece) => (
              <MobileListedRow
                key={piece.id}
                piece={piece}
                onClick={handleRowClick}
              />
            ))}
          </div>
        </div>
      </div>

      <MobileListedDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        piece={selectedPiece}
      />
    </>
  );
};

export default MobileListedPiecesSection;