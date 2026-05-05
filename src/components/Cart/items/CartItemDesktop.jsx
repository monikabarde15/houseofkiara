import React, { useState } from "react";
import "../../../styles/cart/items/cart-item-desktop.css";

import RentalTimeline from "./modes/rental/RentalTimeline";
import RentalDepositNotice from "./modes/rental/RentalDepositNotice";
import RentalPriceBlock from "./modes/rental/RentalPriceBlock";

import PrelovedDisclosure from "./modes/preloved/PrelovedDisclosure";
import PrelovedPriceBlock from "./modes/preloved/PrelovedPriceBlock";
import PrelovedFinalNote from "./modes/preloved/PrelovedFinalNote";

import NewPriceBlock from "./modes/new/NewPriceBlock";

import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const CartItemDesktop = ({ item, onRemove }) => {
  const { product, booking, type } = item;
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  // ===== DATA =====
  const brand = product?.designer || "";
  const name = product?.title || "";
  const desc = product?.description || "";
  const condition = product?.condition?.grade || "";

  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
  };

  // ===== HANDLER =====
  const handleEditDates = () => {
    if (type !== "rental") return;

    navigate(`/onlyrental/${product.id}`, {
      state: {
        booking: {
          deliveryDate: booking?.deliveryDate,
          eventDate: booking?.eventDate,
          returnDate: booking?.returnDate,
          rentalWindowDays: booking?.rentalWindowDays,
        },
      },
    });
  };

  return (
    <div className="cart-item" data-item-id={type}>
      
      {/* LEFT — IMAGE */}
      <div className="cart-item__image">
        <div className="cart-item__thumb">
          <img
            src={product?.images?.[0] || "/placeholder.jpg"}
            alt={name || "Product"}
            className="cart-item__img"
          />
          <span className="cart-item__mode-tag">
            {type === "rental"
              ? "Rent"
              : type === "preloved"
              ? "Preloved"
              : "New"}
          </span>
        </div>
      </div>

      {/* RIGHT — CONTENT */}
      <div className="cart-item__content">

        {/* HEADER */}
        <div className="cart-item__header">
          <div className="cart-item__info">
            <div className="cart-item__brand">{brand}</div>
            <h3 className="cart-item__name">{name}</h3>
            <p className="cart-item__desc">{desc}</p>
          </div>

          <button
            className="cart-item__remove"
            onClick={() => onRemove(item)}
          >
            <X size={12} strokeWidth={1.8} />
          </button>
        </div>

        {/* META */}
        <div className="cart-item__meta">
          <span>Size {booking?.size || "-"}</span>

          {(type === "rental" || type === "preloved") && condition && (
            <>
              <span className="cart-item__meta-dot">•</span>
              <span
                className="cart-item__condition"
                data-grade={condition}
              >
                {gradeLabel[condition] || condition}
              </span>
            </>
          )}
        </div>

        {/* TIMELINE (ONLY RENTAL) */}
        {type === "rental" && (
          <div className="cart-item__timeline">
            <RentalTimeline booking={booking} />
          </div>
        )}

        {/* NOTICES */}
        {(type === "rental" || type === "preloved") && (
          <div className="cart-item__notice-wrap">

            {type === "rental" && (
              <RentalDepositNotice product={product} />
            )}

            {type === "preloved" && (
              <>
                <PrelovedDisclosure product={product} />
                <PrelovedFinalNote product={product} />
              </>
            )}

          </div>
        )}

        {/* FOOTER */}
        <div className="cart-item__footer">

          {/* PRICE */}
          <div className="cart-item__price">
            {type === "rental" && (
              <RentalPriceBlock product={product} booking={booking} />
            )}

            {type === "preloved" && (
              <PrelovedPriceBlock product={product} />
            )}

            {type === "new" && (
              <NewPriceBlock product={product} />
            )}
          </div>

          {/* ACTIONS */}
          <div className="cart-item__actions">
            <span
              className={`cart-item__action ${saved ? "saved" : ""}`}
              onClick={() => setSaved(true)}
            >
              {saved ? "Saved ✓" : "Save to wishlist"}
            </span>

            {type === "rental" && (
              <span
                className="cart-item__action"
                onClick={handleEditDates}
              >
                Edit dates
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartItemDesktop;