
// src/components/Wishlist/sections/WishlistGrid.jsx

import WishlistGridCard from "../cards/WishlistGridCard";

import "../../../styles/wishlist/sections/wishlist-grid.css";
import WishlistListCard from "../cards/WishlistListCard";

const WishlistGrid = ({
  viewMode,
  type,
}) => {

  /* ====================================================== */
  /* COMPLETE MOCK DATA — STRICT SECTION 7 */
  /* ====================================================== */


const allProducts = [

  /* ====================================================== */
  /* RENT — 7 ITEMS */
  /* ====================================================== */

  { id: 1, type: "rent", designer: "SABYASACHI", name: "Crimson Zardozi Bridal Lehenga", price: "8,500", originalPrice: "1,85,000", savePercentage: "95%", duration: "for 4 days", savedDate: "2 days ago" },
  { id: 2, type: "rent", designer: "MANISH MALHOTRA", name: "Ivory Sequin Sharara Set", price: "5,200", originalPrice: "98,000", savePercentage: "94%", duration: "for 3 days", savedDate: "5 days ago" },
  { id: 3, type: "rent", designer: "TARUN TAHILIANI", name: "Rose Embroidered Anarkali Gown", price: "4,800", originalPrice: "82,000", savePercentage: "93%", duration: "4 Day Rental", unavailable: true, unavailableNote: "Unavailable for your selected dates", savedDate: "1 week ago" },
  { id: 4, type: "rent", designer: "ANITA DONGRE", name: "Sage & Gold Floral Lehenga", price: "6,400", originalPrice: "1,12,000", savePercentage: "94%", duration: "for 4 days", savedDate: "3 days ago" },
  { id: 5, type: "rent", designer: "RAHUL MISHRA", name: "Handwoven Silk Saree", price: "7,200", originalPrice: "1,46,000", savePercentage: "95%", duration: "for 5 days", savedDate: "Yesterday" },
  { id: 6, type: "rent", designer: "SUNEET VARMA", name: "Velvet Bandhini Jacket Set", price: "5,900", originalPrice: "96,000", savePercentage: "93%", duration: "for 3 days", savedDate: "4 days ago" },
  { id: 7, type: "rent", designer: "JJ VALAYA", name: "Embroidered Cape Set", price: "6,800", originalPrice: "1,28,000", savePercentage: "95%", duration: "for 4 days", savedDate: "Today" },

  /* ====================================================== */
  /* PRELOVED — 3 ITEMS */
  /* ====================================================== */

  { id: 8, type: "preloved", designer: "RITU KUMAR", name: "Pre-loved Banarasi Lehenga", condition: "Pristine condition", price: "32,000", originalPrice: "78,000", savePercentage: "59%", savedDate: "2 weeks ago" },
  { id: 9, type: "preloved", designer: "RAW MANGO", name: "Pre-loved Floral Anarkali", condition: "Excellent condition", price: "28,000", originalPrice: "62,000",stripTag: "Offer Pending", savePercentage: "55%", savedDate: "5 days ago" },
  { id: 10, type: "preloved", designer: "GLOBAL DESI", name: "Pre-loved Sharara Suit", condition: "Good condition", price: "25,000", originalPrice: "48,000", savePercentage: "48%", savedDate: "1 week ago" },

  /* ====================================================== */
  /* NEW — 1 ITEM */
  /* ====================================================== */
  { id: 11, type: "new", designer: "RAW MANGO", name: "New Arrival Lehenga", price: "1,20,000",stripTag: "New Arrival", savedDate: "Today" },

];



  /* ====================================================== */
  /* FILTER PRODUCTS */
  /* ====================================================== */

  const filteredProducts = allProducts.filter((product) => product.type === type);

  return (
  <div className={`desk-wishlist-grid-${viewMode}`}>
    {filteredProducts.map((product, index) => {
      if (viewMode === "grid") {
        return (
          <WishlistGridCard
            key={product.id}
            product={product}
            type={type}
            index={index}
          />
        );
      }
      return (
        <WishlistListCard
          key={product.id}
          product={product}
          type={type}
          index={index}
        />
      );
    })}
  </div>
);
};

export default WishlistGrid;
