// src/components/Header/Dropdown/Dropdown.jsx
import DropdownRent from "./DropdownRent";
import DropdownBuyPreloved from "./DropdownBuyPreloved";
import DropdownBuyNew from "./DropdownBuyNew";
import DropdownWomen from "./DropdownWomen";
import DropdownMen from "./DropdownMen";
import DropdownOccasions from "./DropdownOccasions";
import DropdownDesigners from "./DropdownDesigners";
import { resolveDropdownId } from "../../../services/headerApi";

const Dropdown = ({
  activeDropdown,
  inDropdown,
  scheduleClose,
  navItems,
}) => {
  if (!activeDropdown) return null;

  // Find matching navItem from CMS header settings
  const activeNavItem = (navItems || []).find((item) => {
    return resolveDropdownId(item) === activeDropdown;
  });
  const menuColumns = activeNavItem?.menuColumns || [];

  const renderDropdown = () => {
    switch (activeDropdown) {
      case "rent":
        return <DropdownRent columns={menuColumns} />;

      case "preloved":
        return <DropdownBuyPreloved columns={menuColumns} />;

      case "new":
        return <DropdownBuyNew columns={menuColumns} />;

      case "women":
        return <DropdownWomen columns={menuColumns} />;

      case "men":
        return <DropdownMen columns={menuColumns} />;

      case "occasions":
        return <DropdownOccasions columns={menuColumns} />;

      case "designers":
        return <DropdownDesigners columns={menuColumns} />;

      default:
        return null;
    }
  };

  return (
    <div
      className="dropdown open"
      onMouseEnter={() => {
        inDropdown.current = true;
      }}
      onMouseLeave={() => {
        inDropdown.current = false;
        scheduleClose();
      }}
    >
      <div className="dropdown-inner">
        {renderDropdown()}
      </div>
    </div>
  );
};

export default Dropdown;
