import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import WishlistCard from '../cards/WishlistCard';
import AttributeSelectorModal from '../forms/AttributeSelectorModal';
import Toast from '../ui/Toast';
import useWishlistStore from '../../../store/wishlistStore';
import "../../../styles/Profile/right/ViewWishlist.css";

const ViewWishlist = ({ savedPieces, onBack, onUpdate }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const piecesList = Array.isArray(savedPieces) ? savedPieces : [];

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
      showToastMessage("Removed from saved pieces");
    }
  };

  return (
    <>
      <div className="profile-fv-wishlist">
        <div className="profile-fv-wishlist-bar">
          <button className="profile-fv-wishlist-back" onClick={onBack}>
            <ChevronLeft size={14} strokeWidth={1.5} />
            Back to overview
          </button>
          <div className="profile-fv-wishlist-bar-title">Saved Pieces</div>
          <div className="profile-fv-wishlist-bar-count">
            {piecesList.length} item{piecesList.length === 1 ? '' : 's'}
          </div>
        </div>

        {piecesList.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "24px" }}>
            <div className="profile-se-h">No saved pieces yet</div>
            <div className="profile-se-s">
              Tap the heart icon on any outfit while browsing to curate your personal wishlist.
            </div>
          </div>
        ) : (
          <div className="profile-fv-wishlist-grid">
            {piecesList.map((piece) => (
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

export default ViewWishlist;