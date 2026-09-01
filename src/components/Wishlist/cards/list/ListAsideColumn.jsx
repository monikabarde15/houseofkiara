import ListCardActions from "./ListCardActions";
import "../../../../styles/wishlist/cards/list/list-aside-column.css"

const ListAsideColumn = ({ product, type, onOpenModal }) => {
  const getConditionClass = () => {
    if (product.condition === "Pristine condition") return "desk-wishlist-list-condition-pristine";
    if (product.condition === "Excellent condition") return "desk-wishlist-list-condition-excellent";
    return "desk-wishlist-list-condition-good";
  };

  const isUnavailable = product.unavailable;

  return (
    <div className="desk-wishlist-list-aside-column">
      <div className="desk-wishlist-list-aside-top">
        {type === "preloved" && product.condition && (
          <div className={`desk-wishlist-list-aside-condition ${getConditionClass()}`}>
            {product.condition}
          </div>
        )}

        <div className="desk-wishlist-list-price-label">
          {type === "rent" ? "Rental price" : type === "preloved" ? "Preloved price" : "Price"}
        </div>

        <div className="desk-wishlist-list-price">₹{product.price}</div>

        {type === "rent" && !isUnavailable && (
          <div className="desk-wishlist-list-price-note">
            <span>for {product.duration}</span>
            <span className="desk-wishlist-list-price-note-label">retail</span>
            <span className="desk-wishlist-list-struck-price">₹{product.originalPrice}</span>
          </div>
        )}

        {type === "rent" && isUnavailable && (
          <div className="desk-wishlist-list-unavailability-note">
            {product.unavailableNote}
          </div>
        )}

        {type === "preloved" && (
          <div className="desk-wishlist-list-price-note">
            <span className="desk-wishlist-list-price-note-label">retail</span>
            <span className="desk-wishlist-list-struck-price">₹{product.originalPrice}</span>
            <span className="desk-wishlist-list-save-badge">Save {product.savePercentage}%</span>
          </div>
        )}

        {type === "new" && (
          <div className="desk-wishlist-list-new-note">New with tags</div>
        )}
      </div>
      <ListCardActions
        product={product}
        type={type}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};

export default ListAsideColumn;