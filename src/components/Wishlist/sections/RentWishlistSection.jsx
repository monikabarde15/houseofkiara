import WishlistSectionHeader from "../layout/WishlistSectionHeader";
import AvailabilityNotice from "./AvailabilityNotice";
import WishlistGrid from "./WishlistGrid";
import "../../../styles/wishlist/sections/rent-wishlist-section.css";

const RentWishlistSection = ({ viewMode, showGeneralToastMessage, onRemoveCard, onOpenModal, pieceCount, products }) => {
  const dotColor = "#B85C38";
  const modeLabel = "RENT";

  return (
    <div className="desk-wishlist-rent-section">
      <WishlistSectionHeader 
        mode={modeLabel}
        pieceCount={pieceCount}
        dotColor={dotColor}
      />
      <AvailabilityNotice />
      <WishlistGrid 
        viewMode={viewMode} 
        type="rent"
        products={products}
        onRemoveCard={onRemoveCard}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};

export default RentWishlistSection;