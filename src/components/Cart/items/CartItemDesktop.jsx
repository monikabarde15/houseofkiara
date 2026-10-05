import React from "react";
import "../../../styles/cart/items/cart-item-desktop.css";

import RentalTimeline from "./modes/rental/RentalTimeline";
// import RentalDepositNotice from "./modes/rental/RentalDepositNotice";
import RentalPriceBlock from "./modes/rental/RentalPriceBlock";

// import PrelovedDisclosure from "./modes/preloved/PrelovedDisclosure";
import PrelovedPriceBlock from "./modes/preloved/PrelovedPriceBlock";
// import PrelovedFinalNote from "./modes/preloved/PrelovedFinalNote";

import NewPriceBlock from "./modes/new/NewPriceBlock";

import { useNavigate } from "react-router-dom";
import { X, Heart, Star } from "lucide-react";
import Notice from "../../shared/Notice/Notice";
import useWishlistStore from "../../../store/wishlistStore";
import { makeProductDetail } from "../../ProductList";

const CartItemDesktop = ({ item, onRemove }) => {
  const { product, booking, type } = item;
  const navigate = useNavigate();

  const [localProduct, setLocalProduct] = React.useState(product);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = product._id || product.id;
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data && data.success && data.data) {
          setLocalProduct(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch fresh product data:", err);
      }
    };
    if (product?._id || product?.id) {
      fetchProduct();
    }
  }, [product]);

  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const isSaved = wishlistItems.includes(localProduct?._id || localProduct?.id);

  // ===== DATA =====
  const brand = localProduct?.designer || "";
  const name = localProduct?.title || localProduct?.name || "";
  const desc = localProduct?.description || "";
  const condition = localProduct?.condition?.grade || "";

  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
  };

  // ===== HANDLER =====
  const handleEditDates = async () => {
    if (type !== "rental") return;

    try {
      const productId = localProduct._id || localProduct.id;
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();

      let fullProduct = localProduct;
      if (data && data.success && data.data) {
        fullProduct = data.data;
      }

      const detailedProduct = makeProductDetail(fullProduct);
      const rent = detailedProduct.modes?.rent?.enabled;
      const preloved = detailedProduct.modes?.preloved?.enabled;
      const isNew = detailedProduct.modes?.buy?.enabled;

      let url = `/onlyrental/${productId}`;

      if (rent && preloved) {
        url = `/rentalandpreloved/${productId}`;
      } else if (rent && isNew) {
        url = `/rentalandbuy/${productId}`;
      } else if (rent) {
        url = `/onlyrental/${productId}`;
      } else if (preloved) {
        url = `/preloved/${productId}`;
      } else {
        url = `/buynew/${productId}`;
      }

      navigate(url, {
        state: {
          product: makeProductDetail(fullProduct),
          booking: {
            deliveryDate: booking?.deliveryDate,
            eventDate: booking?.eventDate,
            returnDate: booking?.returnDate,
            rentalWindowDays: booking?.rentalWindowDays,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  return (
    <div className="cart-item" data-item-id={type}>
      {/* LEFT — IMAGE */}
      <div className="cart-item__image">
        <div className="cart-item__thumb">
          <img
            src={
              localProduct?.images?.[0] ||
              localProduct?.image?.[0] ||
              "/placeholder.jpg"
            }
            alt={name || "Product"}
            className="cart-item__img"
          />
          {isSaved && (
            <Heart
              className="cart-item__heart-icon"
              fill="#b85c38"
              stroke="#b85c38"
              size={18}
              style={{ position: "absolute", top: 8, right: 8 }}
            />
          )}
          <span className="cart-item__mode-tag">
            {item.source === "rentandpreloved" ||
            (localProduct?.modes?.rent?.enabled && localProduct?.modes?.preloved?.enabled)
              ? "Rent & Preloved"
              : type === "rental"
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
            {localProduct?.rating != null && (
              <div
                className="cart-item__rating"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "4px",
                  marginBottom: "8px",
                }}
              >
                <Star size={12} fill="#c5a46d" stroke="#c5a46d" />
                <span>{localProduct.rating}</span>
                {localProduct?.reviews != null && (
                  <span>({localProduct.reviews} reviews)</span>
                )}
              </div>
            )}
            <p className="cart-item__desc">{desc}</p>
          </div>

          <button className="cart-item__remove" onClick={() => onRemove(item)}>
            <X size={12} strokeWidth={1.8} />
          </button>
        </div>

        {/* META */}
        <div className="cart-item__meta">
          <span>
            {booking?.size === "Default"
              ? "Free Size"
              : `Size ${booking?.size || "-"}`}
          </span>
          {booking?.color && (
            <>
              <span className="cart-item__meta-dot">•</span>
              <span>Color: {booking.color}</span>
            </>
          )}
          {booking?.measurements && (
            <>
              <span className="cart-item__meta-dot">•</span>
              <span>Measurements added</span>
            </>
          )}

          {(type === "rental" || type === "preloved") && condition && (
            <>
              <span className="cart-item__meta-dot">•</span>
              <span className="cart-item__condition" data-grade={condition}>
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
            {type === "rental" &&
              (() => {
                const deposit = localProduct?.rent?.deposit;

                const amount = deposit?.amount || 0;
                const returnDays = deposit?.returnDays || 5;

                if (amount <= 0) return null;

                return (
                  <Notice
                    variant="amber"
                    title={`₹${amount.toLocaleString()} refundable security deposit`}
                  >
                    — not collected at checkout. Our team will reach out via
                    WhatsApp before dispatch. Refunded in full within{" "}
                    {returnDays - 2}-{returnDays} business days of return
                    inspection.
                  </Notice>
                );
              })()}

            {/* PRELOVED */}
            {type === "preloved" && (
              <>
                {localProduct?.preloved?.disclosure && (
                  <Notice variant="rose" title="Condition disclosure:">
                    {localProduct?.preloved?.disclosure}
                  </Notice>
                )}

                {localProduct?.preloved?.finalSaleNote && (
                  <Notice variant="slate" title="Final sale.">
                    {localProduct?.preloved?.finalSaleNote}
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
              <RentalPriceBlock
                item={item}
                product={localProduct}
                booking={booking}
              />
            )}

            {type === "preloved" && (
              <PrelovedPriceBlock item={item} product={localProduct} />
            )}

            {type === "new" && (
              <NewPriceBlock item={item} product={localProduct} />
            )}
          </div>

          {/* ACTIONS */}
          <div className="cart-item__actions">
            <span
              className={`cart-item__action ${isSaved ? "saved" : ""}`}
              onClick={() =>
                toggleWishlist(localProduct._id || localProduct.id)
              }
            >
              {isSaved ? "Saved ✓" : "Save to wishlist"}
            </span>

            {type === "rental" && (
              <span className="cart-item__action" onClick={handleEditDates}>
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
