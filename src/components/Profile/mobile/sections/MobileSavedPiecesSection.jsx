import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileWishlistCard from '../rows/MobileWishlistCard';
import MobileAttributeSelectorSheet from '../modals/MobileAttributeSelectorSheet';
import "../../../../styles/Profile/mobile/sections/MobileSavedPiecesSection.css";

const MobileSavedPiecesSection = ({ onViewAll }) => {
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const [savedPieces] = useState([
    { id: 1, name: "Midnight Blue Lehenga", mode: "Rental", price: 6500, imageGradient: "linear-gradient(160deg, #1A1612, #2C2520)", sizes: ["XS", "S", "M", "L", "XL"], colors: [] },
    { id: 2, name: "Crimson Benarasi Saree", mode: "Preloved", price: 22000, imageGradient: "linear-gradient(160deg, #F5EDE5, #EAD8C8)", sizes: ["One size"], colors: ["Crimson", "Gold Border"] },
    { id: 3, name: "Pistachio Sharara", mode: "Rental", price: 4200, imageGradient: "linear-gradient(160deg, #EAF0E5, #D5E8C8)", sizes: ["XS", "S", "M", "L"], colors: ["Pistachio", "Sage"] },
    { id: 4, name: "Gold Tissue Lehenga", mode: "Rental", price: 9800, imageGradient: "linear-gradient(160deg, #F5EDD8, #E8D5B0)", sizes: ["S", "M", "L", "XL"], colors: [] }
  ]);

  const handleAddToBag = (piece) => {
    setSelectedPiece(piece);
    setIsAttrModalOpen(true);
  };

  const handleViewProduct = (pieceId) => {
    console.log("View product:", pieceId);
  };

  const handleRemove = (pieceId) => {
    console.log("Remove from saved:", pieceId);
  };

  const handleConfirmAddToBag = (selections) => {
    console.log("Added to bag:", selectedPiece, selections);
    setIsAttrModalOpen(false);
    setSelectedPiece(null);
  };

  const handleCloseModal = () => {
    setIsAttrModalOpen(false);
    setSelectedPiece(null);
  };

  return (
    <>
      <div className="profile-mobile-saved-section">
        <MobileSectionLabel
          title="SAVED PIECES"
          count={7}
          linkText="View all"
          onLinkClick={onViewAll}
        />

        <div className="profile-mobile-item-block">
          <div className="profile-mobile-wl-grid">

            {savedPieces.map((piece) => (
              <MobileWishlistCard
                key={piece.id}
                piece={piece}
                onAddToBag={handleAddToBag}
                onViewProduct={handleViewProduct}
                onRemove={handleRemove}
              />
            ))}

            {savedPieces.length % 2 !== 0 && (
              <div
                className="profile-mobile-wl-phantom"
                aria-hidden="true"
              />
            )}

          </div>
        </div>
      </div>

      {isAttrModalOpen && selectedPiece && (
        <MobileAttributeSelectorSheet
          isOpen={isAttrModalOpen}
          onClose={handleCloseModal}
          piece={selectedPiece}
          onConfirm={handleConfirmAddToBag}
        />
      )}
    </>
  );
};

export default MobileSavedPiecesSection;