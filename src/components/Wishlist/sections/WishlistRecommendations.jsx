import RecommendationCard from "../cards/RecommendationCard";
import "../../../styles/wishlist/sections/wishlist-recommendations.css";

const WishlistRecommendations = ({
  onShowToast,
}) => {
  const recommendations = [
    {
      id: 1,
      type: "rent",
      designer: "SABYASACHI",
      name: "Gold Tissue Banarasi Saree",
      price: "12,500",
    },
    {
      id: 2,
      type: "preloved",
      designer: "RITU KUMAR",
      name: "Navy Chanderi Floral Anarkali",
      price: "18,500",
    },
    {
      id: 3,
      type: "new",
      designer: "TORANI",
      name: "Emerald Gulbagh Embroidered Kurta Set",
      price: "28,500",
    },
    {
      id: 4,
      type: "rent",
      designer: "MANISH MALHOTRA",
      name: "Sequin Embellished Sharara",
      price: "8,900",
    },
  ];

  const handleSaveToWishlist = (product) => {
    console.log("Wishlist Saved", product);
  };

  const handleExploreMore = () => {
    console.log("Explore More");
  };

  return (
    <section className="desk-wishlist-recommendations">
      <div className="desk-wishlist-rec-header">
        <div className="desk-wishlist-rec-header-left">
          <div className="desk-wishlist-rec-eyebrow">
            Because you saved these
          </div>

          <h2 className="desk-wishlist-rec-title">
            You may also{" "}
            <span className="desk-wishlist-rec-title-italic">
              love
            </span>
          </h2>
        </div>

        <button
          className="desk-wishlist-rec-explore-link"
          onClick={handleExploreMore}
        >
          Explore More →
        </button>
      </div>

      <div className="desk-wishlist-rec-grid">
        {recommendations.map((product) => (
          <RecommendationCard
            key={product.id}
            product={product}
            type={product.type}
            onSaveToWishlist={
              handleSaveToWishlist
            }
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </section>
  );
};

export default WishlistRecommendations;