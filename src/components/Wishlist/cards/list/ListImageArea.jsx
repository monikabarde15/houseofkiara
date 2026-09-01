import { useState } from "react";
import ListModeStrip from "./ListModeStrip";
import ListUnavailabilityVeil from "./ListUnavailabilityVeil";
import "../../../../styles/wishlist/cards/list/list-image-area.css";

const ListImageArea = ({ product, type, onRemove }) => {  // Remove onShowToast from props
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const getImageClass = () => {
    if (type === "rent") return "desk-wishlist-list-image-rent";
    if (type === "preloved") return "desk-wishlist-list-image-preloved";
    return "desk-wishlist-list-image-new";
  };

  const getDesignerColor = () => {
    if (type === "rent") return "rgba(232,213,176,0.3)";
    if (type === "preloved") return "rgba(138,126,114,0.35)";
    return "rgba(107,126,90,0.3)";
  };

  const getSvgStroke = () => {
    if (type === "new") return "#6B7E5A";
    return "#C9A96E";
  };

  const getSvgOpacity = () => {
    if (type === "rent") return "0.22";
    if (type === "preloved") return "0.16";
    return "0.20";
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    // REMOVED: if (onShowToast) onShowToast();
    setTimeout(() => setIsHeartAnimating(false), 350);
    onRemove();
  };

  const isUnavailable = product.unavailable;

  return (
    <div className="desk-wishlist-list-image-column">
      <div className="desk-wishlist-list-image-wrapper">
        <div className={`desk-wishlist-list-image ${getImageClass()}`}>
          <div className="desk-wishlist-list-image-inner">
            <svg className="desk-wishlist-list-garment-svg" width="48" height="64" viewBox="0 0 48 64"
              fill="none" stroke={getSvgStroke()} strokeOpacity={getSvgOpacity()}>
              <path d="M24 8C20 8 16 12 16 16V20C16 24 18 28 24 28C30 28 32 24 32 20V16C32 12 28 8 24 8Z" />
              <path d="M16 20L12 32C12 36 14 40 18 42L24 44L30 42C34 40 36 36 36 32L32 20" />
              <path d="M24 28V44" />
              <path d="M12 36H36" />
            </svg>
            <span className="desk-wishlist-list-image-designer" style={{ color: getDesignerColor() }}>
              {product.designer}
            </span>
          </div>

          <ListModeStrip type={type} product={product} />

          {isUnavailable && <ListUnavailabilityVeil />}

          <button className={`desk-wishlist-list-remove-heart-btn ${isHeartAnimating ? "desk-wishlist-list-heart-pop" : ""}`}
            onClick={handleRemoveClick}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M12 4.5C12 2.5 10.5 1 8.5 1C7.3 1 6.2 1.6 5.5 2.5C4.8 1.6 3.7 1 2.5 1C0.5 1 -1 2.5 -1 4.5C-1 7 5.5 13 5.5 13C5.5 13 12 7 12 4.5Z" fill="#B85C38" transform="translate(1,0.5)"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListImageArea;