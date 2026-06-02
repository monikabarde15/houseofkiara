import "../../../styles/wishlist/toolbar/desktop-tab-strip.css";

const DesktopTabStrip = ({ activeTab, onTabChange, tabCounts }) => {
  const tabs = [
    { id: "all", label: "All", count: tabCounts?.all || 0 },
    { id: "rent", label: "Rent", count: tabCounts?.rent || 0 },
    { id: "preloved", label: "Buy Preloved", count: tabCounts?.preloved || 0 },
    { id: "new", label: "Buy New", count: tabCounts?.new || 0 },
  ];

  return (
    <div className="desktop-tab-strip">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`desktop-tab-strip__button ${
            activeTab === tab.id ? "desktop-tab-strip__button--active" : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="desktop-tab-strip__label">{tab.label}</span>
          <span
            className={`desktop-tab-strip__badge ${
              activeTab === tab.id ? "desktop-tab-strip__badge--active" : ""
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DesktopTabStrip;