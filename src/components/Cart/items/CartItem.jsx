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

const CartItem = ({ item, onRemove }) => {
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

  // Condition Label Map
  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
  };

  return (
    <div className="cart-item" data-item-id={type}>



      {/* IMAGE */}
      <div className="cart-item__image">
        <div className="cart-item__thumb">
          <img
            src={product?.images?.[0] || "/placeholder.jpg"}
            alt={product?.title || "Product image"}
            className="cart-item__img"
          />
          <span className="cart-item__mode-tag">
            {type === "rental" ? "Rent" : type === "preloved" ? "Preloved" : "New"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="cart-item__content">
        {/* Wrapper */}
        <div className="cart-item__top">

          {/* HEADER */}
          <div className="cart-item__header">

            <div className="cart-item__info">
              <div className="cart-item__brand">{brand}</div>
              <h3 className="cart-item__name">{name}</h3>
              <p className="cart-item__desc">{desc}</p>
            </div>

            <button className="cart-item__remove" onClick={() => onRemove(item)}>
              <X size={12} strokeWidth={1.8} />
            </button>

          </div>



          {/* META */}
          <div className="cart-item__meta">
            <span>Size {booking?.size || "-"}</span>
            <span className="cart-item__meta-dot">•</span>

            {(type === "rental" || type === "preloved") && condition && (
              <span className="cart-item__condition" data-grade={condition}>
                {gradeLabel[condition] || condition}
              </span>
            )}
          </div>



          {type === "rental" && (
            <div className="cart-item__timeline">

              {/* DELIVERY */}
              <div className="date-node">
                <div className="date-node__header">
                  <div className="date-node__label">Delivery</div>
                </div>

                <div className="date-node__circle" />

                <div className="date-node__value">
                  {booking?.deliveryDate}
                </div>
                <div className="date-node__sub">
                  {/* Day */}
                </div>
              </div>

              {/* EVENT */}
              <div className="date-node date-node--event">
                <div className="date-node__header">
                  <div className="date-node__window">
                    {booking?.rentalWindowDays}-Day Window
                  </div>
                  <div className="date-node__label">Event</div>
                </div>

                <div className="date-node__circle date-node__circle--filled" />

                <div className="date-node__value">
                  {booking?.eventDate}
                </div>
                <div className="date-node__sub">
                  {/* Day */}
                </div>
              </div>

              {/* RETURN */}
              <div className="date-node">
                <div className="date-node__header">
                  <div className="date-node__label">Return</div>
                </div>

                <div className="date-node__circle" />

                <div className="date-node__value">
                  {booking?.returnDate}
                </div>
                <div className="date-node__sub">
                  {/* Day */}
                </div>
              </div>

            </div>
          )}

          {/* NOTICES */}

          {/* RENTAL */}
          {type === "rental" && (
            <div className="cart-item__notice-wrap">
              <RentalDepositNotice product={product} />
            </div>
          )}

          {/* PRELOVED */}
          {type === "preloved" && (
            <div className="cart-item__notice-wrap">
              <PrelovedDisclosure product={product} />
              <PrelovedFinalNote product={product} />
            </div>
          )}

          {/* FOOTER */}

          <div className="cart-item__footer">

            {/* PRICE BLOCK */}
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
                <span className="cart-item__action" onClick={handleEditDates}>
                  Edit dates
                </span>
              )}
            </div>

          </div>

        </div>
         {/* Wrapper end */}
        </div>

      </div>
      );
};

      export default CartItem;