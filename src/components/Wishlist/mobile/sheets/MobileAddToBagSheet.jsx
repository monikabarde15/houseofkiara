import { useState, useEffect } from 'react';
import MobileProductSummary from './MobileProductSummary';
import MobileSizeSelector from './MobileSizeSelector';
import MobileRentalDateSelector from './MobileRentalDateSelector';
import '../../../../styles/wishlist/mobile/sheets/mobile-add-to-bag-sheet.css';

const MobileAddToBagSheet = ({ item, mode, showToast, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationMessage, setValidationMessage] = useState('Please select all required options to continue');
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if product has Free Size
  const isFreeSize = item?.sizes?.length === 1 && item.sizes[0] === 'Free Size';
  
  // For Free Size products, auto-select the size
  useEffect(() => {
    if (isFreeSize && item?.sizes?.[0]) {
      setSelectedSize(item.sizes[0]);
    }
  }, [isFreeSize, item]);

  // Mark interaction when user starts selecting
  const handleSizeSelect = (size) => {
    setHasInteracted(true);
    setSelectedSize(size);
  };

  const handleStartDateChange = (date) => {
    setHasInteracted(true);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setHasInteracted(true);
    setEndDate(date);
  };

  // Validate form whenever selections change
  useEffect(() => {
    validateForm();
  }, [selectedSize, startDate, endDate, mode, isFreeSize]);

  const validateForm = () => {
    // If no interaction yet, show default message
    if (!hasInteracted) {
      setValidationMessage('Please select all required options to continue');
      setIsFormValid(false);
      return;
    }

    // Check size (skip if Free Size)
    if (!isFreeSize && !selectedSize) {
      setValidationMessage('Please select a size to continue');
      setIsFormValid(false);
      return;
    }

    // Check rental dates for rent mode
    if (mode === 'rent') {
      if (!startDate || !endDate) {
        setValidationMessage('Please select your rental dates to continue');
        setIsFormValid(false);
        return;
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        setValidationMessage('Return date must be after the start date');
        setIsFormValid(false);
        return;
      }
    }

    // All valid - message disappears
    setValidationMessage('');
    setIsFormValid(true);
  };

  const handleAddToBag = () => {
    if (!isFormValid) return;
    
    // Build toast message
    let toastMsg = `${item.name}`;
    if (!isFreeSize && selectedSize) {
      toastMsg += ` - Size ${selectedSize}`;
    }
    if (mode === 'rent' && startDate && endDate) {
      const formattedStart = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedEnd = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      toastMsg += ` - ${formattedStart} - ${formattedEnd}`;
    }
    toastMsg += ' added to your bag';
    
    showToast(toastMsg);
    onClose();
  };

  if (!item) return null;

  const showRentalDates = mode === 'rent';

  return (
    <div className="wishlist-mobile-add-to-bag-sheet">
      {/* Product Summary Row */}
      <MobileProductSummary item={item} mode={mode} />
      
      {/* Select Size Section */}
      <MobileSizeSelector 
        sizes={item.sizes}
        selectedSize={selectedSize}
        onSizeSelect={handleSizeSelect}
        isFreeSize={isFreeSize}
      />
      
      {/* Select Rental Dates Section (Rent items only) */}
      {showRentalDates && (
        <MobileRentalDateSelector 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      )}
      
      {/* Add to Bag Button */}
      <button 
        className={`wishlist-mobile-add-to-bag-sheet__button ${!isFormValid ? 'wishlist-mobile-add-to-bag-sheet__button--disabled' : ''}`}
        onClick={handleAddToBag}
        disabled={!isFormValid}
      >
        <svg className="wishlist-mobile-add-to-bag-sheet__icon" viewBox="0 0 14 14" fill="none">
          <path d="M2 3H12L11 11H3L2 3Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
          <path d="M4 3V2C4 1 4.5 0.5 6 0.5C7.5 0.5 8 1 8 2V3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        </svg>
        ADD TO BAG
      </button>
      
      {/* Validation Message */}
      <div className="wishlist-mobile-add-to-bag-sheet__validation">
        {validationMessage || '\u00A0'}
      </div>
    </div>
  );
};

export default MobileAddToBagSheet;