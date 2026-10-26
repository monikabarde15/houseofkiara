import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileRecommendationCard from "./MobileRecommendationCard";
import useWishlistStore from "../../../../store/wishlistStore";
import "../../../../styles/wishlist/mobile/sections/mobile-recommendations.css";

const INITIAL_MOBILE_RECOMMENDATIONS = [
  {
    id: "rec-1",
    sku: "HOK-SAB-003",
    name: "Crimson Zardozi Bridal Lehenga",
    designer: "SABYASACHI",
    mode: "rent",
    price: 8500,
    priceLabel: "From",
    rentalDuration: "4 days",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875344/houseofkaira/products/grid-1.jpg",
    imageBg: "#FAF7F2",
  },
  {
    id: "rec-2",
    sku: "HOK-MM-002",
    name: "Charcoal Silk Bandhgala",
    designer: "NEHA TOMAR",
    mode: "preloved",
    price: 42000,
    priceLabel: "Buy",
    rentalDuration: "4 days",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875348/houseofkaira/products/grid-2.jpg",
    imageBg: "#FAF7F2",
  },
  {
    id: "rec-3",
    sku: "HOK-RK-001",
    name: "Champagne Tissue Sharara",
    designer: "NEHA TOMAR",
    mode: "rent",
    price: 3800,
    priceLabel: "From",
    rentalDuration: "4 days",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875349/houseofkaira/products/grid-3.jpg",
    imageBg: "#FAF7F2",
  },
  {
    id: "rec-4",
    sku: "HOK-AD-002",
    name: "Blush Organza Gown",
    designer: "NEHA TOMAR",
    mode: "rent",
    price: 5000,
    priceLabel: "From",
    rentalDuration: "4 days",
    image: "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875350/houseofkaira/products/grid-4.jpg",
    imageBg: "#FAF7F2",
  },
];

const MobileRecommendations = ({ showToast }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(INITIAL_MOBILE_RECOMMENDATIONS);
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

        const nonWishlisted = productList.filter((prod) => {
          const ids = [prod.sku, prod.productId, prod._id, prod.id]
            .filter(Boolean)
            .map(String);
          return !ids.some((id) => currentWishlistIds.has(id));
        });

        const candidates =
          nonWishlisted.length >= 4
            ? nonWishlisted.slice(0, 4)
            : nonWishlisted
                .concat(productList.filter((p) => !nonWishlisted.includes(p)))
                .slice(0, 4);

        const formatted = candidates.map((prod) => {
          const rawModes = (prod.listingModes || []).map((m) =>
            String(m).toUpperCase()
          );
          let mode = "rent";
          let price = prod.rentalPrice || 0;
          let priceLabel = "From";

          if (rawModes.some((m) => m.includes("RENT"))) {
            mode = "rent";
            price = prod.rentalPrice || prod.listingPrice || 0;
            priceLabel = "From";
          } else if (rawModes.some((m) => m.includes("PRELOVED"))) {
            mode = "preloved";
            price = prod.listingPrice || 0;
            priceLabel = "Buy";
          } else if (rawModes.some((m) => m.includes("NEW"))) {
            mode = "new";
            price = prod.listingPrice || 0;
            priceLabel = "Buy";
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
            name: prod.name,
            designer: (prod.designer || "HOUSE OF KAIRA").toUpperCase(),
            mode,
            price,
            priceLabel,
            rentalDuration: "4 days",
            image: primaryImage,
            imageBg: "#FAF7F2",
            rawProduct: prod,
          };
        });

        if (formatted.length > 0) {
          setItems(formatted);
        }
      } catch (err) {
        console.error("Error fetching mobile recommendations:", err);
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [wishlistItems]);

  const handleExploreClick = () => {
    navigate("/products");
  };

  const handleAddToWishlist = (message) => {
    showToast?.(message);
  };

  const handleCardTap = (item) => {
    const raw = item.rawProduct || item;
    const modes = (raw.listingModes || []).map((m) => String(m).toUpperCase());
    const targetId = raw._id || raw.id || raw.sku || "1";

    if (
      modes.some((m) => m.includes("RENT")) &&
      modes.some((m) => m.includes("PRELOVED"))
    ) {
      navigate(`/rentalandpreloved/${targetId}`, { state: { product: raw } });
    } else if (
      modes.some((m) => m.includes("RENT")) &&
      modes.some((m) => m.includes("NEW"))
    ) {
      navigate(`/rentalandbuy/${targetId}`, { state: { product: raw } });
    } else if (modes.some((m) => m.includes("RENT"))) {
      navigate(`/onlyrental/${targetId}`, { state: { product: raw } });
    } else if (modes.some((m) => m.includes("PRELOVED"))) {
      navigate(`/preloved/${targetId}`, { state: { product: raw } });
    } else if (modes.some((m) => m.includes("NEW"))) {
      navigate(`/buynew/${targetId}`, { state: { product: raw } });
    } else {
      navigate(`/onlyrental/${targetId}`, { state: { product: raw } });
    }
  };

  return (
    <div className="wishlist-mobile-recommendations">
      <div className="wishlist-mobile-recommendations__header">
        <div className="wishlist-mobile-recommendations__header-left">
          <div className="wishlist-mobile-recommendations__eyebrow">
            BECAUSE YOU SAVED THESE
          </div>
          <h3 className="wishlist-mobile-recommendations__title">
            You may also{" "}
            <span className="wishlist-mobile-recommendations__title-italic">
              love
            </span>
          </h3>
        </div>
        <button
          className="wishlist-mobile-recommendations__explore"
          onClick={handleExploreClick}
        >
          EXPLORE MORE →
        </button>
      </div>

      <div className="wishlist-mobile-recommendations__scroll">
        <div className="wishlist-mobile-recommendations__cards">
          {items.map((item) => (
            <MobileRecommendationCard
              key={item.id}
              item={item}
              onAddToWishlist={handleAddToWishlist}
              onCardTap={handleCardTap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileRecommendations;