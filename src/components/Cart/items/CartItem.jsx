import React from "react";
import "../../../styles/cart/items/cart-item.css";
import RentalTimeline from "./modes/rental/RentalTimeline";
import RentalDepositNotice from "./modes/rental/RentalDepositNotice";
import RentalPriceBlock from "./modes/rental/RentalPriceBlock";



const CartItem = ({ item }) => {
  const { product, booking, type } = item;

  // ===== SAFE DATA =====
  const brand = product?.designer || "";
  const name = product?.title || "";
  const desc = product?.description || "";
  const condition = product?.condition?.grade || "";

  // ===== PRICE LOGIC (BASIC FOR NOW) =====
  let price = "";
  let priceNote = "";
  let eyebrow = "";

  if (type === "rental") {
    const rent = product?.rent;
    const window = rent?.pricing?.windows?.[0] ;

    price = window?.price || 0;
    priceNote = rent?.pricing?.pricePerDay
      ? `₹${rent.pricing.pricePerDay} per day`
      : "";
    eyebrow = `${window?.days || ""}-day window`;
  }

  if (type === "new") {
    price = product?.buy?.pricing?.discountPrice || product?.buy?.pricing?.price;
    eyebrow = "Purchase";
  }

  if (type === "preloved") {
    price = product?.preloved?.pricing?.price;
    eyebrow = "Preloved";
  }

  // MODE-AWARE
  const MODE_COMPONENTS = {
    rental: {
      timeline: RentalTimeline,
      notice: RentalDepositNotice,
      price: RentalPriceBlock,
    },
    preloved: {},
    new: {},
  };

  const modeConfig = MODE_COMPONENTS[type];

  const TimelineComponent = modeConfig?.timeline;
  const NoticeComponent = modeConfig?.notice;
  const PriceComponent = modeConfig?.price;

  return (
    <div className="cart-item" data-item-id={type}>

      {/* IMAGE */}
      <div className="cart-item__image">
        <div className="cart-item__thumb">

          {/* REAL PRODUCT IMAGE */}
          <img
            src={product?.images?.[0]}
            alt={product?.title}
            className="cart-item__img"
          />

          {/* MODE TAG */}
          <span className="cart-item__mode-tag">
            {type}
          </span>

        </div>
      </div>

      {/* CONTENT */}
      <div className="cart-item__content">

        {/* HEADER */}
        <div className="cart-item__header">

          <div className="cart-item__info">

            <div className="cart-item__brand">
              {brand}
            </div>

            <h3 className="cart-item__name">
              {name}
            </h3>

            <p className="cart-item__desc">
              {desc}
            </p>

            {/* META */}
            <div className="cart-item__meta">
              <span>
                Size {booking?.size || "-"}
              </span>

              <span className="cart-item__meta-dot">•</span>

              <span
                className="cart-item__condition"
                data-grade={condition}
              >
                {condition}
              </span>
            </div>

          </div>

          {/* REMOVE // TODO: replace with SVG icon*/}
          <button
            className="cart-item__remove"
            onClick={() => console.log("open remove dialog")}
          >
            ×
          </button>

        </div>

        {/* TIMELINE */}
        {TimelineComponent && (
          <div className="cart-item__timeline">
            <TimelineComponent booking={booking} product={product} />
          </div>
        )}

        {/* NOTICE */}
        {NoticeComponent && (
          <NoticeComponent product={product} />
        )}

        {/* FOOTER */}
        <div className="cart-item__footer">

          {/* PRICE-BLOCK */}
          {PriceComponent && (
            <PriceComponent product={product} booking={booking} />
          )}

          <div className="cart-item__actions">
            <span className="cart-item__action">Save to wishlist</span>

            <span
              className="cart-item__action"
              onClick={() => console.log("open calendar")}
            >
              Edit dates
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CartItem;