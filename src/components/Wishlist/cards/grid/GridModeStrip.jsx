import "../../../../styles/wishlist/cards/grid/grid-mode-strip.css";
const GridModeStrip = ({ type, product }) => {
  const getModeStripClass = () => {
    if (type === "rent") return "desk-wishlist-mode-strip-rent";
    if (type === "preloved") return "desk-wishlist-mode-strip-preloved";
    if (type === "new") return "desk-wishlist-mode-strip-new";
  };

  const getModeStripText = () => {
    if (type === "rent") return "RENT";
    if (type === "preloved") return "PRELOVED";
    if (type === "new") return "BUY NEW";
  };

  const getModeStripTextColor = () => {
    if (type === "rent") return "rgba(232,213,176,0.75)";
    if (type === "preloved") return "#B85C38";
    if (type === "new") return "#6B7E5A";
  };

  return (
    <div className={`desk-wishlist-mode-strip ${getModeStripClass()}`}>
      <span className="desk-wishlist-mode-strip-text" style={{ color: getModeStripTextColor() }}>
        {getModeStripText()}
        {product.stripTag && <> · {product.stripTag}</>}
      </span>
    </div>
  );
};

export default GridModeStrip;