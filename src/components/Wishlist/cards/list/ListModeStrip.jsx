import "../../../../styles/wishlist/cards/list/list-mode-strip.css"

const ListModeStrip = ({ type, product }) => {
  const getModeStripClass = () => {
    if (type === "rent") return "desk-wishlist-list-mode-strip-rent";
    if (type === "preloved") return "desk-wishlist-list-mode-strip-preloved";
    return "desk-wishlist-list-mode-strip-new";
  };

  const getModeStripText = () => {
    if (type === "rent") return "RENT";
    if (type === "preloved") return "PRELOVED";
    return "BUY NEW";
  };

  const getModeStripTextColor = () => {
    if (type === "rent") return "rgba(232,213,176,0.75)";
    if (type === "preloved") return "#B85C38";
    return "#6B7E5A";
  };

  return (
    <div className={`desk-wishlist-list-mode-strip ${getModeStripClass()}`}>
      <span style={{ color: getModeStripTextColor() }}>
        {getModeStripText()}
      </span>
      {product.stripTag && (
        <span className="desk-wishlist-list-mode-strip-tag" style={{ color: getModeStripTextColor() }}>
          {product.stripTag}
        </span>
      )}
    </div>
  );
};

export default ListModeStrip;