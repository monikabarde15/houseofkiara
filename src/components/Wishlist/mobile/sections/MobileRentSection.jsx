import MobileSectionHeader from './MobileSectionHeader';
import MobileAvailabilityNotice from './MobileAvailabilityNotice';
import MobileWishlistCard from '../cards/MobileWishlistCard';
import { wishlistItems } from '../../data/wishlistData';
import '../../../../styles/wishlist/mobile/sections/mobile-rent-section.css';

const MobileRentSection = ({ viewMode, showToast, activeTab,onRemoveCard, onOpenAddToBagSheet }) => {
  const rentItems = wishlistItems.rent;
  const pieceCount = rentItems.length;
  
  // Section 5.2: Availability notice visible when "All" or "Rent" tab is active
  const showAvailabilityNotice = activeTab === 'all' || activeTab === 'rent';

  if (pieceCount === 0) return null;

  return (
    <div className="wishlist-mobile-rent-section">
      <MobileSectionHeader mode="rent" pieceCount={pieceCount} />
      {showAvailabilityNotice && <MobileAvailabilityNotice />}
      
      <div className="wishlist-mobile-rent-section__cards">
        {rentItems.map((item, index) => (
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