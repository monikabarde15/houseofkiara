import React, { useRef, useEffect } from 'react';
import "../../../../styles/Profile/mobile/common/MobileTabStrip.css";

const MobileTabStrip = ({
  activeTab,
  onTabChange,
  onTabClick,
}) => {
  const tabs = [
    { id: "rentals", label: "Rentals" },
    { id: "purchases", label: "Purchases" },
    { id: "wishlist", label: "Saved", badge: "7", badgeClass: "red" },
    { id: "listed", label: "Listed", badge: "3", badgeClass: "gold" },
    { id: "addresses", label: "Addresses" },
    { id: "submissions", label: "Submissions" },
    { id: "settings", label: "Settings" },
    { id: "support", label: "Help" }
  ];

  const activeTabRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Scroll-spy: update active tab based on scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const sections = tabs.map((tab) =>
          document.getElementById(tab.id)
        );

        const scrollPosition = window.scrollY + 72;

        let currentSection = sections[0]?.id;

        for (let i = sections.length - 1; i >= 0; i--) {

          const section = sections[i];

          if (
            section &&
            section.offsetTop <= scrollPosition
          ) {
            currentSection = section.id;
            break;
          }
        }

        if (
          currentSection &&
          currentSection !== activeTab
        ) {
          onTabChange(currentSection);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [activeTab]);

  // Scroll active tab into view when it changes
  useEffect(() => {
  if (
    !scrollContainerRef.current ||
    !activeTabRef.current
  ) {
    return;
  }

  const container = scrollContainerRef.current;
  const activeTabEl = activeTabRef.current;

  const containerWidth = container.offsetWidth;

  const scrollLeft =
    activeTabEl.offsetLeft -
    containerWidth / 2 +
    activeTabEl.offsetWidth / 2;

  container.scrollTo({
    left: scrollLeft,
    behavior: "smooth"
  });
}, [activeTab]);

  return (
    <div className="profile-mobile-tab-strip" ref={scrollContainerRef}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={activeTab === tab.id ? activeTabRef : null}
          className={`profile-mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabClick(tab.id)}
        >
          <span>{tab.label}</span>
          {tab.badge && (
            <span className={`profile-mobile-tab-badge ${tab.badgeClass}`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default MobileTabStrip;