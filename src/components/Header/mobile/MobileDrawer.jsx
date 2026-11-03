import { resolveDropdownId, resolveItemStyle } from '../../../services/headerApi';
// src/components/Header/mobile/MobileDrawer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Header/mobile/mobile-drawer.css';
import logo from '../../../assets/logo/logo.png';
import MobileSubPanel from './MobileSubPanel';
import SubPanelRenderer from './SubPanelRenderer';

const MobileDrawer = ({ 
  isOpen, 
  onClose,
  onSearchOpen,
  navItems,
  searchPlaceholder,
  mobileSettings,
  brandSettings,
}) => {
  const showSearchField = mobileSettings?.drawer?.showSearchField !== false;
  const showModeShortcuts = mobileSettings?.drawer?.showModeShortcuts !== false;
  const itemVisibility = mobileSettings?.drawer?.itemVisibility || {};
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const [activeSubPanel, setActiveSubPanel] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchCurrentX = useRef(null);
  const touchCurrentY = useRef(null);

  // Body scroll lock when drawer is open (per spec 12.1)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Close any open sub-panel when drawer closes (per spec 12.2)
      setActiveSubPanel(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle search click - opens overlay and closes drawer
  const handleSearchClick = () => {
    onSearchOpen();
    onClose();
  };

  // Navigate and close drawer (per spec 12.5)
  const navigateAndClose = (path) => {
    onClose();
    setTimeout(() => {
      navigate(path);
    }, 280);
  };

  // Mode pill handlers (per spec 6.3)
  const handleRentClick = () => {
    navigateAndClose('/main-page?section=rent');
  };

  const handlePrelovedClick = () => {
    navigateAndClose('/main-page?section=preloved');
  };

  const handleNewClick = () => {
    navigateAndClose('/main-page?section=new');
  };

  // 12.3 openSubPanel - removes .open from all, adds to target
  const openSubPanel = (panelId) => {
    setActiveSubPanel(panelId);
  };

  // 12.4 closeSubPanel
  const closeSubPanel = () => {
    setActiveSubPanel(null);
  };

  // 12.7 Swipe Gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchCurrentX.current === null) return;
    
    const dx = touchCurrentX.current - touchStartX.current;
    const dy = Math.abs(touchCurrentY.current - touchStartY.current);
    const isHorizontalSwipe = dy < 40;

    if (!isHorizontalSwipe) {
      touchStartX.current = null;
      touchCurrentX.current = null;
      return;
    }

    // Case 1: Sub-panel open - swipe right (dx > 60px) = go back
    if (activeSubPanel && dx > 60) {
      closeSubPanel();
    }
    // Case 2: No sub-panel - swipe left (dx < -60px) = close drawer
    else if (!activeSubPanel && dx < -60) {
      onClose();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <>
      {/* Section 4: Drawer Overlay (Scrim) */}
      <div 
        id="drawer-overlay"
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Section 5: Navigation Drawer Container */}
      <aside
        id="nav-drawer"
        ref={drawerRef}
        className={`nav-drawer ${isOpen ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 5.2 Drawer Header Zone */}
        <div className="drawer-head">
          <div className="drawer-logo">
            <img className="drawer-logo-img" src={logo} alt="House of Kaira" />
            <span className="drawer-logo-name">HOUSE OF KAIRA</span>
          </div>
          <button 
            className="drawer-close" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        {/* 5.3 Drawer Search Bar */}
        {showSearchField && (
        <div className="drawer-search" onClick={handleSearchClick}>
          <svg className="drawer-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="20" y2="20" />
          </svg>
          <input
            type="text"
            className="drawer-search-input"
            placeholder={searchPlaceholder || "Search designers, occasions..."}
            readOnly
            aria-label="Search"
          />
        </div>
        )}

        {/* 5.4 Drawer Body - MAIN MENU CONTENT */}
        <div className="drawer-body">
          {/* Section 6: Mode Pills */}
          {showModeShortcuts && (
          <div className="drawer-mode-pills">
            <button 
              className="mode-pill mode-pill--rent"
              onClick={handleRentClick}
            >
              Rent
            </button>
            <button 
              className="mode-pill mode-pill--preloved"
              onClick={handlePrelovedClick}
            >
              Buy Preloved
            </button>
            <button 
              className="mode-pill mode-pill--new"
              onClick={handleNewClick}
            >
              Buy New
            </button>
          </div>
          )}

          {/* Section 7 & 11: Dynamic Navigation Rows & Standalone Links */}
          {(() => {
            const hasCustomNav = Array.isArray(navItems) && navItems.length > 0;
            if (!hasCustomNav) {
              return (
                <>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-rent')}>
                      <span className="drawer-section-label accent">Rent</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-preloved')}>
                      <span className="drawer-section-label">Buy Preloved</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-new')}>
                      <span className="drawer-section-label green">Buy New</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-women')}>
                      <span className="drawer-section-label">Women</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-men')}>
                      <span className="drawer-section-label">Men</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-occasions')}>
                      <span className="drawer-section-label">Occasions</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-section">
                    <button className="drawer-section-head" onClick={() => openSubPanel('sub-designers')}>
                      <span className="drawer-section-label">Designers</span>
                      <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="drawer-standalone">
                    <button className="drawer-section-head" onClick={() => navigateAndClose('/profile')}>
                      <span className="drawer-section-label">My Profile</span>
                    </button>
                  </div>
                  <div className="drawer-standalone">
                    <button className="drawer-section-head" onClick={() => navigateAndClose('/main-page?section=new')}>
                      <span className="drawer-section-label">
                        New Arrivals
                        <span className="drawer-pill-new">New</span>
                      </span>
                    </button>
                  </div>
                  <div className="drawer-standalone">
                    <button className="drawer-section-head" onClick={() => navigateAndClose('/list-your-piece')}>
                      <span className="drawer-section-label green">List Your Piece</span>
                    </button>
                  </div>
                </>
              );
            }

            const visibleItems = navItems.filter(
              (i) => i.shown !== false && itemVisibility[i.id] !== false
            );
            return (
              <>
                {visibleItems.map((item) => {
                  const dropdownId = resolveDropdownId(item);
                  const hasMenu = (item.hasMenu !== false && item.menuEnabled !== false && !!dropdownId) || (!!item.dropdown && !!dropdownId);
                  const itemStyle = resolveItemStyle(item);
                  const targetRoute = item.link || item.route || '/';

                  if (hasMenu && dropdownId) {
                    return (
                      <div key={item.id} className="drawer-section">
                        <button className="drawer-section-head" onClick={() => openSubPanel(`sub-${dropdownId}`)}>
                          <span className={`drawer-section-label ${itemStyle}`}>{item.label}</span>
                          <svg className="drawer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9 6 15 12 9 18" />
                          </svg>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="drawer-standalone">
                      <button className="drawer-section-head" onClick={() => navigateAndClose(targetRoute)}>
                        <span className={`drawer-section-label ${itemStyle}`}>
                          {item.label}
                          {item.badge && <span className="drawer-pill-new">{item.badge}</span>}
                        </span>
                      </button>
                    </div>
                  );
                })}

                {/* Profile link for quick account navigation if not in nav items */}
                {!visibleItems.some((i) => (i.link || '').includes('/profile')) && (
                  <div className="drawer-standalone">
                    <button className="drawer-section-head" onClick={() => navigateAndClose('/profile')}>
                      <span className="drawer-section-label">My Profile</span>
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Section 11.4: Drawer Footer */}
        <div className="drawer-footer">
          <div className="drawer-footer-brand">
            {brandSettings?.siteName || "House of Kaira"} - {brandSettings?.tagline || "Circular Luxury Fashion"}
          </div>
          <div className="drawer-footer-links">
            <a onClick={() => navigateAndClose('/main-page?section=rent')}>Rent</a>
            <a onClick={() => navigateAndClose('/main-page?section=preloved')}>Preloved</a>
            <a onClick={() => navigateAndClose('/main-page?section=new')}>Buy New</a>
            <a onClick={() => navigateAndClose('/list-your-piece')}>List Your Piece</a>
          </div>
        </div>

        {/* ========================================== */}
        {/* SECTION 8: SUB-PANELS - INSIDE THE DRAWER */}
        {/* Absolutely positioned relative to nav-drawer */}
        {/* ========================================== */}

        {/* Sub-Panel: Rent */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-rent'} 
          title="Rent" 
          titleColor="accent" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-rent" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

        {/* Sub-Panel: Buy Preloved */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-preloved'} 
          title="Buy Preloved" 
          titleColor="default" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-preloved" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

        {/* Sub-Panel: Buy New */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-new'} 
          title="Buy New" 
          titleColor="green" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-new" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

        {/* Sub-Panel: Women */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-women'} 
          title="Women" 
          titleColor="default" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-women" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

        {/* Sub-Panel: Men */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-men'} 
          title="Men" 
          titleColor="default" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-men" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

        {/* Sub-Panel: Occasions */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-occasions'} 
          title="Occasions" 
          titleColor="default" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-occasions" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

        {/* Sub-Panel: Designers */}
        <MobileSubPanel 
          isOpen={activeSubPanel === 'sub-designers'} 
          title="Designers" 
          titleColor="default" 
          onBack={closeSubPanel}
        >
          <SubPanelRenderer panelId="sub-designers" navigateAndClose={navigateAndClose} navItems={navItems} />
        </MobileSubPanel>

      </aside>
    </>
  );
};

export default MobileDrawer;