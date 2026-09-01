// src/components/Listers/components/ListerTabs.tsx

import React from 'react';
import './styles/ListerTabs.css';

interface ListerTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCreateMode?: boolean;
}

const TABS = [
  'Profile & Contact',
  'Submitted Pieces',
  'Their Listings',
  'Payout History',
  'Communication Log',
  'Account & Compliance',
];

export const ListerTabs: React.FC<ListerTabsProps> = ({ 
  activeTab, 
  onTabChange,
  isCreateMode = false,
}) => {
  return (
    <div className="tibar">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`it ${activeTab === tab ? 'it-active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ListerTabs;