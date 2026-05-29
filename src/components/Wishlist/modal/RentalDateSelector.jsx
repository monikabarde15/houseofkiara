// src/components/Wishlist/modal/RentalDateSelector.jsx
// Section 11.4: Modal Body - Rental Date Selector

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
      <label className="desk-wishlist-date-label">Select Rental Dates</label>
      <div className="desk-wishlist-date-inputs">
        <div className="desk-wishlist-date-field">
          <span className="desk-wishlist-date-field-label">From</span>
          <input
            type="date"
            className="desk-wishlist-date-input"
            value={startDate}
            min={today}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div className="desk-wishlist-date-field">
          <span className="desk-wishlist-date-field-label">To</span>
          <input
            type="date"
            className="desk-wishlist-date-input"
            value={endDate}
            min={startDate || today}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalDateSelector;