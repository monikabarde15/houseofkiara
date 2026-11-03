// src/components/Header/Header.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeaderSettings, defaultHeaderConfig } from "../../services/headerApi";
import { getMobileSettings, defaultMobileConfig } from "../../services/mobileBarApi";
import { getBrandSettings, defaultBrandConfig, resolveAssetUrl } from "../../services/brandApi";
import logo from "../../assets/logo/logo.png";
import { useDropdown } from "../../hooks/useDropdown";
import { useSearch } from "../../hooks/useSearch";
import useHeaderTheme from "../../hooks/useHeaderTheme";
import AnnouncementBar from "./AnnouncementBar";
import DesktopHeader from "./DesktopHeader";
import DesktopNavigation from "./DesktopNavigation";
import Dropdown from "./Dropdown/Dropdown";
import SearchOverlay from "./Search/SearchOverlay";
import MobileAnnouncementBar from "./mobile/MobileAnnouncementBar";
import MobileHeader from "./mobile/MobileHeader";
import MobileDrawer from "./mobile/MobileDrawer";
import MobileBar from "./mobile/MobileBar";
import "../../styles/Header/header.css";

const Header = () => {
  const navigate = useNavigate();
  const dropdown = useDropdown();
  const search = useSearch();
  const theme = useHeaderTheme();
  const [headerSettings, setHeaderSettings] = useState(defaultHeaderConfig);
  const [mobileSettings, setMobileSettings] = useState(defaultMobileConfig);
  const [brandSettings, setBrandSettings] = useState(defaultBrandConfig);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadHeaderSettings = async (forceRefresh = false) => {
      try {
        const data = await getHeaderSettings(forceRefresh);
        if (isMounted && data) {
          setHeaderSettings(data);
        }
      } catch (err) {
        console.warn("Failed to load header settings:", err);
      }
    };

    const loadMobileSettings = async (forceRefresh = false) => {
      try {
        const data = await getMobileSettings(forceRefresh);
        if (isMounted && data) {
          setMobileSettings(data);
        }
      } catch (err) {
        console.warn("Failed to load mobile settings:", err);
      }
    };

    const loadBrandSettings = async (forceRefresh = false) => {
      try {
        const data = await getBrandSettings(forceRefresh);
        if (isMounted && data) {
          setBrandSettings(data);
        }
      } catch (err) {
        console.warn("Failed to load brand settings:", err);
      }
    };

    loadHeaderSettings();
    loadMobileSettings();
    loadBrandSettings();

    const handleHeaderUpdate = () => loadHeaderSettings(true);
    const handleMobileUpdate = () => loadMobileSettings(true);
    const handleBrandUpdate = () => loadBrandSettings(true);

    window.addEventListener("hok_header_updated", handleHeaderUpdate);
    window.addEventListener("hok_mobile_updated", handleMobileUpdate);
    window.addEventListener("hok_brand_updated", handleBrandUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("hok_header_updated", handleHeaderUpdate);
      window.removeEventListener("hok_mobile_updated", handleMobileUpdate);
      window.removeEventListener("hok_brand_updated", handleBrandUpdate);
    };
  }, []);

  // Drawer handlers
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Icon handlers
  const handleWishlistClick = () => navigate("/wishlist");
  const handleBagClick = () => navigate("/cart");

  return (
    <>
      {/* ==================== DESKTOP ==================== */}
      <div className="desktop-only-announce">
        <AnnouncementBar />
      </div>

      <div
        className="hok-header-desktop"
        style={headerSettings.stickyHeader === false ? { position: "relative" } : undefined}
        onMouseEnter={() => {
          dropdown.inHeader.current = true;
        }}
        onMouseLeave={() => {
          dropdown.inHeader.current = false;
          dropdown.scheduleClose();
        }}
      >
        <DesktopHeader
          onSearchOpen={search.openSearch}
          searchPlaceholder={headerSettings.searchPlaceholder}
          bagCartLabel={headerSettings.bagCartLabel}
          showTagline={headerSettings.showTagline}
          siteName={brandSettings?.siteName}
          logoUrl={resolveAssetUrl(brandSettings?.assets?.logoMark, logo)}
          wordmarkUrl={resolveAssetUrl(brandSettings?.assets?.wordmark)}
        />

        <DesktopNavigation
          activeDropdown={dropdown.activeDropdown}
          openDropdown={dropdown.openDropdown}
          navItems={headerSettings.navItems}
        />

        {/* Desktop Dropdown */}
        <Dropdown
          activeDropdown={dropdown.activeDropdown}
          inDropdown={dropdown.inDropdown}
          scheduleClose={dropdown.scheduleClose}
          navItems={headerSettings.navItems}
        />
      </div>

      {/* ==================== MOBILE ==================== */}
      <div className="hok-mobile-only">
        {/* Section 2: Announcement Bar */}
        <MobileAnnouncementBar />
      </div>

      {/* Section 3: Sticky Header */}
      <MobileHeader
        theme={theme}
        isMenuOpen={isDrawerOpen}
        onMenuOpen={handleDrawerOpen}
        onSearchOpen={search.openSearch}
        onWishlistClick={handleWishlistClick}
        onBagClick={handleBagClick}
        bagCartLabel={headerSettings.bagCartLabel}
        siteName={brandSettings?.siteName}
        logoUrl={resolveAssetUrl(brandSettings?.assets?.logoMark, logo)}
      />

      {/* Sections 4 & 5: Drawer Overlay + Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onSearchOpen={search.openSearch}
        navItems={headerSettings.navItems}
        searchPlaceholder={headerSettings.searchPlaceholder}
        mobileSettings={mobileSettings}
        brandSettings={brandSettings}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBar
        mobileSettings={mobileSettings}
        bagCartLabel={headerSettings.bagCartLabel}
      />

      {/* Search Overlay - Shared between desktop and mobile */}
      <SearchOverlay
        searchPlaceholder={headerSettings.searchPlaceholder}
        isOpen={search.isOpen}
        query={search.query}
        results={search.results}
        suggestions={search.suggestions}
        highlightedIndex={search.highlightedIndex}
        showResults={search.showResults}
        setQuery={search.setQuery}
        setHighlightedIndex={search.setHighlightedIndex}
        closeSearch={search.closeSearch}
        runSearch={search.runSearch}
        viewFullCollection={search.viewFullCollection}
      />
    </>
  );
};

export default Header;
