import React, { useEffect, useState } from "react";
import "../styles/relatedproduct.css";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import useWishlistStore from "../store/wishlistStore";

export default function RelatedProduct({
  product,
  currentProductId,
  category,
}) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const prodId = String(product?._id || product?.id || currentProductId || "");
  const currentDesigner = product?.designer || "Designer";
  const currentCategory = product?.category || category || "Collection";

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        if (product?.relatedProducts && product.relatedProducts.length > 0) {
          setRelatedProducts(product.relatedProducts);
          setLoading(false);
        } else {
          const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
          const res = await fetch(`${backendUrl}/api/web-products`);
          const data = await res.json();
          if (data.success && data.data) {
            const allProducts = data.data;
            const filtered = allProducts.filter(
              (p) =>
                (p.category === currentCategory ||
                  p.designer === currentDesigner) &&
                p._id !== prodId &&
                p.id !== prodId,
            );
            setRelatedProducts(filtered);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching related products fallback", error);
        setLoading(false);
      }
    };
    fetchRelated();
  }, [product, currentCategory, currentDesigner, prodId]);

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  const displayList = relatedProducts.slice(0, 4);
  const secondaryList = relatedProducts.slice(4, 8);

  const getDetailLink = (item) => {
    const id = item._id || item.id || item.productId;

    let rent = item.rent;
    let preloved = item.preloved;
    let isNew = item.isNew;

    if (Array.isArray(item.listingModes)) {
      rent =
        rent ||
        item.listingModes.includes("RENTAL") ||
        item.listingModes.includes("RENT");
      preloved =
        preloved ||
        item.listingModes.includes("PRELOVED") ||
        item.listingModes.includes("RE-SELL");
      isNew =
        isNew ||
        item.listingModes.includes("BUY NEW") ||
        item.listingModes.includes("BUY");
    } else if (item.modes && typeof item.modes === "object") {
      rent = rent || item.modes.rent?.enabled;
      preloved = preloved || item.modes.preloved?.enabled;
      isNew = isNew || item.modes.buy?.enabled;
    }

    if (rent && preloved) return `/rentalandpreloved/${id}`;
    if (rent && isNew) return `/rentalandbuy/${id}`;
    if (rent) return `/onlyrental/${id}`;
    if (preloved) return `/preloved/${id}`;
    if (isNew) return `/buynew/${id}`;

    return `/onlyrental/${id}`;
  };

  const renderCard = (item) => {
    const id = item._id || item.id || item.productId;
    const isWishlisted = wishlistItems.includes(id);

    return (
      <div className="related-card" key={id}>
        <Link
          to={getDetailLink(item)}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="related-img">
            <div className="badge-wrap">
              {item.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className={`badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {badge}
                </span>
              ))}
            </div>

            <img
              src={
                Array.isArray(item.image)
                  ? item.image[0]
                  : item.image ||
                    item.images?.[0] ||
                    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60"
              }
              alt={item.name || item.title}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60";
              }}
            />

            <button
              className="wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(id);
              }}
              aria-label="Wishlist"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                style={{
                  fill: isWishlisted ? "#B85C38" : "none",
                  stroke: isWishlisted ? "#B85C38" : "#1A1612",
                }}
              />
            </button>
          </div>

          <div className="related-info">
            <p className="designer">{item.designer || "House of Kaira"}</p>
            <p className="name">{item.name || item.title}</p>
            {item.rent || (item.modes && item.modes.includes("RENTAL")) ? (
              <p className="price">
                ₹{item.rentPrice || item.rentalPrice || 0}
                <span className="rental"> / 4 days</span>
              </p>
            ) : (
              <p className="price">
                ₹{item.buyPrice || item.retailPrice || item.originalPrice || 0}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <section className="related" style={{ marginTop: "40px" }}>
      <div className="container">
        {/* PRIMARY SECTION */}
        <div className="block">
          <div className="header-rental">
            <div>
              <p className="eyebrow">SIMILAR PIECES</p>
              <h2 className="title">
                You May <span>Also Love</span>
              </h2>
            </div>

            <Link to="/products" className="view">
              VIEW ALL PIECES →
            </Link>
          </div>

          <div className="divider" />

          <div className="grid">{displayList.map(renderCard)}</div>
        </div>

        {/* SECONDARY SECTION (IF AVAILABLE) */}
        {secondaryList.length > 0 && (
          <div className="block" style={{ marginTop: "40px" }}>
            <div className="header-rental">
              <div>
                <p className="eyebrow">CURATED RECOMMENDATIONS</p>
                <h2 className="title">
                  More in <span>{currentCategory}</span>
                </h2>
              </div>

              <Link to="/products" className="view">
                EXPLORE COLLECTION →
              </Link>
            </div>

            <div className="divider" />

            <div className="grid">{secondaryList.map(renderCard)}</div>
          </div>
        )}
      </div>
    </section>
  );
}
