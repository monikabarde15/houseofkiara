import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navigateToProductDetail } from '../../../utils/productNavigation';
import WishlistCard from '../cards/WishlistCard';
import AttributeSelectorModal from '../forms/AttributeSelectorModal';
import Toast from '../ui/Toast';
import useWishlistStore from '../../../store/wishlistStore';
import useCartStore from '../../../store/cartStore';
import "../../../styles/Profile/sections/SavedPiecesSection.css";

const SavedPiecesSection = ({ savedPieces, onUpdate }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const piecesList = Array.isArray(savedPieces) ? savedPieces : [];
  // Overview shows only first 3 pieces
  const overviewPieces = piecesList.slice(0, 3);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleAddToBag = (piece) => {
    const needsSize = piece.sizes && piece.sizes.length > 1;
    const needsColor = piece.colors && piece.colors.length > 1;
    const isRental = String(piece.mode || '').toLowerCase() === 'rental';
    
    const needsModal = needsSize || needsColor || isRental;
    
    if (needsModal) {
      setSelectedPiece(piece);
      setIsModalOpen(true);
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

      showToastMessage(`${piece.name} added to your bag`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPiece(null);
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

    let message = selectedPiece?.name || 'Piece';
    if (selections.size) message += ` · Size ${selections.size}`;
    if (selections.color) message += ` · ${selections.color}`;
    if (selections.startDate && selections.endDate) message += ` · ${selections.startDate} - ${selections.endDate}`;
    message += ` added to your bag`;
    
    showToastMessage(message);
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleViewProduct = (pieceId, pieceObj) => {
    const target = pieceObj || overviewPieces.find(p => (p.id === pieceId || p._id === pieceId || p.sku === pieceId)) || pieceId;
    navigateToProductDetail(navigate, target);
  };

  const handleRemove = async (pieceId, pieceObj) => {
    try {
      await useWishlistStore.getState().removeFromWishlist(pieceId, pieceObj);
      showToastMessage("Removed from saved pieces");
      if (onUpdate) onUpdate();
    } catch (err) {
      showToastMessage("Removed from wishlist");
    }
  };

  return (
    <>
      <div className="profile-saved-pieces-section" id="wishlist">
        {overviewPieces.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "8px 0 20px" }}>
            <div className="profile-se-h">No saved pieces yet</div>
            <div className="profile-se-s">
              Tap the heart icon on any outfit while browsing to curate your personal wishlist.
            </div>
            <Link to="/category" className="profile-se-btn" style={{ textDecoration: 'none' }}>
              Explore Pieces
            </Link>
          </div>
        ) : (
          <div className="profile-wl-grid">
            {overviewPieces.map((piece) => (
              <WishlistCard
                key={piece.id}
                piece={piece}
                onAddToBag={handleAddToBag}
                onViewProduct={handleViewProduct}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      <AttributeSelectorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        piece={selectedPiece}
        onConfirm={handleConfirmAddToBag}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default SavedPiecesSection;