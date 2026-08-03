// src/components/Listers/tabs/TheirListings/TheirListingsTab.tsx

import React, { useEffect } from 'react';
import { useListings } from '../../hooks/useListings';
import { UtilizationChips } from './UtilizationChips';
import { RecallCard } from './RecallCard';
import { ProductCard } from './ProductCard';
import './styles/TheirListingsTab.css';

interface TheirListingsTabProps {
  listings: any[];
  recalls: any[];
  listerId: string;
  onUpdate: () => void;
  isCreateMode?: boolean;
}

export const TheirListingsTab: React.FC<TheirListingsTabProps> = ({
  listings,
  recalls,
  listerId,
  onUpdate,
  isCreateMode = false,
}) => {
  const { utilization, fetchListings } = useListings(listerId);

  useEffect(() => {
    if (!isCreateMode) {
      fetchListings();
    }
  }, [listerId, isCreateMode]);

  if (isCreateMode) {
    return (
      <div className="their-listings-tab">
        <p className="their-listings-intro">
          All pieces on HOK from this lister — derived live from the catalogue. Click any card to open the product editor.
        </p>
        <div className="empty-state-inline" style={{ marginTop: '24px', fontSize: '11px', color: '#8A7E72', textAlign: 'center' }}>
          Save the contact card to create the lister — pieces attach afterwards.
        </div>
      </div>
    );
  }

  const hasListings = listings.length > 0;

  return (
    <div className="their-listings-tab">
      <p className="their-listings-intro">
        All pieces on HOK from this lister — derived live from the catalogue. Click any card to open the product editor.
      </p>

      <UtilizationChips utilization={utilization} />

      <RecallCard 
        recalls={recalls} 
        listings={listings}
        listerId={listerId}
        onUpdate={onUpdate}
      />

      {!hasListings ? (
        <div className="empty-state-boxed">
          No pieces yet from this lister.
          <br />
          <button className="qlnk" onClick={() => {}}>
            Record their first piece →
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {listings.map((listing) => (
            <ProductCard key={listing.id} product={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TheirListingsTab;