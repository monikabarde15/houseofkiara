import { useState } from 'react';
import '../../../../styles/wishlist/mobile/toolbar/mobile-sort-share-row.css';

const MobileSortShareRow = ({ onSortChange, onShare }) => {
  const [selectedSort, setSelectedSort] = useState('dateNewest');

  const handleSortChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex].text;
    setSelectedSort(e.target.value);
    onSortChange?.(e.target.value);
    
    const toastEvent = new CustomEvent('showToast', { 
      detail: { message: `Sorted by: ${selectedOption}` } 
    });
    window.dispatchEvent(toastEvent);
  };

  return (
    <div className="wishlist-mobile-sort-share-row">
      {/* Sort Dropdown */}
      <div className="wishlist-mobile-sort-share-row__sort">
        <label className="wishlist-mobile-sort-share-row__sort-label">SORT</label>
        <div className="wishlist-mobile-sort-share-row__sort-wrapper">
          <select 
            className="wishlist-mobile-sort-share-row__select"
            value={selectedSort}
            onChange={handleSortChange}
          >
            <option value="dateNewest">Date saved: Newest</option>
            <option value="dateOldest">Date saved: Oldest</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="designerAZ">Designer A-Z</option>
          </select>
        </div>
      </div>

      {/* Share Button */}
      <button className="wishlist-mobile-sort-share-row__share" onClick={onShare}>
        <svg className="wishlist-mobile-sort-share-row__share-icon" viewBox="0 0 13 13" fill="none">
          <circle cx="3" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="10" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="10" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <line x1="4.5" y1="5.5" x2="8.5" y2="4" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="4.5" y1="7.5" x2="8.5" y2="9" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="wishlist-mobile-sort-share-row__share-label">SHARE</span>
      </button>
    </div>
  );
};

export default MobileSortShareRow;