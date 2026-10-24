import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToProductDetail } from '../../../../utils/productNavigation';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileWishlistCard from '../rows/MobileWishlistCard';
import MobileAttributeSelectorSheet from '../modals/MobileAttributeSelectorSheet';
import useCartStore from '../../../../store/cartStore';
import "../../../../styles/Profile/mobile/sections/MobileSavedPiecesSection.css";

const MobileSavedPiecesSection = ({ savedPieces, onViewAll, onUpdate }) => {
  const navigate = useNavigate();
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const piecesList = Array.isArray(savedPieces) ? savedPieces : [];

  const handleAddToBag = (piece) => {
    const needsSize = Array.isArray(piece.sizes) && piece.sizes.length > 1;
    const needsColor = Array.isArray(piece.colors) && piece.colors.length > 1;
    const isRental = String(piece.mode || '').toLowerCase() === 'rental';

    if (needsSize || needsColor || isRental) {
      setSelectedPiece(piece);
      setIsAttrModalOpen(true);
    } else {
      const rawProd = piece.originalData || piece.rawProduct || piece;
      const chosenSize = Array.isArray(piece.sizes) && piece.sizes.length > 0
        ? (typeof piece.sizes[0] === 'object' ? piece.sizes[0].name || piece.sizes[0].size : piece.sizes[0])
        : "Free Size";
      const chosenColor = Array.isArray(piece.colors) && piece.colors.length > 0 ? piece.colors[0] : "";
      const numPrice = Number(piece.price || 0);

      useCartStore.getState().addToCart(rawProd, {
        type: String(piece.mode || "buy").toLowerCase(),
        size: chosenSize,
        color: chosenColor,
        price: numPrice,
        quantity: 1,
        image: piece.image || rawProd.image || (Array.isArray(rawProd.images) && rawProd.images[0]) || "",
      });
    }
  };

  const handleViewProduct = (pieceId, pieceObj) => {
    const target = pieceObj || piecesList.find(p => (p.id === pieceId || p._id === pieceId || p.sku === pieceId)) || pieceId;
    navigateToProductDetail(navigate, target);
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
    const rawProd = selectedPiece?.originalData || selectedPiece?.rawProduct || selectedPiece;
    const numPrice = Number(selectedPiece?.price || 0);
    const chosenSize = selections.size || (Array.isArray(selectedPiece?.sizes) && selectedPiece.sizes[0]) || "Free Size";
    const chosenColor = selections.color || "";

    useCartStore.getState().addToCart(rawProd, {
      type: String(selectedPiece?.mode || "buy").toLowerCase(),
      size: chosenSize,
      color: chosenColor,
      deliveryDate: selections.startDate || null,
      returnDate: selections.endDate || null,
      price: numPrice,
      quantity: 1,
      image: selectedPiece?.image || rawProd?.image || (Array.isArray(rawProd?.images) && rawProd.images[0]) || "",
    });

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
          linkText={piecesList.length > 0 ? "View all" : ""}
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