import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationCard from "../cards/RecommendationCard";
import useWishlistStore from "../../../store/wishlistStore";
import "../../../styles/wishlist/sections/wishlist-recommendations.css";

const INITIAL_RECOMMENDATIONS = [
  {
    id: "rec-1",
    sku: "HOK-SAB-003",
    type: "rent",
    designer: "SABYASACHI",
    name: "Crimson Zardozi Bridal Lehenga",
    price: "8,500",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875344/houseofkaira/products/grid-1.jpg",
  },
  {
    id: "rec-2",
    sku: "HOK-MM-002",
    type: "preloved",
    designer: "NEHA TOMAR",
    name: "Charcoal Silk Bandhgala",
    price: "42,000",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875348/houseofkaira/products/grid-2.jpg",
  },
  {
    id: "rec-3",
    sku: "HOK-RK-001",
    type: "rent",
    designer: "NEHA TOMAR",
    name: "Champagne Tissue Sharara",
    price: "3,800",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875349/houseofkaira/products/grid-3.jpg",
  },
  {
    id: "rec-4",
    sku: "HOK-AD-002",
    type: "rent",
    designer: "NEHA TOMAR",
    name: "Blush Organza Gown",
    price: "5,000",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875350/houseofkaira/products/grid-4.jpg",
  },
];

const WishlistRecommendations = ({ onShowToast }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) return;
        const data = await response.json();
        const productList = Array.isArray(data)
          ? data
          : data?.data || data?.products || [];

        if (!isMounted || !productList.length) return;

        const currentWishlistIds = new Set(
          (wishlistItems || []).map((id) => String(id))
        );

        // Filter out items already in the user's wishlist
        const nonWishlisted = productList.filter((prod) => {
          const ids = [prod.sku, prod.productId, prod._id, prod.id]
            .filter(Boolean)
            .map(String);
          return !ids.some((id) => currentWishlistIds.has(id));
        });

        // Pick 4 items (fallback to any available if less than 4 non-wishlisted)
        const candidates =
          nonWishlisted.length >= 4
            ? nonWishlisted.slice(0, 4)
            : nonWishlisted.concat(
                productList.filter((p) => !nonWishlisted.includes(p))
              ).slice(0, 4);

        const formatted = candidates.map((prod) => {
          const rawModes = (prod.listingModes || []).map((m) =>
            String(m).toUpperCase()
          );
          let type = "rent";
          let price = prod.rentalPrice || 0;

          if (rawModes.some((m) => m.includes("RENT"))) {
            type = "rent";
            price = prod.rentalPrice || prod.listingPrice || 0;
          } else if (rawModes.some((m) => m.includes("PRELOVED"))) {
            type = "preloved";
            price = prod.listingPrice || 0;
          } else if (rawModes.some((m) => m.includes("NEW"))) {
            type = "new";
            price = prod.listingPrice || 0;
          }

          const primaryImage =
            (Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) ||
            prod.image ||
            "";

          return {
            id: prod.sku || prod._id || prod.id,
            sku: prod.sku,
            _id: prod._id,
            productId: prod.productId,
            type,
            designer: (prod.designer || "HOUSE OF KAIRA").toUpperCase(),
            name: prod.name,
            price: Number(price).toLocaleString("en-IN"),
            rawPrice: price,
            image: primaryImage,
            rawProduct: prod,
          };
        });

        if (formatted.length > 0) {
          setRecommendations(formatted);
        }
      } catch (err) {
        console.error("Error fetching wishlist recommendations:", err);
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [wishlistItems]);

  const handleSaveToWishlist = (product) => {
    const raw = product.rawProduct || product;
    const targetId = raw.sku || raw.productId || raw._id || raw.id || product.id;
    useWishlistStore.getState().toggleWishlist(targetId, raw);
  };

  const handleExploreMore = () => {
    navigate("/products");
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
            onSaveToWishlist={handleSaveToWishlist}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </section>
  );
};

export default WishlistRecommendations;