import { useState } from "react";
import GridModeStrip from "./GridModeStrip";
import GridUnavailabilityVeil from "./GridUnavailabilityVeil";
import "../../../../styles/wishlist/cards/grid/grid-image-area.css";

const GridImageArea = ({ product, type, onRemove, onOpenModal }) => {  // Remove onShowToast from props
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const getImageClass = () => {
    if (type === "rent") return "desk-wishlist-card-image-rent";
    if (type === "preloved") return "desk-wishlist-card-image-preloved";
    if (type === "new") return "desk-wishlist-card-image-new";
  };

  const getDesignerColor = () => {
    if (type === "rent") return "rgba(232,213,176,0.3)";
    if (type === "preloved") return "rgba(138,126,114,0.35)";
    if (type === "new") return "rgba(107,126,90,0.3)";
  };

  const getSvgStroke = () => {
    if (type === "rent" || type === "preloved") return "#C9A96E";
    if (type === "new") return "#6B7E5A";
  };

  const getSvgOpacity = () => {
    if (type === "rent") return "0.22";
    if (type === "preloved") return "0.16";
    if (type === "new") return "0.20";
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    // REMOVED: if (onShowToast) onShowToast();
    setTimeout(() => setIsHeartAnimating(false), 350);
    onRemove();  // Only this triggers the toast
  };

  const handleAddToBagClick = (e) => {
    e.stopPropagation();
    if (onOpenModal) onOpenModal(product, type);
  };

  const isUnavailable = product.unavailable;

  return (
    <div className="desk-wishlist-card-image-wrapper">
      <div className={`desk-wishlist-card-image ${getImageClass()}`}>
        <div className="desk-wishlist-card-image-inner">
          <svg className="desk-wishlist-garment-svg" width="48" height="64" viewBox="0 0 48 64" fill="none"
            stroke={getSvgStroke()} strokeOpacity={getSvgOpacity()}>
            <path d="M24 8C20 8 16 12 16 16V20C16 24 18 28 24 28C30 28 32 24 32 20V16C32 12 28 8 24 8Z" />
            <path d="M16 20L12 32C12 36 14 40 18 42L24 44L30 42C34 40 36 36 36 32L32 20" />
            <path d="M24 28V44" />
            <path d="M12 36H36" />
          </svg>
          <span className="desk-wishlist-card-image-designer" style={{ color: getDesignerColor() }}>
            {product.designer}
          </span>
        </div>

        <GridModeStrip type={type} product={product} />

        {isUnavailable && <GridUnavailabilityVeil />}

        <button className={`desk-wishlist-remove-heart-btn ${isHeartAnimating ? "desk-wishlist-heart-pop" : ""}`}
          onClick={handleRemoveClick}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M12 4.5C12 2.5 10.5 1 8.5 1C7.3 1 6.2 1.6 5.5 2.5C4.8 1.6 3.7 1 2.5 1C0.5 1 -1 2.5 -1 4.5C-1 7 5.5 13 5.5 13C5.5 13 12 7 12 4.5Z" fill="#B85C38" transform="translate(1,0.5)"/>
          </svg>
        </button>

        {!isUnavailable && (
          <div className="desk-wishlist-quick-add-bar">
            <button className="desk-wishlist-quick-add-btn" onClick={handleAddToBagClick}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4H10L9 10H3L2 4Z" />
                <path d="M4 4V3C4 2 4.5 1 6 1C7.5 1 8 2 8 3V4" />
              </svg>
              <span>ADD TO BAG</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridImageArea;