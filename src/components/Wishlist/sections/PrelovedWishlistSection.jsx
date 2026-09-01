import WishlistSectionHeader from "../layout/WishlistSectionHeader";
import WishlistGrid from "./WishlistGrid";
import "../../../styles/wishlist/sections/preloved-wishlist-section.css";

const PrelovedWishlistSection = ({ viewMode, showGeneralToastMessage, onRemoveCard, onOpenModal, pieceCount, products }) => {
  const dotColor = "#C9A96E";
  const modeLabel = "BUY PRELOVED";

  return (
    <div className="desk-wishlist-preloved-section">
      <WishlistSectionHeader 
        mode={modeLabel}
        pieceCount={pieceCount}
        dotColor={dotColor}
      />
      <WishlistGrid 
        viewMode={viewMode} 
        type="preloved"
        products={products}
        onRemoveCard={onRemoveCard}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};

export default PrelovedWishlistSection;