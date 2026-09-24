// components/TabBar.tsx
import React from 'react';
import './styles/TabBar.css';

export interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="msg-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`msg-tab ${activeTab === tab.id ? 'msg-tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};