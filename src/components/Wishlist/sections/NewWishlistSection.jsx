import WishlistSectionHeader from "../layout/WishlistSectionHeader";
import WishlistGrid from "./WishlistGrid";
import "../../../styles/wishlist/sections/new-wishlist-section.css";

const NewWishlistSection = ({ viewMode, showGeneralToastMessage, onRemoveCard, onOpenModal, pieceCount, products }) => {
  const dotColor = "#6B7E5A";
  const modeLabel = "BUY NEW";

  return (
    <div className="desk-wishlist-new-section">
      <WishlistSectionHeader 
        mode={modeLabel}
        pieceCount={pieceCount}
        dotColor={dotColor}
      />
      <WishlistGrid 
        viewMode={viewMode} 
        type="new"
        products={products}
        onRemoveCard={onRemoveCard}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};

export default NewWishlistSection;