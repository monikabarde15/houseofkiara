import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToProductDetail } from '../../../../utils/productNavigation';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobileWishlistCard from '../rows/MobileWishlistCard';
import MobileAttributeSelectorSheet from '../modals/MobileAttributeSelectorSheet';
import useCartStore from '../../../../store/cartStore';
import "../../../../styles/Profile/mobile/fullviews/MobileSavedPiecesFullView.css";

const MobileSavedPiecesFullView = ({ savedPieces, onBack, onUpdate }) => {
  const navigate = useNavigate();
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const piecesList = Array.isArray(savedPieces) ? savedPieces : [];
  const countStr = `${piecesList.length} saved`;

  const allItems = [...piecesList];
  if (allItems.length > 0 && allItems.length % 2 !== 0) {
    allItems.push({ id: "phantom", isPhantom: true });
  }

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
                <MobileWishlistCard
                  key={piece.id}
                  piece={piece}
                  onAddToBag={handleAddToBag}
                  onViewProduct={handleViewProduct}
                  onRemove={handleRemove}
                />
              )
            ))}
          </div>
        )}
      </div>

      <MobileAttributeSelectorSheet
        isOpen={isAttrModalOpen}
        onClose={() => setIsAttrModalOpen(false)}
        piece={selectedPiece}
        onConfirm={handleConfirmAddToBag}
        onViewProduct={() => selectedPiece && handleViewProduct(selectedPiece.id, selectedPiece)}
      />
    </div>
  );
};

export default MobileSavedPiecesFullView;