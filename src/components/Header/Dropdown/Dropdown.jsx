import DropdownRent from "./DropdownRent";
import DropdownBuyPreloved from "./DropdownBuyPreloved";
import DropdownBuyNew from "./DropdownBuyNew";
import DropdownWomen from "./DropdownWomen";
import DropdownMen from "./DropdownMen";
import DropdownOccasions from "./DropdownOccasions";
import DropdownDesigners from "./DropdownDesigners";

const Dropdown = ({
  activeDropdown,
  inDropdown,
  scheduleClose,
}) => {
  if (!activeDropdown) return null;

  const renderDropdown = () => {
    switch (activeDropdown) {
      case "rent":
        return <DropdownRent />;

      case "preloved":
        return <DropdownBuyPreloved />;

      case "new":
        return <DropdownBuyNew />;

      case "women":
        return <DropdownWomen />;

      case "men":
        return <DropdownMen />;

      case "occasions":
        return <DropdownOccasions />;

      case "designers":
        return <DropdownDesigners />;

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