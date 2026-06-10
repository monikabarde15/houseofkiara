import { useState, useRef } from "react";
import "../../styles/Header/mobile-menu.css";

const menuSections = [
  {
    title: "Rent",
    items: [
      "Women",
      "Men",
      "Occasions",
      "Designers",
    ],
  },
  {
    title: "Buy Preloved",
    items: [
      "Women",
      "Men",
      "Occasions",
      "Designers",
    ],
  },
  {
    title: "Buy New",
    items: [
      "Women",
      "Men",
      "Occasions",
      "Designers",
    ],
  },
];

const supportLinks = [
  "How It Works",
  "Sell With Us",
  "Contact Us",
];

export default function MobileMenu({
  isOpen,
  onClose,
}) {
  const [openSection, setOpenSection] = useState(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const toggleSection = (section) => {
    setOpenSection(
      openSection === section
        ? null
        : section
    );
  };

  // Touch Handlers
  const handleTouchStart = (e) => {
    touchStartX.current =
      e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current =
      e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance =
      touchStartX.current -
      touchEndX.current;

    if (distance > 80) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}

      <div
        className={`hok-mobile-menu-overlay ${isOpen ? "active" : ""
          }`}
        onClick={onClose}
      />

      {/* Drawer */}

      <aside
        className={`hok-mobile-menu ${isOpen ? "active" : ""
          }`}
        onTouchStart={
          handleTouchStart
        }
        onTouchMove={
          handleTouchMove
        }
        onTouchEnd={
          handleTouchEnd
        }
      >
        {/* Header */}

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

        {/* Navigation */}

        <div className="hok-mobile-menu-section">
          <div className="hok-mobile-menu-heading">
            Shop
          </div>

          {menuSections.map(
            (section) => (
              <div
                key={section.title}
                className="hok-mobile-accordion"
              >
                <button
                  className="hok-mobile-menu-link"
                  onClick={() =>
                    toggleSection(
                      section.title
                    )
                  }
                >
                  {section.title}

                  <span>
                    {openSection ===
                      section.title
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {openSection ===
                  section.title && (
                    <div className="hok-mobile-submenu">
                      {section.items.map(
                        (item) => (
                          <a
                            key={item}
                            href="#"
                          >
                            {item}
                          </a>
                        )
                      )}
                    </div>
                  )}
              </div>
            )
          )}
        </div>

        {/* Support */}

        <div className="hok-mobile-menu-section">
          <div className="hok-mobile-menu-heading">
            Support
          </div>

          {supportLinks.map(
            (item) => (
              <button
                key={item}
                className="hok-mobile-menu-link"
              >
                {item}

                <span>→</span>
              </button>
            )
          )}
        </div>
      </aside>
    </>
  );
}