// src/components/Wishlist/modal/SizeSelector.jsx
// Section 11.4: Modal Body - Size Selector

import "../../../styles/wishlist/modal/size-selector.css";

const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  const defaultSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const sizeList = sizes && sizes.length > 0 ? sizes : defaultSizes;

  return (
    <div className="desk-wishlist-size-selector">
      <label className="desk-wishlist-size-label">Select Size</label>
      <div className="desk-wishlist-size-options">
        {sizeList.map((size) => (
          <button
            key={size}
            type="button"
            className={`desk-wishlist-size-pill ${selectedSize === size ? 'desk-wishlist-size-selected' : ''}`}
            onClick={() => onSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;