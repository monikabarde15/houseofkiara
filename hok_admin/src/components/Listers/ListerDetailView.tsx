// src/components/Listers/ListerDetailView.tsx

import React, { useState, useEffect } from 'react';
import { Lister } from './types/lister.types';
import useListerDetail from './hooks/useListerDetail';
import useJourneyStack from './hooks/useJourneyStack';
import ListerDetailHeader from './components/ListerDetailHeader';
import ListerTabs from './components/ListerTabs';
import AttentionStrip from './components/AttentionStrip';
import CreateModeBanner from './components/CreateModeBanner';
import ProfileContactTab from './tabs/ProfileContact/ProfileContactTab';
import SubmittedPiecesTab from './tabs/SubmittedPieces/SubmittedPiecesTab';
import TheirListingsTab from './tabs/TheirListings/TheirListingsTab';
import PayoutHistoryTab from './tabs/PayoutHistory/PayoutHistoryTab';
import CommunicationTab from './tabs/Communication/CommunicationTab';
import ComplianceTab from './tabs/Compliance/ComplianceTab';
import './ListerDetailView.css';

interface ListerDetailViewProps {
  listerId: string;
  isCreateMode?: boolean;
  activeTab?: string;
  onListerChange?: (lister: Lister) => void;
  setView?: (view: string) => void;
}

export const ListerDetailView: React.FC<ListerDetailViewProps> = ({
  listerId,
  isCreateMode = false,
  activeTab = 'Profile & Contact',
  onListerChange,
  setView,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  
  const {
    lister,
    submissions,
    listings,
    payouts,
    communications,
    activities,
    recalls,
    ledger,
    attentionFlags,
    loading,
    refreshLister,
  } = useListerDetail(listerId, isCreateMode);

  const { updateCurrentState } = useJourneyStack();

  useEffect(() => {
    if (updateCurrentState) {
      updateCurrentState({ tab: currentTab });
    }
  }, [currentTab]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'Profile & Contact':
        return <ProfileContactTab lister={lister} activities={activities} onSave={refreshLister} onListerChange={onListerChange} isCreateMode={isCreateMode} />;
      case 'Submitted Pieces':
        return <SubmittedPiecesTab submissions={submissions} listerId={listerId} onUpdate={refreshLister} isCreateMode={isCreateMode} />;
      case 'Their Listings':
        return <TheirListingsTab listings={listings} recalls={recalls} listerId={listerId} onUpdate={refreshLister} isCreateMode={isCreateMode} />;
      case 'Payout History':
        return <PayoutHistoryTab payouts={payouts} ledger={ledger} lister={lister} isCreateMode={isCreateMode} setView={setView} />;
      case 'Communication Log':
        return <CommunicationTab communications={communications} listerId={listerId} onUpdate={refreshLister} isCreateMode={isCreateMode} />;
      case 'Account & Compliance':
        return <ComplianceTab lister={lister} onSave={refreshLister} isCreateMode={isCreateMode} />;
      default:
        return null;
    }
  };

  if (loading && !isCreateMode) {
    return <div className="lister-detail-loading">Loading...</div>;
  }

  return (
    <div className="lister-detail-view">
      {isCreateMode && <CreateModeBanner />}
      
      <ListerDetailHeader 
        lister={lister} 
        ledger={ledger}
        attentionFlags={attentionFlags}
        onRefresh={refreshLister}
        isCreateMode={isCreateMode}
      />
      
      {isCreateMode ? (
        <AttentionStrip
          flags={[{ text: '1 payout to approve', door: 'payout' }]}
          listerId={listerId}
        />
      ) : attentionFlags.length > 0 ? (
        <AttentionStrip flags={attentionFlags} listerId={listerId} />
      ) : null}
      
      <ListerTabs 
        activeTab={currentTab} 
        onTabChange={setCurrentTab}
        isCreateMode={isCreateMode}
      />
      
      <div className="lister-detail-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ListerDetailView;