import { limitedAvailabilityItems } from '../../data/wishlistData';
import '../../../../styles/wishlist/mobile/sections/mobile-availability-notice.css';

const MobileAvailabilityNotice = () => {
  const limitedCount = limitedAvailabilityItems.length;

  return (
    <div className="wishlist-mobile-availability-notice">
      <p className="wishlist-mobile-availability-notice__text">
        <span className="wishlist-mobile-availability-notice__bold">
          {limitedCount} pieces have limited availability:
        </span>
        {' '}the Crimson Zardozi Bridal Lehenga (Sabyasachi) is in high demand, and the Rose Embroidered Anarkali Gown (Tarun Tahiliani) is currently booked for nearby dates. Slots are not held — we recommend reserving early.
      </p>
    </div>
  );
};

export default MobileAvailabilityNotice;