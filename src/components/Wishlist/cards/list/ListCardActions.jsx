import "../../../../styles/wishlist/cards/list/list-card-actions.css";

const ListCardActions = ({ product, type, onOpenModal }) => {  // Add 'type' to props
  const handleAddToBagClick = (e) => {
    e.stopPropagation();
    if (onOpenModal) onOpenModal(product, type);  // Now 'type' is defined
  };

  const isUnavailable = product.unavailable;

  return (
    <div className="desk-wishlist-list-cta-container">
      <button
        className={`desk-wishlist-list-primary-cta ${isUnavailable ? "desk-wishlist-list-primary-cta-disabled" : ""}`}
        onClick={!isUnavailable ? handleAddToBagClick : undefined}
      >
        {isUnavailable ? "Notify Me" : "Add to Bag"}
      </button>
    </div>
  );
};

export default ListCardActions;