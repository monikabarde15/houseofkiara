import DesktopViewToggle from "./DesktopViewToggle";
import "../../../styles/wishlist/toolbar/desktop-sort-share-row.css";

const DesktopSortShareRow = ({
  sortBy,
  onSortChange,
  onShareClick,
  viewMode,
  onViewModeChange,
}) => {
  const sortOptions = [
    { value: "newest", label: "Date saved: Newest" },
    { value: "oldest", label: "Date saved: Oldest" },
    { value: "priceLowHigh", label: "Price: Low to High" },
    { value: "priceHighLow", label: "Price: High to Low" },
    { value: "designerAZ", label: "Designer A–Z" },
  ];

  const handleSortChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex].text;
    onSortChange(e.target.value);
    
    // Section 5.4: Toast appears: "Sorted by: [selected option label]"
    const toastEvent = new CustomEvent("showToast", {
      detail: { message: `Sorted by: ${selectedOption}` },
    });
    window.dispatchEvent(toastEvent);
  };

  return (
    <div className="desktop-sort-share-row">
      {/* Sort Dropdown */}
      <div className="desktop-sort-share-row__sort">
        <label className="desktop-sort-share-row__sort-label">SORT</label>
        <div className="desktop-sort-share-row__select-wrapper">
          <select
            className="desktop-sort-share-row__select"
            value={sortBy}
            onChange={handleSortChange}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="desktop-sort-share-row__chevron" />
        </div>
      </div>

      {/* Share Button */}
      <button
        className="desktop-sort-share-row__share"
        onClick={onShareClick}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="3" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9.5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="4.5" y1="7.5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4.5" y1="5.5" x2="8" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        SHARE
      </button>

      {/* View Toggle */}
      <DesktopViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
};

export default DesktopSortShareRow;