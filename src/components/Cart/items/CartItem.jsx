import React, { useState } from "react"; 
import "../../../styles/cart/items/cart-item.css";
import RentalTimeline from "./modes/rental/RentalTimeline";
import RentalDepositNotice from "./modes/rental/RentalDepositNotice";
import RentalPriceBlock from "./modes/rental/RentalPriceBlock";
import PrelovedDisclosure from "./modes/preloved/PrelovedDisclosure";
import PrelovedPriceBlock from "./modes/preloved/PrelovedPriceBlock";
import NewPriceBlock from "./modes/new/NewPriceBlock";
import { useNavigate } from "react-router-dom";
import PrelovedFinalNote from "./modes/preloved/PrelovedFinalNote";
import { X } from "lucide-react";

const CartItem = ({ item,onRemove  }) => {
  const { product, booking, type } = item;
  const [saved, setSaved] = useState(false);

  // ===== BASIC DATA =====
  const brand = product?.designer || "";
  const name = product?.title || "";
  const desc = product?.description || "";
  const condition = product?.condition?.grade || "";

  const navigate = useNavigate();

  // ===== EDIT DATE HANDLER (ONLY FOR RENTAL) =====
  const handleEditDates = () => {
    if (type !== "rental") return;

    navigate(`/onlyrental/${product.id}`, {
      state: {
        booking: {
          deliveryDate: booking?.deliveryDate,
          eventDate: booking?.eventDate,
          returnDate: booking?.returnDate,
          rentalWindowDays: booking?.rentalWindowDays
        }
      }
    });
  };

  return (
    <div
      className={`cart-item ${item.removing ? "removing" : ""}`}
      data-item-id={type}
    >

      {/* ================= IMAGE ================= */}
      <div className="cart-item__image">
        <div className="cart-item__thumb">
          <img
            src={product?.images?.[0] || "/placeholder.jpg"}
            alt={product?.title || "Product image"}
            className="cart-item__img"
          />

          {/* MODE TAG */}
          <span className="cart-item__mode-tag">
            {/* {type} */}
            {type === "rental" ? "Rent" : type === "preloved" ? "Preloved" : "New"}
          </span>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="cart-item__content">

        {/* ================= HEADER ================= */}
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

          {/* REMOVE BUTTON */}
          <button
            className="cart-item__remove"
            onClick={() => onRemove(item)}
          >
            <X size={12} strokeWidth={1.8} />
          </button>

        </div>

        {/* ================= RENTAL MODE ================= */}
        {type === "rental" && (
          <>
            <div className="cart-item__timeline">
              <RentalTimeline booking={booking} product={product} />
            </div>

            <RentalDepositNotice product={product} />

            <div className="cart-item__footer">
              <RentalPriceBlock product={product} booking={booking} />

              <div className="cart-item__actions">
                <span
                  className={`cart-item__action ${saved ? "saved" : ""}`}
                  onClick={() => setSaved(true)}
                >
                  {saved ? "Saved ✓" : "Save to wishlist"}
                </span>

                <span
                  className="cart-item__action"
                  onClick={handleEditDates}
                >
                  Edit dates
                </span>
              </div>
            </div>
          </>
        )}

        {/* ================= PRELOVED MODE ================= */}
        {type === "preloved" && (
          <>
            <PrelovedDisclosure product={product} />
            <PrelovedFinalNote product={product} />

            <div className="cart-item__footer">
              <PrelovedPriceBlock product={product} />

              <div className="cart-item__actions">
                <span
                  className={`cart-item__action ${saved ? "saved" : ""}`}
                  onClick={() => setSaved(true)}
                >
                  {saved ? "Saved ✓" : "Save to wishlist"}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ================= NEW MODE ================= */}
        {type === "new" && (
          <>
            <div className="cart-item__footer">
              <NewPriceBlock product={product} />

              <div className="cart-item__actions">
                <span
                  className={`cart-item__action ${saved ? "saved" : ""}`}
                  onClick={() => setSaved(true)}
                >
                  {saved ? "Saved ✓" : "Save to wishlist"}
                </span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CartItem;