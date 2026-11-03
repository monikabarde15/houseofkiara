/**
 * House of Kaira: System Product Card (C6)
 * Section 4 C6 & Appendix B of System Pages Specification v1.0
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useWishlistStore from "../../../store/wishlistStore";
import {
  getProductDetailRoute,
  navigateToProductDetail,
} from "../../../utils/productNavigation";
import toast from "react-hot-toast";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-pieces.css";

const FALLBACK_PIECE_IMAGE =
  "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792842137/submissions/image/file_h1auyp.jpg";

export default function SystemProductCard({ piece }) {
  const navigate = useNavigate();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();

  if (!piece) return null;

  const isSaved = wishlistItems.some((id) => String(id) === String(piece.id));

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(piece.id);
    if (!isSaved) {
      toast("Saved to your wishlist", { id: "sys-wishlist-toast", duration: 2500 });
    }
  };

  const productUrl = piece.rawProduct
    ? getProductDetailRoute(piece.rawProduct).path
    : piece.mode === "preloved"
    ? `/preloved/${piece.id}`
    : `/onlyrental/${piece.id}`;

  const handleCardNavigation = (e) => {
    if (piece.rawProduct) {
      e.preventDefault();
      navigateToProductDetail(navigate, piece.rawProduct);
    }
  };

  const resolvedImage =
    piece.image && !String(piece.image).includes("sub_1792844248")
      ? piece.image
      : FALLBACK_PIECE_IMAGE;

  return (
    <article className="sys-card" aria-label={`${piece.name} by ${piece.designer}`}>
      <Link to={productUrl} onClick={handleCardNavigation} className="sys-card-image-wrap">
        <img
          src={resolvedImage}
          alt={piece.name}
          className="sys-card-image"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_PIECE_IMAGE) {
              e.currentTarget.src = FALLBACK_PIECE_IMAGE;
            }
          }}
        />

        {/* Badge C6b, C6c */}
        <span className={`sys-card-badge ${piece.mode}`}>
          {piece.mode === "preloved" ? "Preloved" : "Rent"}
        </span>

        {/* Wishlist Button C6d, C6e */}
        <button
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="sys-card-wishlist-tap"
          onClick={handleHeartClick}
        >
          <div className={`sys-card-wishlist-circle ${isSaved ? "active" : ""}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        </button>
      </Link>

      <div className="sys-card-designer">{piece.designer}</div>

      <h3 className="sys-card-name">
        <Link to={productUrl} onClick={handleCardNavigation} style={{ textDecoration: "none", color: "inherit" }}>
          {piece.name}
        </Link>
      </h3>

      <div className="sys-card-price-row">
        <span className="sys-card-price">{piece.price}</span>
        {piece.mode === "rent" && piece.window && (
          <span className="sys-card-duration">{piece.window}</span>
        )}
      </div>
    </article>
  );
}
