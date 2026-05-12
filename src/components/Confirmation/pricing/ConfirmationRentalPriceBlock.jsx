import { calculateGST }
  from "../../../utils/cart/gstCalculator";

import "../../../styles/confirmation/pricing/confirmation-price-block.css";

const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const ConfirmationRentalPriceBlock = ({
  product,
  booking,
}) => {

  const rent =
    product?.rent;

  const days =
    booking?.rentalWindowDays || 0;

  const perDay =
    rent?.pricing?.pricePerDay || 0;

  const totalPrice =
    days * perDay;

  const gst =
    calculateGST(totalPrice, "rental");

  if (!days || !perDay) {
    return null;
  }

  return (
    <div className="confirmation-price-block">

      <div className="confirmation-price-block-price">
        <sup>₹</sup>
        {formatPrice(totalPrice)}
      </div>

      <div className="confirmation-price-block-note">
        + ₹{formatPrice(gst)} GST (18%)
        · SAC 997326
      </div>

    </div>
  );
};

export default ConfirmationRentalPriceBlock;