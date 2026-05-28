// src/components/Wishlist/sections/RentWishlistSection.jsx


import WishlistSectionHeader from "../layout/WishlistSectionHeader";
import AvailabilityNotice from "./AvailabilityNotice";
import WishlistGrid from "./WishlistGrid";
import "../../../styles/wishlist/sections/rent-wishlist-section.css";

const RentWishlistSection = ({ viewMode }) => {
  //  Replace with actual data from wishlist store
  const pieceCount = 7;
  const dotColor = "#B85C38";
  const modeLabel = "RENT";

  return (
    <div className="desk-wishlist-rent-section">
      {/*  Section Header Row */}
      <WishlistSectionHeader 
        mode={modeLabel}
        pieceCount={pieceCount}
        dotColor={dotColor}
      />
      
      {/*  Availability Notice - only for Rent section */}
      <AvailabilityNotice />
      
      {/*  Product Cards Grid */}
      <WishlistGrid viewMode={viewMode} type="rent" />
    </div>
  );
};

export default RentWishlistSection;