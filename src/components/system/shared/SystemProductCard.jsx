/**
 * House of Kaira: System Product Card (C6)
 * Section 4 C6 & Appendix B of System Pages Specification v1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import useWishlistStore from "../../../store/wishlistStore";
import toast from "react-hot-toast";
import "../../../styles/system/system-variables.css";
import "../../../styles/system/system-pieces.css";

export default function SystemProductCard({ piece }) {
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

  const productUrl =
    piece.mode === "preloved"
      ? `/preloved/${piece.id}`
      : `/onlyrental/${piece.id}`;

  return (
    <article className="sys-card" aria-label={`${piece.name} by ${piece.designer}`}>
      <Link to={productUrl} className="sys-card-image-wrap">
        <img
          src={piece.image}
          alt={piece.name}
          className="sys-card-image"
          loading="lazy"
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
        <Link to={productUrl} style={{ textDecoration: "none", color: "inherit" }}>
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
