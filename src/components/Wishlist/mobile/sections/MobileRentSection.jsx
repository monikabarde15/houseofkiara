import MobileSectionHeader from './MobileSectionHeader';
import MobileAvailabilityNotice from './MobileAvailabilityNotice';
import MobileWishlistCard from '../cards/MobileWishlistCard';
import '../../../../styles/wishlist/mobile/sections/mobile-rent-section.css';

const MobileRentSection = ({ viewMode, showToast, activeTab, products, onRemoveCard, onOpenAddToBagSheet }) => {
  const pieceCount = products.length;
  const showAvailabilityNotice = activeTab === 'all' || activeTab === 'rent';

  if (pieceCount === 0) return null;

  return (
    <div className="wishlist-mobile-rent-section">
      <MobileSectionHeader mode="rent" pieceCount={pieceCount} />
      {showAvailabilityNotice && <MobileAvailabilityNotice />}
      
      <div className="wishlist-mobile-rent-section__cards">
        {products.map((item, index) => (
          <MobileWishlistCard 
            key={item.id} 
            item={item} 
            mode="rent" 
            index={index}
            showToast={showToast}
            onRemoveCard={onRemoveCard}
            onOpenAddToBagSheet={onOpenAddToBagSheet}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileRentSection;