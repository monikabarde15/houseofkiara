// src\components\Header\MobileMenu.jsx
import { useState, useRef } from "react";

import { navigationItems } from "../../data/navigationData";
import { dropdownData } from "../../data/dropdownData";

import "../../styles/Header/mobile-menu.css";

export default function MobileMenu({
  isOpen,
  onClose,
}) {
  const [openSection, setOpenSection] =
    useState(null);


  const toggleSection = (sectionId) => {
    setOpenSection((prev) =>
      prev === sectionId ? null : sectionId
    );
  };

  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchCurrentX.current === null
    ) {
      return;
    }

    const swipeDistance =
      touchStartX.current -
      touchCurrentX.current;

    if (swipeDistance > 80) {
      onClose();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const getAccordionLinks = (itemId) => {
    const data =
      dropdownData[itemId] ||
      dropdownData[
      itemId === "preloved"
        ? "buyPreloved"
        : itemId === "new"
          ? "buyNew"
          : itemId
      ];

    if (!data) return [];

    return (
      data.categories ||
      data.designers?.map(
        (designer) => designer.label
      ) ||
      data.occasions ||
      data.modes ||
      []
    );
  };

  const accordionItems =
    navigationItems.filter(
      (item) => item.dropdown
    );

  const standaloneItems =
    navigationItems.filter(
      (item) => item.standalone
    );

  return (
    <>
      <div
        className={`hok-mobile-menu-overlay ${isOpen ? "active" : ""
          }`}
        onClick={onClose}
      />

      <aside
        className={`hok-mobile-menu ${isOpen ? "active" : ""
          }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="hok-mobile-menu-header">
          <h2 className="hok-mobile-menu-title">
            Menu
          </h2>

          <button
            className="hok-mobile-menu-close"
            onClick={onClose}
            aria-label="Close Menu"
          >
            ×
          </button>
        </div>

        <div className="hok-mobile-menu-section">
          <div className="hok-mobile-menu-heading">
            Shop
          </div>

          {accordionItems.map((item) => {
            const links =
              getAccordionLinks(item.id);

            return (
              <div
                key={item.id}
                className="hok-mobile-accordion"
              >
                <button
                  className="hok-mobile-menu-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSection(item.id);
                  }}
                >
                  {item.label}

                  <span>
                    {openSection === item.id
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {openSection === item.id &&
                  links.length > 0 && (
                    <div className="hok-mobile-submenu">
                      {links.map((link) => (
                        <a
                          href="/"
                          key={link}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        <div className="hok-mobile-menu-section">
          <div className="hok-mobile-menu-heading">
            Quick Links
          </div>

          {standaloneItems.map((item) => (
            <button
              key={item.id}
              className="hok-mobile-menu-link"
            >
              {item.label}

              <span>→</span>
            </button>
          ))}

          <button className="hok-mobile-menu-link">
            Contact Us
            <span>→</span>
          </button>
        </div>
      </aside>
    </>
  );
}