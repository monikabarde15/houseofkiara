import React, { useState } from "react";
import { Heart, Search, ZoomIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useWishlistStore from "../store/wishlistStore";
import useAuthStore from "../store/authStore";
import "../styles/gallery-column.css";

const badgeConfig = {
  rent: {
    text: "For Rent",
    className: "gallery-badge rent",
  },
  buy: {
    text: "Buy New",
    className: "gallery-badge buy",
  },
  preloved: {
    text: "Preloved",
    className: "gallery-badge preloved",
  },
};

export default function GalleryColumn({
  images = [],
  variant = "rent",
  video = null,
  productId,
  product,
  wish,
  setWish,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const media = [
    ...images.map((img) => ({ type: "image", src: img })),
    ...(video ? [{ type: "video", src: video }] : []),
  ];

  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const targetId = String(productId || product?.sku || product?.productId || product?._id || product?.id || "");
  const prodSku = String(product?.sku || "");
  const prodDbId = String(product?._id || "");
  const prodPid = String(product?.productId || "");

  const isWishlisted = targetId
    ? wishlistItems.some((id) => {
        const sid = String(id);
        return (
          sid === targetId ||
          (prodSku && sid === prodSku) ||
          (prodDbId && sid === prodDbId) ||
          (prodPid && sid === prodPid)
        );
      })
    : false;

  const handleHeartClick = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!isAuthenticated) {
      toast.error("Please login to use your wishlist");
      navigate("/auth");
      return;
    }

    if (targetId) {
      const willBeActive = !isWishlisted;
      toggleWishlist(targetId, product);
      if (setWish) setWish(willBeActive);

      if (willBeActive) {
        toast.success("Added to your wishlist");
      } else {
        toast("Removed from your wishlist", {
          icon: "✕",
        });
      }
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = media.length > 0 ? media[activeIndex] : null;

  const badge = badgeConfig[variant];
  return (
    <div className="gallery-column">
      {/* THUMBNAILS Image + Video */}
      <div className="thumbs">
        {media.map((item, i) => (
          <div
            key={i}
            className={`thumb ${activeIndex === i ? "active" : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            {item.type === "video" ? (
              <div className="video-thumb">▶</div>
            ) : (
              <img src={item.src} alt="" />
            )}
          </div>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div
        className="main-img"
        onMouseMove={(e) => {
          if (!activeMedia || activeMedia.type !== "image") return;

          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          e.currentTarget.style.setProperty("--x", `${x}%`);
          e.currentTarget.style.setProperty("--y", `${y}%`);
        }}
      >
        {activeMedia ? (
          activeMedia.type === "video" ? (
            <video src={activeMedia.src} controls autoPlay muted playsInline />
          ) : (
            <img src={activeMedia.src} alt="" />
          )
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            No images available
          </div>
        )}

        {/* BADGE */}
        <div className={badge.className}>{badge.text}</div>

        {/* WISHLIST */}
        <button
          className={`gallery-wishlist-icon-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleHeartClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={isWishlisted ? "active" : ""}
            style={{
              fill: isWishlisted ? "#B85C38" : "none",
              stroke: isWishlisted ? "#B85C38" : "#1a1612",
              color: isWishlisted ? "#B85C38" : "#1a1612",
              transition: "all 0.2s ease",
            }}
          />
        </button>

        {/* ZOOM */}
        {activeMedia?.type === "image" && (
          <div className="zoom-hint">
            <ZoomIn className="zoom-hint-icon" />
            <span>Zoom</span>
          </div>
        )}
      </div>
    </div>
  );
}
