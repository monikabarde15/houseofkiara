import '../../../../styles/wishlist/mobile/sheets/mobile-size-selector.css';

const MobileSizeSelector = ({ sizes, selectedSize, onSizeSelect, isFreeSize }) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="wishlist-mobile-size-selector">
      {/* Section label: "SELECT SIZE" */}
      <div className="wishlist-mobile-size-selector__label">SELECT SIZE</div>
      
      {/* Pills layout: Flex row, flex-wrap, gap 8px */}
      <div className="wishlist-mobile-size-selector__pills">
        {sizes.map((size) => (
          <button
            key={size}
            className={`wishlist-mobile-size-selector__pill ${
              selectedSize === size ? 'wishlist-mobile-size-selector__pill--selected' : ''
            }`}
            onClick={() => onSizeSelect(size)}
            disabled={false}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSizeSelector;