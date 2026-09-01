import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import WishlistCard from '../cards/WishlistCard';
import AttributeSelectorModal from '../forms/AttributeSelectorModal';
import Toast from '../ui/Toast';
import "../../../styles/Profile/right/ViewWishlist.css";

const ViewWishlist = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // All 7 saved pieces from spec Page 47 with sizes and colors
  const savedPieces = [
    { id: 1, name: "Midnight Blue Lehenga", mode: "Rental", price: 6500, sizes: ["XS", "S", "M", "L", "XL"], colors: [] },
    { id: 2, name: "Crimson Benarasi Saree", mode: "Preloved", price: 22000, sizes: ["One size"], colors: ["Crimson", "Gold Border"] },
    { id: 3, name: "Pistachio Sharara", mode: "Rental", price: 4200, sizes: ["XS", "S", "M", "L"], colors: ["Pistachio", "Sage"] },
    { id: 4, name: "Gold Tissue Lehenga", mode: "Rental", price: 9800, sizes: ["S", "M", "L", "XL"], colors: [] },
    { id: 5, name: "Mulberry Silk Sharara", mode: "Rental", price: 5400, sizes: ["XS", "S", "M", "L"], colors: ["Mulberry", "Blush"] },
    { id: 6, name: "Navy Chanderi Kurta", mode: "Buy New", price: 28000, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Navy", "Steel"] },
    { id: 7, name: "Champagne Zardozi Lehenga", mode: "Rental", price: 15000, sizes: ["S", "M", "L"], colors: ["Champagne", "Ivory"] }
  ];

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

  const handleViewProduct = (pieceId) => {
    console.log("View product:", pieceId);
  };

  const handleRemove = (pieceId) => {
    console.log("Remove from saved:", pieceId);
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
          <div className="profile-fv-wishlist-bar-count">7 items</div>
        </div>

        <div className="profile-fv-wishlist-grid">
          {savedPieces.map((piece) => (
            <WishlistCard
              key={piece.id}
              piece={piece}
              onAddToBag={handleAddToBag}
              onViewProduct={handleViewProduct}
              onRemove={handleRemove}
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

export default ViewWishlist;