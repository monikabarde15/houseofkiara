import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileWishlistCard from '../rows/MobileWishlistCard';
import MobileAttributeSelectorSheet from '../modals/MobileAttributeSelectorSheet';
import "../../../../styles/Profile/mobile/sections/MobileSavedPiecesSection.css";

const MobileSavedPiecesSection = ({ savedPieces, onViewAll, onUpdate }) => {
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const piecesList = Array.isArray(savedPieces) ? savedPieces : [];

  const handleAddToBag = (piece) => {
    setSelectedPiece(piece);
    setIsAttrModalOpen(true);
  };

  const handleViewProduct = (pieceId) => {
    window.location.href = `/product/${pieceId}`;
  };

  const handleRemove = async (pieceId) => {
    try {
      const { default: useWishlistStore } = await import('../../../../store/wishlistStore');
      await useWishlistStore.getState().toggleWishlist(pieceId);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmAddToBag = (selections) => {
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
          count={piecesList.length}
          linkText={piecesList.length > 4 ? "View all" : ""}
          onLinkClick={onViewAll}
        />

        {piecesList.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "10px 0" }}>
            <div className="profile-se-h">No saved pieces yet</div>
            <div className="profile-se-s">
              Tap the heart icon on any outfit to save it here.
            </div>
          </div>
        ) : (
          <div className="profile-mobile-item-block">
            <div className="profile-mobile-wl-grid">
              {piecesList.map((piece) => (
                <MobileWishlistCard
                  key={piece.id}
                  piece={piece}
                  onAddToBag={handleAddToBag}
                  onViewProduct={handleViewProduct}
                  onRemove={handleRemove}
                />
              ))}

              {piecesList.length % 2 !== 0 && (
                <div
                  className="profile-mobile-wl-phantom"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        )}
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