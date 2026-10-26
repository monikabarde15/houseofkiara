import '../../../../styles/wishlist/mobile/toolbar/mobile-tab-strip.css';

const MobileTabStrip = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'rent', label: 'Rent', count: tabCounts.rent },
    { id: 'preloved', label: 'Preloved', count: tabCounts.preloved },
    { id: 'new', label: 'Buy New', count: tabCounts.new }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="wishlist-mobile-tab-strip">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`wishlist-mobile-tab-strip__tab ${activeTab === tab.id ? 'wishlist-mobile-tab-strip__tab--active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className="wishlist-mobile-tab-strip__label">{tab.label}</span>
          <span className={`wishlist-mobile-tab-strip__badge ${activeTab === tab.id ? 'wishlist-mobile-tab-strip__badge--active' : ''}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MobileTabStrip;