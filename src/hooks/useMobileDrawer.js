// src/hooks/useMobileDrawer.js
import { useState, useEffect, useRef, useCallback } from 'react';

const useMobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchCurrentX = useRef(null);
  const touchCurrentY = useRef(null);
  const activeSubPanelRef = useRef(null);

  // 12.1 openDrawer()
  const openDrawer = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // 12.2 closeDrawer()
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
    // Also close any open sub-panel
    if (activeSubPanelRef.current) {
      activeSubPanelRef.current = null;
    }
  }, []);

  // Set active sub-panel (for swipe detection)
  const setActiveSubPanel = useCallback((panelId) => {
    activeSubPanelRef.current = panelId;
  }, []);

  const clearActiveSubPanel = useCallback(() => {
    activeSubPanelRef.current = null;
  }, []);

  // 12.7 Swipe Gestures
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((onSubPanelClose, onDrawerClose) => {
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
    if (activeSubPanelRef.current && dx > 60) {
      if (onSubPanelClose) onSubPanelClose();
      clearActiveSubPanel();
    }
    // Case 2: No sub-panel - swipe left (dx < -60px) = close drawer
    else if (!activeSubPanelRef.current && dx < -60) {
      if (onDrawerClose) onDrawerClose();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  }, [clearActiveSubPanel]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    setActiveSubPanel,
    clearActiveSubPanel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useMobileDrawer;