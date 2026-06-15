// src/components/Header/Header.jsx
import { useEffect, useState } from "react";
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

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <div className="hok-desktop-header-wrapper">
        <AnnouncementBar />
        <div
          className="hok-header-desktop"
          onMouseEnter={() => {
            dropdown.inHeader.current = true;
          }}
          onMouseLeave={() => {
            dropdown.inHeader.current = false;
            dropdown.scheduleClose();
          }}
        >
          <DesktopHeader onSearchOpen={search.openSearch} />
          <DesktopNavigation
            activeDropdown={dropdown.activeDropdown}
            openDropdown={dropdown.openDropdown}
          />
        </div>
      </div>

      {/* ==================== MOBILE ==================== */}
      <div className="hok-mobile-only">
        {/* Section 2: Announcement Bar */}
        <MobileAnnouncementBar />
        
        {/* Section 3: Sticky Header */}
        <MobileHeader
          theme={theme}
          isScrolled={isScrolled}
          isMenuOpen={isDrawerOpen}
          onMenuOpen={handleDrawerOpen}
          onSearchOpen={search.openSearch}
          onWishlistClick={handleWishlistClick}
          onBagClick={handleBagClick}
        />
      </div>

      {/* Sections 4 & 5: Drawer Overlay + Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onSearchOpen={search.openSearch}
      />

      {/* Desktop Dropdown */}
      <Dropdown
        activeDropdown={dropdown.activeDropdown}
        inDropdown={dropdown.inDropdown}
        scheduleClose={dropdown.scheduleClose}
      />

      {/* Search Overlay - Shared between desktop and mobile */}
      <SearchOverlay
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