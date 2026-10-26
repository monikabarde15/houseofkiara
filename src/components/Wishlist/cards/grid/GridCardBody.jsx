import { useNavigate } from "react-router-dom";
import { navigateToProductDetail } from "../../../../utils/productNavigation";
import GridCardActions from "./GridCardActions";
import "../../../../styles/wishlist/cards/grid/grid-card-body.css";

const GridCardBody = ({ product, type, onRemove, onOpenModal }) => {
  const navigate = useNavigate();

  const getConditionClass = () => {
    if (product.condition === "Pristine condition") return "desk-wishlist-condition-pristine";
    if (product.condition === "Excellent condition") return "desk-wishlist-condition-excellent";
    return "desk-wishlist-condition-good";
  };

  return (
    <div className="desk-wishlist-card-body">
      <span className="desk-wishlist-card-designer-label">{product.designer}</span>
      <h3
        className="desk-wishlist-card-product-name"
        onClick={() => navigateToProductDetail(navigate, product)}
        style={{ cursor: "pointer" }}
      >
        {product.name}
      </h3>

      {type === "preloved" && (
        <div className={`desk-wishlist-condition-badge ${getConditionClass()}`}>
          {product.condition}
        </div>
      )}

      <div className="desk-wishlist-price-label">
        {type === "rent" ? "Rental price" : type === "preloved" ? "Preloved price" : "Price"}
      </div>
      <div className="desk-wishlist-price">₹{product.price}</div>

      {type === "rent" && !product.unavailable && (
        <div className="desk-wishlist-price-note">
          <span>for {product.duration}</span>
          {product.originalPrice && product.originalPrice !== "0" && product.savePercentage && (
            <>
              <span className="desk-wishlist-price-note-label">retail</span>
              <span className="desk-wishlist-struck-price">₹{product.originalPrice}</span>
              <span className="desk-wishlist-save-badge">Save {product.savePercentage}</span>
            </>
          )}
        </div>
      )}

      {type === "rent" && product.unavailable && (
        <div className="desk-wishlist-unavailability-note">{product.unavailableNote}</div>
      )}

      {type === "preloved" && (
        <div className="desk-wishlist-price-note">
          {product.originalPrice && product.originalPrice !== "0" && product.savePercentage ? (
            <>
              <span className="desk-wishlist-price-note-label">retail</span>
              <span className="desk-wishlist-struck-price">₹{product.originalPrice}</span>
              <span className="desk-wishlist-save-badge">Save {product.savePercentage}</span>
            </>
          ) : (
            <span className="desk-wishlist-price-note-label">Preloved luxury</span>
          )}
        </div>
      )}

      {type === "new" && (
        product.originalPrice && product.originalPrice !== "0" && product.savePercentage ? (
          <div className="desk-wishlist-price-note">
            <span className="desk-wishlist-price-note-label">retail</span>
            <span className="desk-wishlist-struck-price">₹{product.originalPrice}</span>
            <span className="desk-wishlist-save-badge">Save {product.savePercentage}</span>
          </div>
        ) : (
          <div className="desk-wishlist-new-note">New with tags</div>
        )
      )}

      <GridCardActions
        product={product}
        type={type}           
        onOpenModal={onOpenModal}
      />

      <div className="desk-wishlist-saved-date">Saved {product.savedDate}</div>

      <button className="desk-wishlist-remove-link" onClick={onRemove}>
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
  );
};

export default GridCardBody;