import { useNavigate } from "react-router-dom";
import { makeProductDetail } from "../../../ProductList";
import "../../../../styles/wishlist/cards/grid/grid-card-actions.css";

const GridCardActions = ({ product, type, onOpenModal }) => {
  const navigate = useNavigate();

  const handleAddToBagClick = (e) => {
    e.stopPropagation();
    if (onOpenModal) onOpenModal(product, type);
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    const item = product.originalData;
    if (!item) return;

    const productId = product.id;
    const productData = makeProductDetail(item);
    
    const { rent, preloved, isNew } = item;

    if (rent && preloved) {
        navigate(`/rentalandpreloved/${productId}`, { state: { product: productData } });
    }
    else if (rent && isNew) {
        navigate(`/rentalandbuy/${productId}`, { state: { product: productData } });
    }
    else if (rent) {
        navigate(`/onlyrental/${productId}`, { state: { product: productData } });
    }
    else if (preloved) {
        navigate(`/preloved/${productId}`, { state: { product: productData } });
    }
    else {
        navigate(`/buynew/${productId}`, { state: { product: productData } });
    }
  };

  return (
    <div className="desk-wishlist-card-cta-row">
      <button
        className={`desk-wishlist-primary-cta ${product.unavailable ? "desk-wishlist-primary-cta-disabled" : ""}`}
        onClick={!product.unavailable ? handleAddToBagClick : undefined}
      >
        {product.unavailable ? "Notify Me" : "Add to Bag"}
      </button>
      <button className="desk-wishlist-secondary-cta" onClick={handleViewProduct}>
        <svg width="13" height="13" viewBox="0 0 13 13">
          <path d="M1 6.5C1 6.5 3 2.5 6.5 2.5C10 2.5 12 6.5 12 6.5C12 6.5 10 10.5 6.5 10.5C3 10.5 1 6.5 1 6.5Z" />
          <circle cx="6.5" cy="6.5" r="1.5" />
        </svg>
      </button>
    </div>
  );
};

export default GridCardActions;