// src\components\Header\DesktopNavigation.jsx
import "../../styles/Header/desktop-navigation.css";
import { navigationItems } from "../../data/navigationData";
import { useNavigate } from "react-router-dom";

const DesktopNavigation = ({
  activeDropdown,
  openDropdown,
}) => {

  const navigate = useNavigate();
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
            // onMouseEnter={() =>
            //   openDropdown(item.id)
            // }
            onMouseEnter={() => {
              if (!item.standalone) {
                openDropdown(item.id);
              }
            }}
          >
            <button
              className={`nav-item ${item.variant || ""
                }`}
              onClick={() => {
                if (
                  item.standalone &&
                  item.route
                ) {
                  navigate(item.route);
                }
              }}
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