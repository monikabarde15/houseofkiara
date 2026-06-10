// src\components\Header\MobileHeader.jsx
import React from 'react';
import '../../styles/Header/mobile-header.css';
import logo from '../../assets/logo/logo.png';

import { useState } from "react";
import MobileMenu from "./MobileMenu";


export default function MobileHeader({ theme = 'light', onMenuOpen, onSearchOpen, onBagClick, onAccountClick }) {
  // Theme-based colors
  const isDark = theme === 'dark';

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={`hok-mobile-header ${isDark ? 'dark' : 'light'}`}>
        {/* Left: Hamburger Menu */}
        <button
          className="hok-mob-burger"
          onClick={() =>
            setMenuOpen(true)
          }
          aria-label="Open Menu"
        >
          <span className="hok-mob-burger-line"></span>
          <span className="hok-mob-burger-line"></span>
          <span className="hok-mob-burger-line"></span>
        </button>

        {/* Center: Logo */}
        <div className="hok-mob-logo" onClick={() => window.location.href = '/'}>
          <img
            className="hok-mob-logo-img"
            src={logo}
            alt="HOK Monogram"
          />
          <span className="hok-mob-logo-text">HOUSE OF KAIRA</span>
        </div>

        {/* Right: Icons (Search + Bag + Account) - Wishlist hidden on mobile per spec */}
        <div className="hok-mob-icons">
          {/* Search Icon */}
          <button className="hok-mob-icon-btn" onClick={onSearchOpen} aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="20" y2="20" />
            </svg>
          </button>

          {/* Bag Button with Cart Dot */}
          <div className="hok-mob-cart-wrap">
            <button className="hok-mob-icon-btn" onClick={onBagClick} aria-label="Shopping bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            <div className="hok-mob-cart-dot"></div>
          </div>

          {/* Account Icon */}
          <button className="hok-mob-icon-btn" onClick={onAccountClick} aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu
        isOpen={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />
    </>
  );
}