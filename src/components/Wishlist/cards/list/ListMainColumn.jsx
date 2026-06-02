import "../../../../styles/wishlist/cards/list/list-main-column.css"

const ListMainColumn = ({ product, type, onRemove }) => {
  const getConditionClass = () => {
    if (product.condition === "Pristine condition") return "desk-wishlist-list-condition-pristine";
    if (product.condition === "Excellent condition") return "desk-wishlist-list-condition-excellent";
    return "desk-wishlist-list-condition-good";
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className="desk-wishlist-list-main-column">
      <div>
        <span className="desk-wishlist-list-designer-label">{product.designer}</span>
        <h3 className="desk-wishlist-list-product-name">{product.name}</h3>

        {type === "preloved" && product.condition && (
          <div className={`desk-wishlist-list-condition-badge ${getConditionClass()}`}>
            {product.condition}
          </div>
        )}
      </div>

      <div className="desk-wishlist-list-bottom-meta">
        <div className="desk-wishlist-list-saved-date">Saved {product.savedDate}</div>
        <button className="desk-wishlist-list-remove-link" onClick={handleRemoveClick}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 2H9" />
            <path d="M3 2V1H7V2" />
            <path d="M2 2L2.5 9H7.5L8 2" />
            <path d="M4 4V7" />
            <path d="M6 4V7" />
          </svg>
          REMOVE
        </button>
      </div>
    </div>
  );
};

export default ListMainColumn;