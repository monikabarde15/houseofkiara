import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WishlistCard from '../cards/WishlistCard';
import AttributeSelectorModal from '../forms/AttributeSelectorModal';
import Toast from '../ui/Toast';
import useWishlistStore from '../../../store/wishlistStore';
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
    const isRental = piece.mode === 'Rental';
    
    const needsModal = needsSize || needsColor || isRental;
    
    if (needsModal) {
      setSelectedPiece(piece);
      setIsModalOpen(true);
    } else {
      showToastMessage(`${piece.name} added to your bag`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleConfirmAddToBag = (selections) => {
    let message = selectedPiece?.name || 'Piece';
    if (selections.size) message += ` · Size ${selections.size}`;
    if (selections.color) message += ` · ${selections.color}`;
    if (selections.startDate && selections.endDate) message += ` · ${selections.startDate} - ${selections.endDate}`;
    message += ` added to your bag`;
    
    showToastMessage(message);
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleViewProduct = (pieceId) => {
    navigate(`/product/${pieceId}`);
  };

  const handleRemove = async (pieceId) => {
    try {
      await useWishlistStore.getState().toggleWishlist(pieceId);
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