// src/components/Listers/components/SupplyInsightCard.tsx

import React from 'react';
import { Lister } from '../types/lister.types';
import { calculateSupplyInsight } from '../utils/derived';
import './styles/SupplyInsightCard.css';

import { mockProducts, mockPayouts } from '../data/mockListers';

interface SupplyInsightCardProps {
  listers: Lister[];
}

export const SupplyInsightCard: React.FC<SupplyInsightCardProps> = ({ listers }) => {
  // In real implementation, pass products and transactions
  // For now, using mock data
  const insight = calculateSupplyInsight(listers, mockProducts, mockPayouts);

  if (!insight) {
    return null;
  }

  const { lister, liveShare, tvShare, isRisk, totalLive, totalTV } = insight;

  return (
    <div className="supply-insight-card card">
      <div className="card-bd">
        <p className="supply-insight-text">
          {isRisk ? (
            <>
              <span className="supply-insight-risk">
                Supply concentration:{' '}
                <span className="qlnk">{lister?.name}</span> holds {liveShare}% of {totalLive} live pieces ({liveShare}%) and {tvShare}% of lifetime transaction value.{' '}
                <span className="supply-insight-risk-highlight">
                  Single-lister dependency – a recall or exit would thin the rental rail; keep the acquisition push warm.
                </span>
              </span>
            </>
          ) : (
            <span className="supply-insight-healthy">
              Supply is reasonably spread across the network.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SupplyInsightCard;