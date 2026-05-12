import ConfirmationRentalPriceBlock from "../pricing/ConfirmationRentalPriceBlock";
import ConfirmationPrelovedPriceBlock from "../pricing/ConfirmationPrelovedPriceBlock";
import ConfirmationNewPriceBlock from "../pricing/ConfirmationNewPriceBlock";

import ConfirmationDispatchRow from "./ConfirmationDispatchRow";

import "../../../styles/confirmation/sections/confirmation-piece-card.css";


const ConfirmationPieceCard = ({
  item,
  isLast = false,
}) => {

  const getRentalDays = (booking) => {

    if (
      !booking?.deliveryDate ||
      !booking?.returnDate
    ) {
      return 0;
    }

    const start = new Date(
      booking.deliveryDate
    );

    const end = new Date(
      booking.returnDate
    );

    const diff = end - start;

    return Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );
  };

  const condition =
    item.product?.condition?.grade;

  return (
    <div
      className={`
        confirmation-piece-card
        ${isLast
          ? "confirmation-piece-card-last"
          : ""
        }
      `}
    >

      {/* THUMB */}
      <div
        className={`
          confirmation-piece-card-thumb
          confirmation-piece-card-thumb-${item.type}
        `}
      >

        <img
          src={item.product?.images?.[0]}
          alt={item.product?.title}
        />

        <div
          className={`
            confirmation-piece-card-mode-strip
            confirmation-piece-card-mode-strip-${item.type}
          `}
        >
          {item.type === "rental"
            ? "Rent"
            : item.type === "preloved"
              ? "Preloved"
              : "New"}
        </div>

              <div
                  className={`
    confirmation-piece-card-status
    ${item.type === "rental"
                          ? "confirmation-piece-card-status-pending"
                          : "confirmation-piece-card-status-confirmed"
                      }
  `}
              >
                  {item.type === "rental"
                      ? "Pending dispatch"
                      : "Confirmed"}
              </div>

      </div>

      {/* BODY */}
      <div className="confirmation-piece-card-body">

        <div className="confirmation-piece-card-brand">
          {item.product?.designer}
        </div>

        <h3 className="confirmation-piece-card-name">
          {item.product?.title}
        </h3>

        <div className="confirmation-piece-card-description">

          {[
            item.product?.description,

            item.booking?.size
              ? `Size ${item.booking.size}`
              : null,

            condition
              ? condition === "pristine"
                ? "Pristine condition"
                : condition === "excellent"
                  ? "Excellent condition"
                  : `${condition} condition`
              : null

          ]
            .filter(Boolean)
            .join(" · ")}

        </div>

        <div className="confirmation-piece-card-price-row">

          {item.type === "rental" && (
            <ConfirmationRentalPriceBlock
              product={item.product}
              booking={{
                ...item.booking,
                rentalWindowDays:
                  getRentalDays(item.booking),
              }}
            />
          )}

          {item.type === "preloved" && (
            <ConfirmationPrelovedPriceBlock
              product={item.product}
            />
          )}

          {item.type === "new" && (
            <ConfirmationNewPriceBlock
              product={item.product}
            />
          )}

        </div>

        <ConfirmationDispatchRow item={item} />
        


      </div>

    </div>
  );
};

export default ConfirmationPieceCard;