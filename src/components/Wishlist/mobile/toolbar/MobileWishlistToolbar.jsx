import MobileTabStrip from './MobileTabStrip';
import MobileSortShareRow from './MobileSortShareRow';
import '../../../../styles/wishlist/mobile/toolbar/mobile-wishlist-toolbar.css';

const MobileWishlistToolbar = ({ activeTab, setActiveTab, tabCounts, onSortChange, onShare }) => {
  return (
    <div className="wishlist-mobile-toolbar">
      <MobileTabStrip 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabCounts={tabCounts} 
      />
      <MobileSortShareRow 
        onSortChange={onSortChange} 
        onShare={onShare} 
      />
    </div>
  );
};

export default MobileWishlistToolbar;