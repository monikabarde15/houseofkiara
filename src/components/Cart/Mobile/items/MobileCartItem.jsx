import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart, Star } from "lucide-react";
import Notice from "../../../shared/Notice/Notice";
import RentalTimeline from "../../items/modes/rental/RentalTimeline";
import RentalPriceBlock from "../../items/modes/rental/RentalPriceBlock";
import PrelovedPriceBlock from "../../items/modes/preloved/PrelovedPriceBlock";
import NewPriceBlock from "../../items/modes/new/NewPriceBlock";
import useWishlistStore from "../../../../store/wishlistStore";
import { makeProductDetail } from "../../../ProductList";
import "../../../../styles/cart/mobile/items/mobile-cart-item.css";

const MobileCartItem = ({ item, onRemove }) => {
  const { product, booking, type } = item;
  const navigate = useNavigate();

  const [localProduct, setLocalProduct] = useState(product);

  useEffect(() => {
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

  const brand = localProduct?.designer || "";
  const name = localProduct?.title || localProduct?.name || "";
  const desc = localProduct?.description || "";
  const condition = localProduct?.condition?.grade || "";

  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
  };

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
          booking: { ...booking },
        },
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  return (
    <div className="mobile-cart-item" data-type={type}>
      {/* TOP ROW: Thumbnail + Header + Remove */}
      <div className="mobile-cart-item__top-row">
        {/* Thumbnail */}
        <div className="mobile-cart-item__thumb-wrapper">
          <div className="mobile-cart-item__thumb">
            <img
              src={
                localProduct?.images?.[0] ||
                localProduct?.image?.[0] ||
                "/placeholder.jpg"
              }
              alt={name}
            />
            {isSaved && (
              <Heart
                className="mobile-cart-item__heart-icon"
                fill="#b85c38"
                stroke="#b85c38"
                size={16}
                style={{ position: "absolute", top: 4, right: 4 }}
              />
            )}
            <span className="mobile-cart-item__mode-tag">
              {type === "rental"
                ? "Rent"
                : type === "preloved"
                  ? "Preloved"
                  : "New"}
            </span>
          </div>
        </div>

        {/* Header Info */}
        <div className="mobile-cart-item__info">
          <div className="mobile-cart-item__brand">{brand}</div>
          <h3 className="mobile-cart-item__name">{name}</h3>
          {localProduct?.rating != null && (
            <div
              className="mobile-cart-item__rating"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: "#666",
                marginTop: "2px",
                marginBottom: "4px",
              }}
            >
              <Star size={11} fill="#c5a46d" stroke="#c5a46d" />
              <span>{localProduct.rating}</span>
              {localProduct?.reviews != null && (
                <span>({localProduct.reviews} reviews)</span>
              )}
            </div>
          )}
          <p className="mobile-cart-item__desc">{desc}</p>
        </div>

        {/* Remove Button */}
        <button
          className="mobile-cart-item__remove"
          onClick={() => onRemove(item)}
        >
          <X size={11} strokeWidth={1.8} />
        </button>
      </div>

      {/* META ROW */}
      <div className="mobile-cart-item__meta">
        <span>
          {booking?.size === "Default"
            ? "Free Size"
            : `Size ${booking?.size || "-"}`}
        </span>
        {(type === "rental" || type === "preloved") && condition && (
          <>
            <span className="mobile-cart-item__meta-dot">•</span>
            <span
              className="mobile-cart-item__condition"
              data-grade={condition}
            >
              {gradeLabel[condition] || condition}
            </span>
          </>
        )}
      </div>

      {/* RENTAL TIMELINE */}
      {type === "rental" && <RentalTimeline booking={booking} />}

      {/* NOTICES */}
      {(type === "rental" || type === "preloved") && (
        <div className="mobile-cart-item__notice-wrap">
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

      {/* FOOTER: Price + Actions */}
      <div className="mobile-cart-item__footer">
        <div className="mobile-cart-item__price">
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
        <div className="mobile-cart-item__actions">
          <span
            className={`mobile-cart-item__action ${isSaved ? "saved" : ""}`}
            onClick={() =>
              toggleWishlist(localProduct?._id || localProduct?.id)
            }
          >
            {isSaved ? "Saved ✓" : "Save to wishlist"}
          </span>
          {type === "rental" && (
            <span
              className="mobile-cart-item__action"
              onClick={handleEditDates}
            >
              Edit dates
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCartItem;
