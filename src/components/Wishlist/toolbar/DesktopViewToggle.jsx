import "../../../styles/wishlist/toolbar/desktop-view-toggle.css";

const DesktopViewToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="desktop-view-toggle">
      <button
        className={`desktop-view-toggle__button ${
          viewMode === "grid" ? "desktop-view-toggle__button--active" : ""
        }`}
        onClick={() => onViewModeChange("grid")}
        aria-label="Grid view"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="0.5" y="0.5" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
          <rect x="7.5" y="0.5" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
          <rect x="0.5" y="7.5" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
          <rect x="7.5" y="7.5" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button
        className={`desktop-view-toggle__button ${
          viewMode === "list" ? "desktop-view-toggle__button--active" : ""
        }`}
        onClick={() => onViewModeChange("list")}
        aria-label="List view"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <line x1="0.5" y1="2" x2="11.5" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0.5" y1="6" x2="11.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0.5" y1="10" x2="11.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default DesktopViewToggle;