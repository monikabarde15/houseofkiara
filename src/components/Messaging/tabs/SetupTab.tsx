// tabs/SetupTab.tsx (Renamed from SettingsTab)
import React from 'react';
import { SetupTab as SetupTabContent } from '../setup/SetupTab';
import './styles/SetupTab.css';

export const SetupTab: React.FC = () => {
  return (
    <div className="msg-tab-panel">
      <SetupTabContent />
    </div>
  );
};