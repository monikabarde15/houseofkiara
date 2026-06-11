// src\components\Header\Header.jsx
import { useDropdown } from "../../hooks/useDropdown";
import { useSearch } from "../../hooks/useSearch";
import { useEffect, useState } from "react";


import AnnouncementBar from "./AnnouncementBar";
import DesktopHeader from "./DesktopHeader";
import DesktopNavigation from "./DesktopNavigation";
import Dropdown from "./Dropdown/Dropdown";
import SearchOverlay from "./Search/SearchOverlay";
import MobileHeader from "./MobileHeader";
import useHeaderTheme from "../../hooks/useHeaderTheme";
import "../../styles/Header/header.css";

const Header = () => {
  const dropdown = useDropdown();
  const search = useSearch();
  const theme = useHeaderTheme();


  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <>
      {/* Desktop Header */}

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
          <DesktopHeader
            onSearchOpen={search.openSearch}
          />

          <DesktopNavigation
            activeDropdown={
              dropdown.activeDropdown
            }
            openDropdown={
              dropdown.openDropdown
            }
          />
        </div>
      </div>

      {/* Mobile Header */}

      {/* Mobile Header */}

      <div className="hok-header-mobile-wrapper">
        <AnnouncementBar />

        <div className="hok-header-mobile">
          <MobileHeader
            theme={theme}
            isScrolled={isScrolled}
            onSearchOpen={search.openSearch}
          />
        </div>
      </div>

      <Dropdown
        activeDropdown={
          dropdown.activeDropdown
        }
        inDropdown={
          dropdown.inDropdown
        }
        scheduleClose={
          dropdown.scheduleClose
        }
      />

      <SearchOverlay
        isOpen={search.isOpen}
        query={search.query}
        results={search.results}
        suggestions={
          search.suggestions
        }
        highlightedIndex={
          search.highlightedIndex
        }
        showResults={
          search.showResults
        }
        setQuery={
          search.setQuery
        }
        setHighlightedIndex={
          search.setHighlightedIndex
        }
        closeSearch={
          search.closeSearch
        }
        runSearch={
          search.runSearch
        }
        viewFullCollection={
          search.viewFullCollection
        }
      />
    </>
  );
};

export default Header;