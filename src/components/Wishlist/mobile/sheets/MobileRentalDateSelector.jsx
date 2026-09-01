import '../../../../styles/wishlist/mobile/sheets/mobile-rental-date-selector.css';

const MobileRentalDateSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="wishlist-mobile-rental-date-selector">
      {/* Section label: "SELECT RENTAL DATES" */}
      <div className="wishlist-mobile-rental-date-selector__label">SELECT RENTAL DATES</div>
      
      {/* Two-column grid, gap 10px */}
      <div className="wishlist-mobile-rental-date-selector__grid">
        {/* From Date Field */}
        <div className="wishlist-mobile-rental-date-selector__field">
          <label className="wishlist-mobile-rental-date-selector__field-label">FROM</label>
          <input 
            type="date"
            className="wishlist-mobile-rental-date-selector__input"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={today}
          />
        </div>
        
        {/* To Date Field */}
        <div className="wishlist-mobile-rental-date-selector__field">
          <label className="wishlist-mobile-rental-date-selector__field-label">TO</label>
          <input 
            type="date"
            className="wishlist-mobile-rental-date-selector__input"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || today}
            disabled={!startDate}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileRentalDateSelector;