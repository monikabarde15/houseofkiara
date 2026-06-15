// src/components/Header/mobile/MobileSubPanel.jsx
import React, { useRef } from 'react';
import '../../../styles/Header/mobile/mobile-drawer.css';

const MobileSubPanel = ({ 
  isOpen, 
  title, 
  titleColor = 'default',
  onBack, 
  onSwipeBack,
  children 
}) => {
  const panelRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchCurrentX = useRef(null);
  const touchCurrentY = useRef(null);

  // 12.7 Swipe Gestures for sub-panel
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
    
    // Swipe right to go back (dx > 60px, dy < 40px per spec)
    if (dx > 60 && dy < 40) {
      if (onSwipeBack) onSwipeBack();
      if (onBack) onBack();
    }
    
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <div
      ref={panelRef}
      className={`drawer-sub-panel ${isOpen ? 'open' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 8.2 Sub-Panel Header */}
      <div className="sub-panel-head">
        {/* 8.3 Back Button */}
        <button 
          className="sub-panel-back" 
          onClick={onBack}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* 8.4 Sub-Panel Title */}
        <span className={`sub-panel-title ${titleColor}`}>{title}</span>
      </div>

      {/* 8.5 Sub-Panel Body */}
      <div className="sub-panel-body">
        {children}
      </div>
    </div>
  );
};

export default MobileSubPanel;