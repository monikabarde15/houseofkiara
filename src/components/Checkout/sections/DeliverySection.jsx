import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/delivery-section.css";
import "../../../styles/checkout/sections/components/field.css";

export default function DeliverySection({
  deliveryType,
  setDeliveryType,
  checkoutItems = [],
}) {

  // RENTAL ITEM
  const rentalItem = checkoutItems.find((item) => item.type === "rental");

  const rentalName = rentalItem?.product?.title || rentalItem?.title || "your rental piece";

  const arrivalDateRaw = rentalItem?.booking?.deliveryDate;

  const arrivalDate = arrivalDateRaw
    ? new Date(arrivalDateRaw).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "your selected date";

  const arrivalDay = arrivalDateRaw
    ? new Date(arrivalDateRaw).toLocaleDateString("en-IN", {
        weekday: "long",
      })
    : "";

  return (
    <FormSection>
      <div className="delivery-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">03</div>
          <h2 className="checkout-section-title">
            Delivery <em>Method</em>
          </h2>
        </div>

        {/* OPTION GROUP */}
        <div className="checkout-option-group">

          {/* STANDARD */}
          <div
            className={`checkout-option-card ${deliveryType === "standard" ? "selected" : ""}`}
            onClick={() => setDeliveryType("standard")}
          >
            <div className={`checkout-option-radio ${deliveryType === "standard" ? "selected" : ""}`}></div>
            <div className="checkout-option-content">
              <div className="checkout-option-row">
                <span className="checkout-option-name">Standard delivery</span>
                <span className="checkout-option-tag tag-free">Free · ₹0</span>
              </div>
              <p className="checkout-option-desc">
                3–5 business days · Blue Dart / Delhivery · End-to-end tracking · Plastic-free HOK garment bag · Insured
              </p>
            </div>
          </div>

          {/* EXPRESS */}
          <div
            className={`checkout-option-card ${deliveryType === "express" ? "selected" : ""}`}
            onClick={() => setDeliveryType("express")}
          >
            <div className={`checkout-option-radio ${deliveryType === "express" ? "selected" : ""}`}></div>
            <div className="checkout-option-content">
              <div className="checkout-option-row">
                <span className="checkout-option-name">Express delivery</span>
                <span className="checkout-option-tag tag-express">₹299</span>
              </div>
              <p className="checkout-option-desc">
                1–2 business days · Blue Dart Priority · Signature on delivery · Insured transit
              </p>
            </div>
          </div>

        </div>

        {/* NOTICE - Desktop and Mobile versions */}
        <div className="checkout-delivery-notice">
          {/* DESKTOP NOTICE TEXT */}
          <p className="checkout-delivery-notice-text desktop-notice">
            <span className="checkout-delivery-notice-label">Rental dispatch note:</span>{" "}
            <span className="checkout-delivery-notice-body">
              Regardless of shipping method, your{" "}
              <span className="checkout-delivery-notice-strong">{rentalName}</span>
              {" "}will be dispatched to arrive by{" "}
              <span className="checkout-delivery-notice-strong">
                {arrivalDate}{arrivalDay ? ` (${arrivalDay})` : ""}
              </span>{" "}
              — two days before your event. Rental dispatch timelines are fixed to the booking window and cannot be accelerated.
            </span>
          </p>

          {/* MOBILE NOTICE TEXT (Spec Page 17) */}
          <p className="checkout-delivery-notice-text mobile-notice">
            <span className="checkout-delivery-notice-label">Rental dispatch note:</span>{" "}
            <span className="checkout-delivery-notice-body">
              Your{" "}
              <span className="checkout-delivery-notice-strong">{rentalName}</span>
              {" "}will arrive by{" "}
              <span className="checkout-delivery-notice-strong">
                {arrivalDate}{arrivalDay ? ` (${arrivalDay})` : ""}
              </span>{" "}
              regardless of shipping method chosen. Rental timelines cannot be accelerated.
            </span>
          </p>
        </div>

      </div>
    </FormSection>
  );
}