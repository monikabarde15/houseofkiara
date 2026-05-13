import React, { useState } from "react";
import "../../../styles/cart/items/cart-item-mobile.css";

import RentalTimeline from "./modes/rental/RentalTimeline";
// import RentalDepositNotice from "./modes/rental/RentalDepositNotice";
import RentalPriceBlock from "./modes/rental/RentalPriceBlock";

// import PrelovedDisclosure from "./modes/preloved/PrelovedDisclosure";
// import PrelovedFinalNote from "./modes/preloved/PrelovedFinalNote";
import PrelovedPriceBlock from "./modes/preloved/PrelovedPriceBlock";

import NewPriceBlock from "./modes/new/NewPriceBlock";

import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Notice from "../../shared/Notice/Notice";

const CartItemMobile = ({ item, onRemove }) => {
  const { product, booking, type } = item;
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const brand = product?.designer || "";
  const name = product?.title || "";
  const desc = product?.description || "";
  const condition = product?.condition?.grade || "";

  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
  };

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
    <div className="cart-item-mobile" data-item-id={type}>

      {/* 🔹 TOP ROW (Image + Header) */}
      <div className="cart-item__top-row-mobile">

        {/* IMAGE */}
        <div className="cart-item__image-mobile">
          <div className="cart-item__thumb-mobile" data-type={type}>
            <img
              src={product?.images?.[0] || "/placeholder.jpg"}
              alt={name}
              className="cart-item__img-mobile"
            />
            <span className="cart-item__mode-tag-mobile">
              {type === "rental"
                ? "Rent"
                : type === "preloved"
                ? "Preloved"
                : "New"}
            </span>
          </div>
        </div>

        {/* HEADER BLOCK */}
        <div className="cart-item__header-block-mobile">

          <div className="cart-item__header-mobile">
            <div className="cart-item__info-mobile">
              <div className="cart-item__brand-mobile">{brand}</div>
              <h3 className="cart-item__name-mobile">{name}</h3>
              <p className="cart-item__desc-mobile">{desc}</p>
            </div>

            <button
              className="cart-item__remove-mobile"
              onClick={() => onRemove(item)}
            >
              <X size={11} strokeWidth={1.8} />
            </button>
          </div>

        </div>

      </div>

      {/* 🔹 META */}
      <div className="cart-item__meta-mobile">
        <span>Size {booking?.size || "-"}</span>

        {(type === "rental" || type === "preloved") && condition && (
          <>
            <span className="cart-item__meta-dot-mobile">•</span>
            <span className="cart-item__condition-mobile" data-grade={condition}>
              {gradeLabel[condition] || condition}
            </span>
          </>
        )}
      </div>

      {/* 🔹 TIMELINE */}
      {type === "rental" && <RentalTimeline booking={booking} />}

      {/* 🔹 NOTICES */}
      {/* {(type === "rental" || type === "preloved") && (
        <div className="cart-item__notice-wrap-mobile">

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

      {/* 🔹 NOTICES */}
{(type === "rental" || type === "preloved") && (
  <div className="cart-item__notice-wrap-mobile">

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

      {/* 🔹 FOOTER */}
      <div className="cart-item__footer-mobile">

        <div className="cart-item__price-mobile">
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

        <div className="cart-item__actions-mobile">
          <span
            className={`cart-item__action-mobile ${saved ? "saved" : ""}`}
            onClick={() => setSaved(true)}
          >
            {saved ? "Saved ✓" : "Save to wishlist"}
          </span>

          {type === "rental" && (
            <span className="cart-item__action-mobile" onClick={handleEditDates}>
              Edit dates
            </span>
          )}
        </div>

      </div>

    </div>
  );
};

export default CartItemMobile;