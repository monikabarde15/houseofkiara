import "../../../../styles/wishlist/cards/grid/grid-card-actions.css";

const GridCardActions = ({ product, type, onOpenModal }) => {  // Add 'type' to props
  const handleAddToBagClick = (e) => {
    e.stopPropagation();
    if (onOpenModal) onOpenModal(product, type);  // Now 'type' is defined
  };

  return (
    <div className="desk-wishlist-card-cta-row">
      <button
        className={`desk-wishlist-primary-cta ${product.unavailable ? "desk-wishlist-primary-cta-disabled" : ""}`}
        onClick={!product.unavailable ? handleAddToBagClick : undefined}
      >
        {product.unavailable ? "Notify Me" : "Add to Bag"}
      </button>
      <button className="desk-wishlist-secondary-cta">
        <svg width="13" height="13" viewBox="0 0 13 13">
          <path d="M1 6.5C1 6.5 3 2.5 6.5 2.5C10 2.5 12 6.5 12 6.5C12 6.5 10 10.5 6.5 10.5C3 10.5 1 6.5 1 6.5Z" />
          <circle cx="6.5" cy="6.5" r="1.5" />
        </svg>
      </button>
    </div>
  );
};

export default GridCardActions;