import { getHeaderSettings, defaultHeaderConfig } from "../../services/headerApi";
// src/components/Header/Header.jsx
import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
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
import "../../styles/Header/header.css";

const Header = () => {
  const navigate = useNavigate();
  const dropdown = useDropdown();
  const search = useSearch();
  const theme = useHeaderTheme();
  const [headerSettings, setHeaderSettings] = useState(defaultHeaderConfig);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async (forceRefresh = false) => {
      try {
        const data = await getHeaderSettings(forceRefresh);
        if (isMounted && data) {
          setHeaderSettings(data);
        }
      } catch (err) {
        console.warn("Failed to load header settings:", err);
      }
    };
    loadSettings();
    const handleUpdate = () => loadSettings(true);
    window.addEventListener("hok_header_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("hok_header_updated", handleUpdate);
    };
  }, []);

  // Handle scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 0);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // Drawer handlers
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Icon handlers
  const handleWishlistClick = () => navigate("/wishlist");
  const handleBagClick = () => navigate("/cart");

  return (
    <>
      {/* ==================== DESKTOP ==================== */}
      {/* Desktop */}
      <div className="desktop-only-announce">
      <AnnouncementBar/>
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
          // isScrolled={isScrolled}
          isMenuOpen={isDrawerOpen}
          onMenuOpen={handleDrawerOpen}
          onSearchOpen={search.openSearch}
          onWishlistClick={handleWishlistClick}
          onBagClick={handleBagClick}
          bagCartLabel={headerSettings.bagCartLabel}
        />

      {/* Sections 4 & 5: Drawer Overlay + Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onSearchOpen={search.openSearch}
        navItems={headerSettings.navItems}
        searchPlaceholder={headerSettings.searchPlaceholder}
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
        trendingSearches={search.trendingSearches}
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
