// src/components/Wishlist/modal/AddToBagModal.jsx

import { useState, useEffect } from "react";
import SizeSelector from "./SizeSelector";
import ColorSelector from "./ColorSelector";
import RentalDateSelector from "./RentalDateSelector";
import "../../../styles/wishlist/modal/add-to-bag-modal.css";

const AddToBagModal = ({ isOpen, onClose, product, type, onAddToBag, onShowToast }) => {
  // Early return if no product or modal not open
  if (!isOpen || !product) return null;

  // Form state
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [validationMessage, setValidationMessage] = useState("Please select all required options to continue");

  // Determine if color is required (product has multiple color options)
  const requiresColor = product?.colors && product.colors.length > 1;

  // Validate form
  const validateForm = () => {
    // Size is always required
    if (!selectedSize) {
      return { isValid: false, message: "Please select a size to continue" };
    }

    // Color required if product has multiple colour options
    if (requiresColor && !selectedColor) {
      return { isValid: false, message: "Please select a colour to continue" };
    }

    // For rental pieces: size + dates both required
    if (type === "rent") {
      if (!startDate || !endDate) {
        return { isValid: false, message: "Please select your rental dates to continue" };
      }
      if (new Date(endDate) <= new Date(startDate)) {
        return { isValid: false, message: "Return date must be after the start date" };
      }
    }

    return { isValid: true, message: "" };
  };

  const validation = validateForm();

  // Update validation message when form changes
  useEffect(() => {
    setValidationMessage(validation.message);
  }, [selectedSize, selectedColor, startDate, endDate, validation.message]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSize("");
      setSelectedColor("");
      setStartDate("");
      setEndDate("");
      setValidationMessage("Please select all required options to continue");
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle Add to Bag click
  const handleAddToBag = () => {
    if (!validation.isValid) return;

    // Build toast message
    let toastMessage = `${product.name} · ${selectedSize}`;
    if (selectedColor) {
      const color = product.colors?.find((c) => c.value === selectedColor);
      if (color) {
        toastMessage += ` · ${color.label}`;
      }
    }
    if (type === "rent") {
      toastMessage += ` · ${startDate} to ${endDate}`;
    }
    toastMessage += " added to your bag";

    // Call parent callbacks
    if (onAddToBag) {
      onAddToBag({
        product,
        size: selectedSize,
        color: selectedColor,
        startDate,
        endDate,
      });
    }

    if (onShowToast) {
      onShowToast(toastMessage);
    }

    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`desk-wishlist-modal-backdrop ${isOpen ? "desk-wishlist-modal-backdrop-open" : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`desk-wishlist-modal-container ${isOpen ? "desk-wishlist-modal-container-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Section 11.3: Modal Header */}
        <div className="desk-wishlist-modal-header">
          <h2 className="desk-wishlist-modal-title">Add to Bag</h2>
          <button type="button" className="desk-wishlist-modal-close-btn" onClick={onClose} aria-label="Close Modal">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Section 11.4: Modal Body */}
        <div className="desk-wishlist-modal-body">
          {/* Product Summary Row */}
          <div className="desk-wishlist-modal-summary-row">
            <div className={`desk-wishlist-modal-thumbnail desk-wishlist-modal-thumbnail-${type}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 5L10 3H14L16 5L18 7V21H6V7L8 5Z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="desk-wishlist-modal-summary-content">
              <h3 className="desk-wishlist-modal-product-name">{product.name}</h3>
              <div className="desk-wishlist-modal-meta-line">
                {type === "rent" && `Rental · ₹${product.price?.toLocaleString()} / ${product.duration}`}
                {type === "preloved" && `Preloved · ₹${product.price?.toLocaleString()}`}
                {type === "new" && `Buy New · ₹${product.price?.toLocaleString()}`}
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSizeChange={setSelectedSize} />

          {/* Color Selector - only if product has colors */}
          {product.colors && product.colors.length > 0 && (
            <ColorSelector colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} />
          )}

          {/* Rental Date Selector - only for rental items */}
          {type === "rent" && (
            <RentalDateSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          )}

          {/* Add to Bag Button */}
          <button
            type="button"
            disabled={!validation.isValid}
            onClick={handleAddToBag}
            className={`desk-wishlist-modal-add-btn ${!validation.isValid ? "desk-wishlist-modal-add-btn-disabled" : ""}`}
          >
            ADD TO BAG
          </button>

          {/* Validation Message - Below the button */}
          <div className="desk-wishlist-modal-validation">
            {!validation.isValid ? validationMessage : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToBagModal;