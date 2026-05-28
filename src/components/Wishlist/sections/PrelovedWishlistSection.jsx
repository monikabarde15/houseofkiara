import WishlistSectionHeader from "../layout/WishlistSectionHeader";
import WishlistGrid from "./WishlistGrid";
import "../../../styles/wishlist/sections/preloved-wishlist-section.css";

const PrelovedWishlistSection = ({ viewMode }) => {
  const pieceCount = 3;
  const dotColor = "#C9A96E";
  const modeLabel = "BUY PRELOVED";

  return (
    <div className="desk-wishlist-preloved-section">
      <WishlistSectionHeader 
        mode={modeLabel}
        pieceCount={pieceCount}
        dotColor={dotColor}
      />
      <WishlistGrid viewMode={viewMode} type="preloved" />
    </div>
  );
};

export default PrelovedWishlistSection;