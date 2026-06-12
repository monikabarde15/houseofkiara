// src\hooks\useDropdown.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
const CLOSE_DELAY = 80;

export const useDropdown = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const closeTimer = useRef(null);

  const inHeader = useRef(false);
  const inDropdown = useRef(false);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openDropdown = useCallback((id) => {
    clearCloseTimer();
    setActiveDropdown(id);
  }, []);

  const closeDropdown = useCallback(() => {
    clearCloseTimer();
    setActiveDropdown(null);
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();

    closeTimer.current = setTimeout(() => {
      if (
        !inHeader.current &&
        !inDropdown.current
      ) {
        setActiveDropdown(null);
      }
    }, CLOSE_DELAY);
  }, []);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeDropdown();
      }
    };

    window.addEventListener(
      "keydown",
      escHandler
    );

    return () => {
      window.removeEventListener(
        "keydown",
        escHandler
      );
    };
  }, [closeDropdown]);

  useEffect(() => {
  setActiveDropdown(null);

  inHeader.current = false;
  inDropdown.current = false;

  clearCloseTimer();
}, [location.pathname, location.search]);

  return {
    activeDropdown,

    openDropdown,
    closeDropdown,

    scheduleClose,

    inHeader,
    inDropdown,
  };
};