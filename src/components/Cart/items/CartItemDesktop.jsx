// src\components\Cart\items\CartItemDesktop.jsx
import React, { useState } from "react";
import "../../../styles/cart/items/cart-item-desktop.css";

import RentalTimeline from "./modes/rental/RentalTimeline";
// import RentalDepositNotice from "./modes/rental/RentalDepositNotice";
import RentalPriceBlock from "./modes/rental/RentalPriceBlock";

// import PrelovedDisclosure from "./modes/preloved/PrelovedDisclosure";
import PrelovedPriceBlock from "./modes/preloved/PrelovedPriceBlock";
// import PrelovedFinalNote from "./modes/preloved/PrelovedFinalNote";

import NewPriceBlock from "./modes/new/NewPriceBlock";

import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Notice from "../../shared/Notice/Notice";
import useCartStore from "../../../store/cartStore";

const CartItemDesktop = ({ item, onRemove }) => {
  const { product, booking } = item;
  const rawType = item.type;
  const type = (rawType === "rent" || rawType === "rental") ? "rental" : rawType;
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  // ===== DATA =====
  const brand = product?.designer || "";
  const name = product?.title || product?.name || "";
  const desc = product?.description || product?.subtitle || "";
  const condition = product?.condition?.grade || (typeof product?.condition === "string" ? product?.condition : "");

  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
    good: "Good condition",
  };

  const getEditUrl = () => {
    const pid =
      product?.productId || product?._id || product?.id || item.productId;
    const modes = (product?.listingModes || []).map((m) => String(m).toUpperCase());
    if (modes.includes("PRELOVED") || modes.includes("RE-SELL") || product?.modes?.preloved?.enabled) {
      return `/rentalandpreloved/${pid}`;
    }
    if (modes.includes("BUY NEW") || modes.includes("BUY") || product?.modes?.buy?.enabled) {
      return `/rentalandbuy/${pid}`;
    }
    return `/onlyrental/${pid}`;
  };

  // ===== HANDLER =====
  const handleEditDates = () => {
    if (type !== "rental") return;

    navigate(getEditUrl(), {
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

  const resolvedImage =
    product?.images?.[0] ||
    product?.image?.[0] ||
    (typeof product?.image === "string" && product?.image) ||
    "/placeholder.jpg";

  return (
    <div className="cart-item" data-item-id={type}>
      
      {/* LEFT — IMAGE */}
      <div className="cart-item__image">
        <div className="cart-item__thumb">
          <img
            src={resolvedImage}
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

          {type === "new" && (
            <>
              <span className="cart-item__meta-dot">•</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    useCartStore
                      .getState()
                      .updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
                  }
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "1px solid #D9D0C3",
                    background: "#FAF7F2",
                    cursor: "pointer",
                    fontSize: "12px",
                    lineHeight: 1,
                  }}
                >
                  −
                </button>
                <span>Qty {item.quantity || 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    useCartStore
                      .getState()
                      .updateQuantity(item.id, (item.quantity || 1) + 1)
                  }
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "1px solid #D9D0C3",
                    background: "#FAF7F2",
                    cursor: "pointer",
                    fontSize: "12px",
                    lineHeight: 1,
                  }}
                >
                  +
                </button>
              </span>
            </>
          )}

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
        {/* {(type === "rental" || type === "preloved") && (
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
        )} */}

        {/* NOTICES */}
{(type === "rental" || type === "preloved") && (
  <div className="cart-item__notice-wrap">

    {/* RENTAL */}
    {type === "rental" && (() => {

      const deposit = product?.rent?.deposit;

      const amount = deposit?.amount;
      const returnDays = deposit?.returnDays;

      return (
        <Notice
          variant="amber"
          title={`₹${amount} refundable security deposit`}
        >
          — not collected at checkout. Our team will reach
          out via WhatsApp before dispatch. Refunded in full
          within {returnDays - 2}-{returnDays} business days
          of return inspection.
        </Notice>
      );

    })()}

    {/* PRELOVED */}
    {type === "preloved" && (
      <>

        {product?.preloved?.disclosure && (
          <Notice
            variant="rose"
            title="Condition disclosure:"
          >
            {product?.preloved?.disclosure}
          </Notice>
        )}

        {product?.preloved?.finalSaleNote && (
          <Notice
            variant="slate"
            title="Final sale."
          >
            {product?.preloved?.finalSaleNote}
          </Notice>
        )}

      </>
    )}

  </div>
)}

        {/* FOOTER */}
        <div className="cart-item__footer">

          {/* PRICE */}
          <div className="cart-item__price">
            {type === "rental" && (
              <RentalPriceBlock product={product} booking={booking} itemPrice={item.price} />
            )}

            {type === "preloved" && (
              <PrelovedPriceBlock product={product} itemPrice={item.price} />
            )}

            {type === "new" && (
              <NewPriceBlock product={product} itemPrice={item.price} quantity={item.quantity} />
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

export { CartItemDesktop };
export default CartItemDesktop;
