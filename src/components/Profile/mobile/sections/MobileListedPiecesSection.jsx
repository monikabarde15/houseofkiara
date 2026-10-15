import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileListedRow from '../rows/MobileListedRow';
import MobileListedDetailSheet from '../sheets/MobileListedDetailSheet';
import "../../../../styles/Profile/mobile/sections/MobileListedPiecesSection.css";

const MobileListedPiecesSection = ({ listedPieces }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const piecesList = Array.isArray(listedPieces) ? listedPieces : [];

  const handleRowClick = (id) => {
    const piece = piecesList.find(p => p.id === id);
    setSelectedPiece(piece);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="profile-mobile-listed-section">
        <div className="profile-mobile-section-container">
          <MobileSectionLabel 
            title="MY LISTED PIECES"
            count={piecesList.length}
            linkText="+ List another piece"
            onLinkClick={() => { window.location.href = "/list-your-piece/"; }}
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

          {piecesList.length === 0 ? (
            <div className="profile-sub-empty" style={{ margin: "10px 0" }}>
              <div className="profile-se-h">No listed pieces yet</div>
              <div className="profile-se-s">
                List your designer collection and start earning.
              </div>
            </div>
          ) : (
            <div className="profile-mobile-item-block">
              {piecesList.map((piece) => (
                <MobileListedRow
                  key={piece.id}
                  piece={piece}
                  onClick={handleRowClick}
                />
              ))}
            </div>
          )}
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