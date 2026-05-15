// src\components\Confirmation\pricing\ConfirmationPrelovedPriceBlock.jsx
import { calculateGST }
  from "../../../utils/cart/gstCalculator";

import "../../../styles/confirmation/pricing/confirmation-price-block.css";

const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const ConfirmationPrelovedPriceBlock = ({
  product,
}) => {

  const pricing =
    product?.preloved?.pricing || {};

  const resale =
    pricing?.price || 0;

  const retail =
    pricing?.originalPrice || 0;

  const gst =
    calculateGST(resale, "preloved");

  const savings =
    retail - resale;

  return (
    <div className="confirmation-price-block">

      <div className="confirmation-price-block-price">
        <sup>₹</sup>
        {formatPrice(resale)}
      </div>

      <div className="confirmation-price-block-note">
        + ₹{formatPrice(gst)} GST (5%)
        · HSN 6309

        {savings > 0 && (
          <>
            {" "}
            · Saved ₹{formatPrice(savings)} vs retail
          </>
        )}
      </div>

    </div>
  );
};

export default ConfirmationPrelovedPriceBlock;