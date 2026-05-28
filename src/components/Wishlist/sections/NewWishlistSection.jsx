import WishlistSectionHeader from "../layout/WishlistSectionHeader";
import WishlistGrid from "./WishlistGrid";
import "../../../styles/wishlist/sections/new-wishlist-section.css";

const NewWishlistSection = ({ viewMode }) => {
  const pieceCount = 1;
  const dotColor = "#6B7E5A";
  const modeLabel = "BUY NEW";

  return (
    <div className="desk-wishlist-new-section">
      <WishlistSectionHeader 
        mode={modeLabel}
        pieceCount={pieceCount}
        dotColor={dotColor}
      />
      <WishlistGrid viewMode={viewMode} type="new" />
    </div>
  );
};

export default NewWishlistSection;