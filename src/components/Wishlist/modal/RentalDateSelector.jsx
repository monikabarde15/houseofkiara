// src/components/Wishlist/modal/RentalDateSelector.jsx

import "../../../styles/wishlist/modal/rental-date-selector.css";

const RentalDateSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="desk-wishlist-date-selector">
      <label className="desk-wishlist-date-label">
        Select Rental Dates
      </label>

      <div className="desk-wishlist-date-inputs">
        <div className="desk-wishlist-date-field">
          <label
            htmlFor="rental-start-date"
            className="desk-wishlist-date-field-label"
          >
            From
          </label>

          <input
            id="rental-start-date"
            type="date"
            className="desk-wishlist-date-input"
            value={startDate}
            min={today}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        <div className="desk-wishlist-date-field">
          <label
            htmlFor="rental-end-date"
            className="desk-wishlist-date-field-label"
          >
            To
          </label>

          <input
            id="rental-end-date"
            type="date"
            className="desk-wishlist-date-input"
            value={endDate}
            min={today}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalDateSelector;