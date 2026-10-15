// src/components/Header/mobile/MobileHeader.jsx
import React from 'react';
import '../../../styles/Header/mobile/mobile-header.css';
import logo from '../../../assets/logo/logo.png';

const MobileHeader = ({ 
  theme = 'light',
  isScrolled = false,
  isMenuOpen = false,
  onMenuOpen, 
  onSearchOpen, 
  onWishlistClick, 
  onBagClick 
}) => {
  const isDark = theme === 'dark';

  return (
    <header 
      className={`hok-mobile-header ${isDark ? 'dark' : 'light'} ${
        isScrolled ? 'hok-mobile-header--scrolled' : ''
      }`}
    >
      <div className="hok-header-inner">
        {/* Burger Button */}
        <button
          id="burger"
          className={`burger-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={onMenuOpen}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
        </button>

        {/* Header Logo */}
        <div className="header-logo" onClick={() => window.location.href = '/'}>
          <img className="logo-img" src={logo} alt="House of Kaira" />
          <span className="logo-wordmark">HOUSE OF KAIRA</span>
        </div>

        {/* Header Icon Cluster */}
        <div className="header-icons">
          {/* Search */}
          <button className="hdr-btn" onClick={onSearchOpen} aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="20" y2="20" />
            </svg>
          </button>

          {/* Wishlist */}
          <button className="hdr-btn" onClick={onWishlistClick} aria-label="Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Cart */}
          <div className="cart-wrap">
            <button className="hdr-btn" onClick={onBagClick} aria-label="Shopping bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            <div className="cart-dot"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;