import React, { useState } from 'react';
import WishlistCard from '../cards/WishlistCard';
import AttributeSelectorModal from '../forms/AttributeSelectorModal';
import Toast from '../ui/Toast';
import "../../../styles/Profile/sections/SavedPiecesSection.css";

import { useWishlistProducts } from '../../Wishlist/hooks/useWishlistProducts';

const SavedPiecesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { products, removeProduct } = useWishlistProducts();
  const savedPieces = products || [];

  // Overview shows only first 3 pieces
  const overviewPieces = savedPieces.slice(0, 3);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleAddToBag = (piece) => {
    // Check if modal is needed or direct add
    const needsSize = piece.sizes && piece.sizes.length > 1;
    const needsColor = piece.colors && piece.colors.length > 1;
    const isRental = piece.mode === 'Rental';
    
    const needsModal = needsSize || needsColor || isRental;
    
    if (needsModal) {
      setSelectedPiece(piece);
      setIsModalOpen(true);
    } else {
      // Direct add - only one size, no colors, not rental
      showToastMessage(`${piece.name} added to your bag`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleConfirmAddToBag = (selections) => {
    let message = selectedPiece.name;
    if (selections.size) message += ` · Size ${selections.size}`;
    if (selections.color) message += ` · ${selections.color}`;
    if (selections.startDate && selections.endDate) message += ` · ${selections.startDate} - ${selections.endDate}`;
    message += ` added to your bag`;
    
    showToastMessage(message);
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleRemoveItem = (id) => {
    removeProduct(id);
    showToastMessage("Item removed from your saved pieces");
  };

  const handleViewProduct = (id) => {
    console.log("View product detail page:", id);
    // Navigation to PDP would happen here
  };

  return (
    <>
      <div className="profile-saved-pieces-section" id="wishlist">
        <div className="profile-wl-grid">
          {overviewPieces.map((piece) => (
            <WishlistCard
              key={piece.id}
              piece={piece}
              onAddToBag={handleAddToBag}
              onViewProduct={handleViewProduct}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
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