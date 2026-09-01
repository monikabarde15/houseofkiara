// src\components\Confirmation\pricing\ConfirmationNewPriceBlock.jsx
import "../../../styles/confirmation/pricing/confirmation-price-block.css";

const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const ConfirmationNewPriceBlock = ({
  product,
}) => {

  const pricing =
    product?.new?.pricing || {};

  const price =
    pricing?.price || 0;

  const gst =
    Math.round(
      (price / 1.12) * 0.12
    );

  return (
    <div className="confirmation-price-block">

      <div className="confirmation-price-block-price">
        <sup>₹</sup>
        {formatPrice(price)}
      </div>

      <div className="confirmation-price-block-note">
        18% GST (₹{formatPrice(gst)})
        embedded · HSN 6101
        · GST 2.0 rate
      </div>

    </div>
  );
};

export default ConfirmationNewPriceBlock;