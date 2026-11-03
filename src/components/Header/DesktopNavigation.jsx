// src/components/Header/DesktopNavigation.jsx
import "../../styles/Header/desktop-navigation.css";
import { navigationItems as defaultNavigationItems } from "../../data/navigationData";
import { useNavigate } from "react-router-dom";
import { resolveDropdownId, resolveItemStyle } from "../../services/headerApi";

const DesktopNavigation = ({
  activeDropdown,
  openDropdown,
  navItems,
}) => {
  const navigate = useNavigate();
  const rawItems = Array.isArray(navItems) && navItems.length > 0 ? navItems : defaultNavigationItems;
  const items = rawItems.filter((item) => item.shown !== false);

  return (
    <nav
      className="hok-navigation"
      aria-label="Main navigation"
    >
      <div className="nav-inner">
        {items.map((item) => {
          const dropdownId = resolveDropdownId(item);
          const hasDropdown = (item.hasMenu !== false && item.menuEnabled !== false && !!dropdownId) || (!!item.dropdown && !!dropdownId);
          const itemStyle = resolveItemStyle(item);
          const isCurrentDropdown = !!dropdownId && activeDropdown === dropdownId;
          const targetRoute = item.link || item.route;

          return (
            <div
              key={item.id}
              className={`nav-group ${isCurrentDropdown ? "dd-open" : ""}`}
              onMouseEnter={() => {
                if (hasDropdown && dropdownId) {
                  openDropdown(dropdownId);
                }
              }}
            >
              <button
                className={`nav-item ${itemStyle}`}
                onClick={() => {
                  if (!hasDropdown && targetRoute) {
                    navigate(targetRoute);
                  }
                }}
              >
                {item.label}

                {hasDropdown && (
                  <svg
                    className="nav-chev"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}

                {item.badge && (
                  <span className="nav-pill">
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
