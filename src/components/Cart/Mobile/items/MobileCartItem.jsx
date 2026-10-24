import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Notice from "../../../shared/Notice/Notice";
import RentalTimeline from "../../items/modes/rental/RentalTimeline";
import RentalPriceBlock from "../../items/modes/rental/RentalPriceBlock";
import PrelovedPriceBlock from "../../items/modes/preloved/PrelovedPriceBlock";
import NewPriceBlock from "../../items/modes/new/NewPriceBlock";
import "../../../../styles/cart/mobile/items/mobile-cart-item.css";

const MobileCartItem = ({ item, onRemove }) => {
  const { product, booking } = item;
  const rawType = item.type;
  const type = (rawType === "rent" || rawType === "rental") ? "rental" : rawType;
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const brand = product?.designer || "";
  const name = product?.title || product?.name || "";
  const desc = product?.description || product?.subtitle || "";
  const condition = product?.condition?.grade || (typeof product?.condition === "string" ? product?.condition : "");

  const gradeLabel = {
    pristine: "Pristine condition",
    excellent: "Excellent condition",
    good: "Good condition",
  };

  const handleEditDates = () => {
    if (type !== "rental") return;
    navigate(`/onlyrental/${product.id || product.productId || product._id}`, {
      state: { booking: { ...booking } },
    });
  };

  const resolvedImage =
    product?.images?.[0] ||
    product?.image?.[0] ||
    (typeof product?.image === "string" && product?.image) ||
    "/placeholder.jpg";

  return (
    <div className="mobile-cart-item" data-type={type}>
      
      {/* TOP ROW: Thumbnail + Header + Remove */}
      <div className="mobile-cart-item__top-row">
        
        {/* Thumbnail */}
        <div className="mobile-cart-item__thumb-wrapper">
          <div className="mobile-cart-item__thumb">
            <img src={resolvedImage} alt={name} />
            <span className="mobile-cart-item__mode-tag">
              {type === "rental" ? "Rent" : type === "preloved" ? "Preloved" : "New"}
            </span>
          </div>
        </div>

        {/* Header Info */}
        <div className="mobile-cart-item__info">
          <div className="mobile-cart-item__brand">{brand}</div>
          <h3 className="mobile-cart-item__name">{name}</h3>
          <p className="mobile-cart-item__desc">{desc}</p>
        </div>

        {/* Remove Button */}
        <button className="mobile-cart-item__remove" onClick={() => onRemove(item)}>
          <X size={11} strokeWidth={1.8} />
        </button>
      </div>

      {/* META ROW */}
      <div className="mobile-cart-item__meta">
        <span>Size {booking?.size || "-"}</span>
        {(type === "rental" || type === "preloved") && condition && (
          <>
            <span className="mobile-cart-item__meta-dot">•</span>
            <span className="mobile-cart-item__condition" data-grade={condition}>
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
          {type === "rental" && (() => {
            const deposit = product?.rent?.deposit;
            const amount = deposit?.amount;
            const returnDays = deposit?.returnDays;
            return (
              <Notice variant="amber" title={`₹${amount} refundable security deposit`}>
                — not collected at checkout. Our team will reach out via WhatsApp before dispatch. 
                Refunded in full within {returnDays - 2}-{returnDays} business days of return inspection.
              </Notice>
            );
          })()}

          {type === "preloved" && (
            <>
              {product?.preloved?.disclosure && (
                <Notice variant="rose" title="Condition disclosure:">
                  {product?.preloved?.disclosure}
                </Notice>
              )}
              {product?.preloved?.finalSaleNote && (
                <Notice variant="slate" title="Final sale.">
                  {product?.preloved?.finalSaleNote}
                </Notice>
              )}
            </>
          )}
        </div>
      )}

      {/* FOOTER: Price + Actions */}
      <div className="mobile-cart-item__footer">
        <div className="mobile-cart-item__price">
          {type === "rental" && <RentalPriceBlock product={product} booking={booking} itemPrice={item.price} />}
          {type === "preloved" && <PrelovedPriceBlock product={product} />}
          {type === "new" && <NewPriceBlock product={product} />}
        </div>
        <div className="mobile-cart-item__actions">
          <span className={`mobile-cart-item__action ${saved ? "saved" : ""}`} onClick={() => setSaved(true)}>
            {saved ? "Saved ✓" : "Save to wishlist"}
          </span>
          {/* {type === "rental" && (
            <span className="mobile-cart-item__action" onClick={handleEditDates}>
              Edit dates
            </span>
          )} */}
        </div>
      </div>

    </div>
  );
};

export default MobileCartItem;