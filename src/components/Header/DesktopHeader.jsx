// src\components\Header\DesktopHeader.jsx
import logo from "../../assets/logo/logo.png";
import "../../styles/Header/desktop-header.css";

const DesktopHeader = ({ onSearchOpen }) => {
  return (
    <header className="hok-header">
      <div className="hok-header-inner">

        {/* Left */}
        <div className="header-left">
          <div
            className="header-search"
            id="header-search-trigger"
            role="search"
            onClick={onSearchOpen}
          >
            <svg
              viewBox="0 0 24 24"
              className="header-search-icon"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="20" y2="20" />
            </svg>

            <span className="header-search-placeholder">
              Search lehengas, designers, occasions...
            </span>
          </div>
        </div>

        {/* Center Logo */}
        <div
          className="header-logo"
          role="button"
          tabIndex={0}
          aria-label="House of Kaira — home"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="House of Kaira"
            className="logo-img"
          />

          <span className="logo-wordmark">
            House of Kaira
          </span>
        </div>

        {/* Right */}
        <div className="header-right">

          <button
            className="hdr-btn"
            aria-label="Wishlist"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>

            <span>Wishlist</span>
          </button>

          <button
            className="hdr-btn cart-wrap"
            aria-label="Bag"
          >
            <span className="cart-dot" />

            <svg viewBox="0 0 24 24">
              <path d="M6 2h12l3 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6l3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            <span>Bag</span>
          </button>

          <button
            className="hdr-btn"
            aria-label="Account"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            </svg>

            <span>Account</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;