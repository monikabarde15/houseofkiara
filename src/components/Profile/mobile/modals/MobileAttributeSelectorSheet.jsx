import { useEffect, useMemo, useState } from "react";

import MobileBottomSheet from "../sheets/MobileBottomSheet";

import "../../../../styles/Profile/mobile/modals/MobileAttributeSelectorSheet.css";

const MobileAttributeSelectorSheet = ({
  isOpen,
  onClose,
  piece,
  onConfirm
}) => {
  /* =========================================
     Local State
     ========================================= */

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  /* =========================================
     Derived Flags
     ========================================= */

  const needsSize =
    piece?.sizes &&
    piece.sizes.length > 1;

  const needsColor =
    piece?.colors &&
    piece.colors.length > 1;

  const isRental =
    piece?.mode === "Rental";

  /* =========================================
     Reset State On Open
     ========================================= */

  useEffect(() => {
    if (!isOpen || !piece) {
      return;
    }

    setSelectedSize("");
    setSelectedColor("");
    setStartDate("");
    setEndDate("");
  }, [isOpen, piece]);

  /* =========================================
     Validation
     ========================================= */

  const validationMessage = useMemo(() => {
    if (!piece) {
      return "";
    }

    if (
      needsSize &&
      !selectedSize
    ) {
      return "Please select a size";
    }

    if (
      needsColor &&
      !selectedColor
    ) {
      return "Please select a colour";
    }

    if (
      isRental &&
      (!startDate || !endDate)
    ) {
      return "Please select rental dates";
    }

    if (
      isRental &&
      startDate &&
      endDate &&
      new Date(endDate) <=
        new Date(startDate)
    ) {
      return "Return date must be after the start date";
    }

    return "";
  }, [
    piece,
    needsSize,
    needsColor,
    isRental,
    selectedSize,
    selectedColor,
    startDate,
    endDate
  ]);

  /* =========================================
     Completion State
     ========================================= */

  const isComplete =
    validationMessage === "";

  /* =========================================
     Confirm Action
     ========================================= */

  const handleConfirm = () => {
    if (!isComplete) {
      return;
    }

    onConfirm({
      size: selectedSize,
      color: selectedColor,
      startDate,
      endDate
    });
  };

  /* =========================================
     Minimum Date
     ========================================= */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /* =========================================
     Guard
     ========================================= */

  if (!piece) {
    return null;
  }

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select Options"
    >
      {/* =====================================
          Product Summary Row
         ===================================== */}

      <div className="profile-mobile-attr-product">
        <div
          className="profile-mobile-attr-product-img"
          style={{
            "--attr-bg":
              piece.imageGradient
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="profile-mobile-attr-product-info">
          <div className="profile-mobile-attr-product-name">
            {piece.name}
          </div>

          <div className="profile-mobile-attr-product-meta">
            {piece.mode === "Rental"
              ? `Rental — ₹${piece.price.toLocaleString()} / booking`
              : `${piece.mode} — ₹${piece.price.toLocaleString()}`}
          </div>
        </div>
      </div>

      {/* =====================================
          Size Selector
         ===================================== */}

      {needsSize && (
        <section className="profile-mobile-attr-section">
          <div className="profile-mobile-attr-label">
            Select Size
          </div>

          <div className="profile-mobile-attr-pills">
            {piece.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`profile-mobile-attr-pill ${
                  selectedSize === size
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedSize(size)
                }
              >
                {size}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* =====================================
          Colour Selector
         ===================================== */}

      {needsColor && (
        <section className="profile-mobile-attr-section">
          <div className="profile-mobile-attr-label">
            Select Colour
          </div>

          <div className="profile-mobile-attr-swatches">
            {piece.colors.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                className={`profile-mobile-attr-swatch ${
                  selectedColor === color
                    ? "selected"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    color.toLowerCase()
                }}
                onClick={() =>
                  setSelectedColor(color)
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* =====================================
          Rental Date Selector
         ===================================== */}

      {isRental && (
        <section className="profile-mobile-attr-section">
          <div className="profile-mobile-attr-label">
            Select Rental Dates
          </div>

          <div className="profile-mobile-attr-dates">
            <div className="profile-mobile-attr-date-field">
              <label>
                From
              </label>

              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="profile-mobile-attr-date-field">
              <label>
                To
              </label>

              <input
                type="date"
                value={endDate}
                min={
                  startDate || today
                }
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* =====================================
          Validation Message
         ===================================== */}

      <div className="profile-mobile-attr-validation">
        {validationMessage}
      </div>

      {/* =====================================
          Primary CTA
         ===================================== */}

      <button
        type="button"
        disabled={!isComplete}
        className={`profile-mobile-attr-add-btn ${
          isComplete
            ? "active"
            : ""
        }`}
        onClick={handleConfirm}
      >
        Add to Bag
      </button>

      {/* =====================================
          Secondary CTA
         ===================================== */}

      <button
        type="button"
        className="profile-mobile-attr-view-btn"
        onClick={onClose}
      >
        View Product Page
      </button>
    </MobileBottomSheet>
  );
};

export default MobileAttributeSelectorSheet;