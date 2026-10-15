import React, { useState } from 'react';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobileWishlistCard from '../rows/MobileWishlistCard';
import "../../../../styles/Profile/mobile/fullviews/MobileSavedPiecesFullView.css";

const MobileSavedPiecesFullView = ({ savedPieces, onBack, onUpdate }) => {
  const piecesList = Array.isArray(savedPieces) ? savedPieces : [];
  const countStr = `${piecesList.length} saved`;

  const allItems = [...piecesList];
  if (allItems.length > 0 && allItems.length % 2 !== 0) {
    allItems.push({ id: "phantom", isPhantom: true });
  }

  const handleRemove = async (pieceId) => {
    try {
      const { default: useWishlistStore } = await import('../../../../store/wishlistStore');
      await useWishlistStore.getState().toggleWishlist(pieceId);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-mobile-fv-container">
      <MobileFullViewBar title="Saved Pieces" count={countStr} onBack={onBack} />
      <div className="profile-mobile-fv-content">
        {piecesList.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "20px" }}>
            <div className="profile-se-h">No saved pieces yet</div>
            <div className="profile-se-s">
              Tap the heart icon on any outfit while browsing to curate your personal wishlist.
            </div>
          </div>
        ) : (
          <div className="profile-mobile-wl-grid">
            {allItems.map((piece) => (
              piece.isPhantom ? (
                <div key="phantom" className="profile-mobile-wl-phantom"></div>
              ) : (
                <MobileWishlistCard key={piece.id} piece={piece} onRemove={handleRemove} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSavedPiecesFullView;