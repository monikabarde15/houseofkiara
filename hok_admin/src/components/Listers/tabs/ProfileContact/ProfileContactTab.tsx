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
  onListerChange?: (lister: Lister) => void;
  isCreateMode?: boolean;
  activities?: any[];
}

const defaultBlankLister: Lister = {
  id: 'new',
  slug: '',
  name: '',
  initials: '',
  phone: '',
  email: '',
  city: '',
  address: { line1: '', line2: null, city: '', state: '', pin: '' },
  pickup: { line1: '', line2: null, city: '', state: '', pin: '' },
  pickupPrefs: null,
  bank: { holder: '', accct: '', ifsc: '', branch: '', upi: '', verified: false },
  status: 'Verified',
  statusReason: null,
  source: 'Manual (Admin)',
  referral: '',
  joined: new Date().toISOString(),
  gstReg: false,
  gstin: null,
  pan: null,
  panVerified: false,
  terms: { version: 'LST-2026-01', acceptedAt: new Date().toISOString(), channel: 'WhatsApp' },
  notes: null,
  insta: null,
};

export const ProfileContactTab: React.FC<ProfileContactTabProps> = ({
  lister,
  onSave,
  onListerChange,
  isCreateMode = false,
  activities = [],
}) => {
  const [localLister, setLocalLister] = useState<Lister>(lister || defaultBlankLister);

  useEffect(() => {
    setLocalLister(lister || defaultBlankLister);
  }, [lister, isCreateMode]);

  const handleUpdate = (updates: Partial<Lister>) => {
    setLocalLister(prev => {
      const base = prev || defaultBlankLister;
      const updated = { ...base, ...updates };
      if (onListerChange) {
        onListerChange(updated);
      }
      return updated;
    });
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
          activities={activities} 
          isCreateMode={isCreateMode}
        />
      </div>
    </div>
  );
};

export default ProfileContactTab;