import "../../styles/Header/desktop-navigation.css";
import { navigationItems } from "../../data/navigationData";
const DesktopNavigation = ({
  activeDropdown,
  openDropdown,
}) => {
  return (
    <nav
      className="hok-navigation"
      aria-label="Main navigation"
    >
      <div className="nav-inner">

        {navigationItems.map((item) => (
          <div
            key={item.id}
            className={`nav-group ${
              activeDropdown === item.id
                ? "dd-open"
                : ""
            }`}
            onMouseEnter={() =>
              openDropdown(item.id)
            }
          >
            <button
              className={`nav-item ${
                item.variant || ""
              }`}
            >
              {item.label}

              {item.dropdown && (
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
        ))}

      </div>
    </nav>
  );
};

export default DesktopNavigation;