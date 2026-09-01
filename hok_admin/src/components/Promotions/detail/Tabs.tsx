/* ========================================
   Promotions Module - Tabs
   Tab bar with Performance & Rules
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.3
   ======================================== */

import React from 'react';
import './styles/Tabs.css';

interface TabsProps {
  activeTab: 'performance' | 'rules';
  onTabChange: (tab: 'performance' | 'rules') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs">
      <button
        className={`tabs__tab ${activeTab === 'performance' ? 'active' : ''}`}
        onClick={() => onTabChange('performance')}
      >
        Performance & Orders
      </button>
      <button
        className={`tabs__tab ${activeTab === 'rules' ? 'active' : ''}`}
        onClick={() => onTabChange('rules')}
      >
        Rules & Eligibility
      </button>
    </div>
  );
};