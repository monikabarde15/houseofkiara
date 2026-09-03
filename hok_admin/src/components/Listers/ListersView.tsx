// src/components/Listers/ListersView.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Lister, ListerFilters } from './types/lister.types';
import useListers from './hooks/useListers';
import useJourneyStack from './hooks/useJourneyStack';
import { listerService } from './services/listerService';
import ListersHeader from './components/ListersHeader';
import PendingApprovals from './components/PendingApprovals';
import SupplyInsightCard from './components/SupplyInsightCard';
import ListersTable from './components/ListersTable';
import ListerDetailView from './ListerDetailView';
import toast from 'react-hot-toast';
import './ListersView.css';

interface ListersViewProps {
  onEditingChange?: (isEditing: boolean) => void;
}

export const ListersView: React.FC<ListersViewProps> = ({ onEditingChange }) => {
  const [selectedListerId, setSelectedListerId] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Profile & Contact');
  const [formListerData, setFormListerData] = useState<Partial<Lister>>({});

  const [filters, setFilters] = useState<ListerFilters>({
    status: undefined,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { listers, loading, error, totalCount, refreshListers, deleteLister } = useListers(filters);
  const { pushState } = useJourneyStack();

  const handleDeleteLister = async (targetLister: Lister) => {
    const idToDelete = (targetLister as any)._id || targetLister.id || (targetLister as any).listerId;
    if (!idToDelete) throw new Error("Missing Lister ID for deletion");
    await deleteLister(idToDelete);
  };

  useEffect(() => {
    pushState({ type: 'section', id: 'listers' });
  }, []);

  const isDetailActive = Boolean(selectedListerId || isCreateMode);

  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(isDetailActive);
    }
  }, [isDetailActive, onEditingChange]);

  const handleFilterChange = (newFilters: Partial<ListerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRowClick = (lister: Lister) => {
    setSelectedListerId(lister.id);
    setIsCreateMode(false);
    setFormListerData(lister);
    setActiveTab('Profile & Contact');
    pushState({ type: 'detail', id: lister.id, tab: 'Profile & Contact' });
  };

  const handleAddLister = () => {
    setSelectedListerId(null);
    setIsCreateMode(true);
    setFormListerData({
      name: '',
      phone: '',
      email: '',
      city: '',
      address: { line1: '', line2: null, city: '', state: '', pin: '' },
      pickup: { line1: '', line2: null, city: '', state: '', pin: '' },
      bank: { holder: '', accct: '', ifsc: '', branch: '', upi: '', verified: false },
    });
    setActiveTab('Profile & Contact');
    pushState({ type: 'detail', id: 'new', tab: 'Profile & Contact' });
  };

  const handleBack = () => {
    setSelectedListerId(null);
    setIsCreateMode(false);
    setFormListerData({});
  };

  if (isDetailActive) {
    const currentLister = listers.find(l => l.id === selectedListerId);
    const listerName = isCreateMode
      ? (formListerData.name || 'New Lister')
      : (formListerData.name || currentLister?.name || 'Lister Detail');

    return (
      <div className="min-h-screen bg-[#F7F4EF]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#EBE5DF] px-6 py-3 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6F675D] hover:text-[#2A2118] transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{isCreateMode ? 'Back' : 'Back to Listers'}</span>
              </button>
              <span className="text-[#D4CDC5] text-[12.5px] mx-1">Listers</span>
              <span className="text-[#B8A98E] text-[12.5px] font-medium">›</span>
              <span className="text-[12.5px] font-semibold text-[#38332D]">{listerName}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open('/', '_blank')}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5DDD3] bg-white px-3.5 text-[12px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#6F675D]" />
                <span>View Live Site</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    const listerToSave = {
                      ...(currentLister || {}),
                      ...formListerData,
                    };
                    if (isCreateMode) {
                      if (!listerToSave.name || !listerToSave.name.trim()) {
                        toast.error("Name is required to create the lister.");
                        return;
                      }
                      if (!listerToSave.phone || !listerToSave.phone.trim()) {
                        toast.error("Phone is required — WhatsApp is how we reach listers.");
                        return;
                      }
                      const created = await listerService.createLister(listerToSave);
                      toast.success(`New lister "${created.name}" created successfully in MongoDB database!`);
                      await refreshListers();
                      handleBack();
                    } else if (selectedListerId) {
                      const updated = await listerService.updateLister(selectedListerId, listerToSave);
                      toast.success(`Lister "${updated.name}" updated successfully in MongoDB database!`);
                      await refreshListers();
                    }
                  } catch (err: any) {
                    toast.error("Validation / Save Error: " + (err.message || "Failed to save to database"));
                  }
                }}
                className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition shadow-2xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </header>

        {/* Lister Detail Page Body */}
        <ListerDetailView
          listerId={selectedListerId || 'new'}
          isCreateMode={isCreateMode}
          activeTab={activeTab}
          onListerChange={(updated) => setFormListerData(prev => ({ ...prev, ...updated }))}
        />
      </div>
    );
  }

  return (
    <div className="listers-view">
      <ListersHeader onAddLister={handleAddLister} />
      
      <div className="listers-view-content">
        <PendingApprovals />
        
        <SupplyInsightCard listers={listers} />
        
        <ListersTable
          listers={listers}
          loading={loading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onRowClick={handleRowClick}
          onDeleteLister={handleDeleteLister}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};

export default ListersView;