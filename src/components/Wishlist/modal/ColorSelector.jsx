// src/components/Wishlist/modal/ColorSelector.jsx
// Section 11.4: Modal Body - Color Selector

import "../../../styles/wishlist/modal/color-selector.css";

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="desk-wishlist-color-selector">
      <label className="desk-wishlist-color-label">Select Colour</label>
      <div className="desk-wishlist-color-options">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`desk-wishlist-color-swatch ${selectedColor === color.value ? 'desk-wishlist-color-selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
            aria-label={color.label}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;