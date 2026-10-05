import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import WishlistCard from "../cards/WishlistCard";
import AttributeSelectorModal from "../forms/AttributeSelectorModal";
import Toast from "../ui/Toast";
import "../../../styles/Profile/right/ViewWishlist.css";
import { useWishlistProducts } from "../../Wishlist/hooks/useWishlistProducts";

const ViewWishlist = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { products, removeProduct } = useWishlistProducts();
  const savedPieces = products || [];

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleAddToBag = (piece) => {
    // Check if modal is needed or direct add
    const needsSize = piece.sizes && piece.sizes.length > 1;
    const needsColor = piece.colors && piece.colors.length > 1;
    const isRental = piece.mode === "Rental";

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
    if (selections.startDate && selections.endDate)
      message += ` · ${selections.startDate} - ${selections.endDate}`;
    message += ` added to your bag`;

    showToastMessage(message);
    setIsModalOpen(false);
    setSelectedPiece(null);
  };

  const handleViewProduct = (id) => {
    console.log("View product detail page:", id);
    // Navigation to PDP would happen here
  };

  const handleRemoveItem = (id) => {
    removeProduct(id);
    showToastMessage("Item removed from your saved pieces");
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
            {savedPieces.length} saved
          </div>
        </div>

        <div className="profile-fv-wishlist-grid">
          {savedPieces.map((piece) => (
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

export default ViewWishlist;
