// src/components/Header/mobile/MobileBar.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWishlistStore from '../../../store/wishlistStore';
import useCartStore from '../../../store/cartStore';
import '../../../styles/Header/mobile/mobile-bar.css';

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "1.8" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BrowseIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const WishlistIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "1.8" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BagIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const AccountIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SparkleIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function MobileBar({ mobileSettings, bagCartLabel = "Cart" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const cartItems = useCartStore((state) => state.items);
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const tabs = Array.isArray(mobileSettings?.tabs) && mobileSettings.tabs.length > 0
    ? mobileSettings.tabs.filter((t) => t.shown !== false)
    : [];

  if (tabs.length === 0) return null;

  const isTabActive = (tab) => {
    const currentPath = location.pathname.toLowerCase();
    const tabPath = (tab.path || "/").toLowerCase();
    if (tabPath === "/" || tabPath === "") {
      return currentPath === "/";
    }
    if (currentPath === tabPath) return true;
    if (tabPath !== "/" && currentPath.startsWith(tabPath)) return true;
    if (tab.isBagTab && (currentPath === "/cart" || currentPath === "/checkout")) return true;
    if ((tab.label?.toLowerCase() === "account" || tab.id === "mtab-5") && (currentPath === "/profile" || currentPath === "/account" || currentPath === "/auth")) return true;
    if ((tab.label?.toLowerCase() === "browse" || tab.id === "mtab-2") && (currentPath.includes("rent") || currentPath === "/main-page")) return true;
    return false;
  };

  const getTabIcon = (tab, active) => {
    const label = (tab.label || "").toLowerCase();
    const path = (tab.path || "").toLowerCase();
    const id = (tab.id || "").toLowerCase();

    if (tab.isBagTab || label === "bag" || label === "cart" || path.includes("/cart") || id.includes("bag")) {
      return <BagIcon active={active} />;
    }
    if (label.includes("home") || path === "/" || id.includes("home") || id === "mtab-1") {
      return <HomeIcon active={active} />;
    }
    if (label.includes("browse") || path.includes("rent") || path.includes("main-page") || id === "mtab-2") {
      return <BrowseIcon active={active} />;
    }
    if (label.includes("wishlist") || path.includes("wishlist") || id === "mtab-3") {
      return <WishlistIcon active={active} />;
    }
    if (label.includes("account") || label.includes("profile") || path.includes("profile") || path.includes("account") || id === "mtab-5") {
      return <AccountIcon active={active} />;
    }
    return <SparkleIcon active={active} />;
  };

  return (
    <nav className="hok-mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="hok-mobile-bottom-bar-inner">
        {tabs.map((tab) => {
          const active = isTabActive(tab);
          const isBag = tab.isBagTab || tab.label?.toLowerCase() === "bag" || tab.label?.toLowerCase() === "cart";
          const isWishlist = tab.label?.toLowerCase() === "wishlist" || (tab.path || "").includes("wishlist");
          const displayLabel = tab.isBagTab ? bagCartLabel : tab.label;

          return (
            <button
              key={tab.id}
              type="button"
              className={`hok-mobile-bar-tab ${active ? "active" : ""}`}
              onClick={() => {
                const targetPath = tab.isBagTab ? "/cart" : tab.path || "/";
                navigate(targetPath);
              }}
              aria-label={displayLabel}
              aria-current={active ? "page" : undefined}
            >
              <div className="hok-mobile-bar-icon-wrap">
                {getTabIcon(tab, active)}
                {isWishlist && wishlistCount > 0 && (
                  <span className="hok-mobile-bar-badge">{wishlistCount}</span>
                )}
                {isBag && cartCount > 0 && (
                  <span className="hok-mobile-bar-badge">{cartCount}</span>
                )}
              </div>
              <span className="hok-mobile-bar-label">{displayLabel}</span>
              {active && <span className="hok-mobile-bar-active-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
