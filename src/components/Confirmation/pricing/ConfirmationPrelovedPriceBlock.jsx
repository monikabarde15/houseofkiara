// src\components\Confirmation\pricing\ConfirmationPrelovedPriceBlock.jsx
import { calculateGST } from "../../../utils/cart/gstCalculator";
import { useRegionalSettings } from "../../../hooks/useRegionalSettings";
import "../../../styles/confirmation/pricing/confirmation-price-block.css";

const ConfirmationPrelovedPriceBlock = ({ product }) => {
  const { currencySymbol, formatPrice } = useRegionalSettings();
  const pricing = product?.preloved?.pricing || {};

  const resale = pricing?.price || 0;

  const retail = pricing?.originalPrice || 0;

  const gst = calculateGST(resale, "preloved");

  const savings = retail - resale;

  return (
    <div className="confirmation-price-block">
      <div className="confirmation-price-block-price">
        <sup>{currencySymbol}</sup>
        {formatPrice(resale)}
      </div>

      <div className="confirmation-price-block-note">
        + {currencySymbol}{formatPrice(gst)} GST (5%) · HSN 6309
        {savings > 0 && <> · Saved {currencySymbol}{formatPrice(savings)} vs retail</>}
      </div>
    </div>
  );
};

export default ConfirmationPrelovedPriceBlock;
