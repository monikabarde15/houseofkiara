import React, { useState } from 'react';
import '../css/DesignerEdit.css';
import { Designer } from '../types/designer.types';
import ProfileTab from '../tabs/ProfileTab';
import PerformancePiecesTab from '../tabs/PerformancePiecesTab';
import AuthenticationTab from '../tabs/AuthenticationTab';
import ContactCommercialTab from '../tabs/ContactCommercialTab';

type TabKey = 'profile' | 'performance' | 'authentication' | 'contact';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'performance', label: 'Performance & Pieces' },
  { key: 'authentication', label: 'Authentication' },
  { key: 'contact', label: 'Contact & Commercial' },
];

interface DesignerEditProps {
  designer: Designer;
  onBack: () => void;
  /** Full designer list, used to populate the Profile tab's merge-into dropdown. */
  allDesigners: Designer[];
  onSaveProfile: (designer: Designer) => void;
  onMergeProfile: (targetDesignerId: string) => void;
  onDeleteProfile: () => void;
}

const DesignerEdit: React.FC<DesignerEditProps> = ({
  designer,
  onBack,
  allDesigners,
  onSaveProfile,
  onMergeProfile,
  onDeleteProfile,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  return (
    <div className="designer-edit-page">
      {/* Top bar */}
      <div className="designer-edit-topbar">
        <div className="designer-edit-breadcrumb">
          <button className="back-link" onClick={onBack}>‹ Back</button>
          <span className="breadcrumb-sep">Designers &gt;</span>
          <span className="breadcrumb-current">{designer.name}</span>
        </div>
        <div className="designer-edit-actions">
          <button className="btn btn-outline">
            <span className="btn-icon">⤴</span> View Live Site
          </button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>

      {/* Title block */}
      <div className="designer-edit-titleblock">
        <div className="designer-edit-titlerow">
          <h1 className="designer-edit-name">{designer.name}</h1>
          <div className="designer-edit-titleactions">
            <button className="btn btn-outline-small">View Listing →</button>
            <button className="btn btn-primary-small">Save</button>
          </div>
        </div>
        <p className="designer-edit-subtitle">
          {designer.bio} · slug: {designer.slug}
        </p>
      </div>

      {/* Tabs */}
      <div className="designer-edit-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`designer-edit-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="designer-edit-body">
        {activeTab === 'profile' && (
          <ProfileTab
            designer={designer}
            otherDesigners={allDesigners
              .filter((d) => d.id !== designer.id)
              .map((d) => ({ id: d.id, name: d.name }))}
            onSave={onSaveProfile}
            onMerge={onMergeProfile}
            onDelete={onDeleteProfile}
          />
        )}
        {activeTab === 'performance' && <PerformancePiecesTab designer={designer} />}
        {activeTab === 'authentication' && <AuthenticationTab designer={designer} />}
        {activeTab === 'contact' && <ContactCommercialTab designer={designer} />}
      </div>
    </div>
  );
};

export default DesignerEdit;