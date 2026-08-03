// src/components/Listers/tabs/ProfileContact/ProfileContactTab.tsx

import React, { useState, useEffect } from 'react';
import { Lister } from '../../types/lister.types';
import { ContactCard } from './ContactCard';
import { BankCard } from './BankCard';
import { PickupCard } from './PickupCard';
import { ActivityCard } from './ActivityCard';
import './styles/ProfileContactTab.css';

interface ProfileContactTabProps {
  lister: Lister | null;
  onSave: () => void;
  isCreateMode?: boolean;
}

export const ProfileContactTab: React.FC<ProfileContactTabProps> = ({
  lister,
  onSave,
  isCreateMode = false,
}) => {
  const [localLister, setLocalLister] = useState<Lister | null>(lister);

  useEffect(() => {
    setLocalLister(lister);
  }, [lister]);

  const handleUpdate = (updates: Partial<Lister>) => {
    if (localLister) {
      setLocalLister({ ...localLister, ...updates });
    }
  };

  const handleSave = () => {
    // Save logic will be handled by parent
    onSave();
  };

  if (!localLister && !isCreateMode) {
    return <div className="profile-tab-empty">No lister data available</div>;
  }

  return (
    <div className="profile-contact-tab">
      <div className="profile-contact-grid">
        <ContactCard 
          lister={localLister} 
          onUpdate={handleUpdate} 
          isCreateMode={isCreateMode}
        />
        <BankCard 
          lister={localLister} 
          onUpdate={handleUpdate} 
          isCreateMode={isCreateMode}
        />
        <PickupCard 
          lister={localLister} 
          onUpdate={handleUpdate} 
          isCreateMode={isCreateMode}
        />
        <ActivityCard 
          activities={localLister ? [] : []} 
          isCreateMode={isCreateMode}
        />
      </div>
      {/* <div className="profile-contact-footer">
        <button className="btn btn-gold btn-sm" onClick={handleSave}>
          Save
          <span className="save-check"> ✓</span>
        </button>
      </div> */}
    </div>
  );
};

export default ProfileContactTab;