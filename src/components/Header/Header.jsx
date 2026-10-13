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
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import "../../styles/Header/header.css";

const Header = () => {
  const navigate = useNavigate();
  const dropdown = useDropdown();
  const search = useSearch();
  const theme = useHeaderTheme();

  // const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Drawer handlers
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Icon handlers
  const handleWishlistClick = () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      toast.error("Please login to view your wishlist");
      navigate("/auth");
      return;
    }
    navigate("/wishlist");
  };
  const handleBagClick = () => navigate("/cart");

  return (
    <>
      {/* ==================== DESKTOP ==================== */}
      {/* Desktop */}
      <div className="desktop-only-announce">
        <AnnouncementBar />
      </div>

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

        {/* Desktop Dropdown */}
        <Dropdown
          activeDropdown={dropdown.activeDropdown}
          inDropdown={dropdown.inDropdown}
          scheduleClose={dropdown.scheduleClose}
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
      />

      {/* Sections 4 & 5: Drawer Overlay + Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onSearchOpen={search.openSearch}
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
