import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';
import "../../../styles/Profile/forms/AttributeSelectorModal.css";
import { ShoppingBag } from 'lucide-react';

const AttributeSelectorModal = ({ isOpen, onClose, piece, onConfirm }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validationMessage, setValidationMessage] = useState('');

    // Determine which selectors to show
    const needsSize = piece?.sizes && piece.sizes.length > 1;
    const needsColor = piece?.colors && piece.colors.length > 1;
    const isRental = piece?.mode === 'Rental';

    // Reset selections when modal opens
    useEffect(() => {
        if (isOpen && piece) {
            setSelectedSize('');
            setSelectedColor('');
            setStartDate('');
            setEndDate('');
            setValidationMessage('Please select all required options');
        }
    }, [isOpen, piece]);

    // Update validation message whenever selections change
    useEffect(() => {
        if (!piece || !isOpen) return;

        if (needsSize && !selectedSize) {
            setValidationMessage('Please select a size');
        } else if (needsColor && !selectedColor) {
            setValidationMessage('Please select a colour');
        } else if (isRental && (!startDate || !endDate)) {
            setValidationMessage('Please select rental dates');
        } else if (isRental && startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            setValidationMessage('Return date must be after the start date');
        } else {
            setValidationMessage('');
        }
    }, [selectedSize, selectedColor, startDate, endDate, piece, isOpen, needsSize, needsColor, isRental]);

    // Check if all required fields are complete
    const isComplete = () => {
        if (!piece) return false;

        if (needsSize && !selectedSize) return false;
        if (needsColor && !selectedColor) return false;
        if (isRental && (!startDate || !endDate)) return false;
        if (isRental && startDate && endDate && new Date(endDate) <= new Date(startDate)) return false;
        return true;
    };

    // Handle field changes
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleConfirm = () => {
        if (!isComplete()) return;

        const selections = {
            size: selectedSize,
            color: selectedColor,
            startDate: startDate,
            endDate: endDate
        };
        onConfirm(selections);
    };

    // If no piece, don't render anything
    if (!piece) return null;

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Options" maxWidth={480}>
            {/* Product Summary Row */}
            <div className="profile-attr-product-row">
                <div className="profile-attr-product-img">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="2" width="14" height="14" stroke="currentColor" strokeWidth="1" opacity="0.25" />
                    </svg>
                </div>
                <div>
                    <div className="profile-attr-product-name">{piece.name}</div>
                    <div className="profile-attr-product-meta">{piece.mode} · ₹{piece.price.toLocaleString()}</div>
                </div>
            </div>

            {/* Size Selector - shown when more than 1 size */}
            {needsSize && (
                <div className="profile-attr-section">
                    <div className="profile-attr-section-label">Select Size</div>
                    <div className="profile-attr-pills">
                        {piece.sizes.map((size) => (
                            <button
                                key={size}
                                className={`profile-attr-pill ${selectedSize === size ? 'selected' : ''} ${size.unavailable ? 'unavailable' : ''}`}
                                onClick={() => !size.unavailable && handleSizeSelect(size)}
                                disabled={size.unavailable}
                            >
                                {size.name || size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colour Selector - shown when more than 1 colour */}
            {needsColor && (
                <div className="profile-attr-section">
                    <div className="profile-attr-section-label">Select Colour</div>
                    <div className="profile-attr-swatches">
                        {piece.colors.map((color) => (
                            <button
                                key={color}
                                className={`profile-attr-swatch ${selectedColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => handleColorSelect(color)}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Rental Dates Selector - shown for rental mode */}
            {isRental && (
                <div className="profile-attr-section">
                    <div className="profile-attr-section-label">Select Rental Dates</div>
                    <div className="profile-attr-dates">
                        <div className="profile-attr-date-field">
                            <label className="profile-attr-date-label">From</label>
                            <input
                                type="date"
                                className="profile-attr-date-input"
                                value={startDate}
                                onChange={handleStartDateChange}
                                min={today}
                            />
                        </div>
                        <div className="profile-attr-date-field">
                            <label className="profile-attr-date-label">To</label>
                            <input
                                type="date"
                                className="profile-attr-date-input"
                                value={endDate}
                                onChange={handleEndDateChange}
                                min={startDate || today}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Message */}
            <div className="profile-attr-validation">{validationMessage}</div>

            {/* Add to Bag Button */}
            <button
                className={`profile-attr-add-btn ${isComplete() ? 'active' : ''}`}
                onClick={handleConfirm}
                disabled={!isComplete()}
            >
                <ShoppingBag size={14} strokeWidth={1.5} />
                Add to Bag
            </button>
        </Modal>
    );
};

export default AttributeSelectorModal;