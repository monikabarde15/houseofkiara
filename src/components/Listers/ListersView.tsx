// src/components/Listers/ListersView.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Lister, ListerFilters } from './types/lister.types';
import useListers from './hooks/useListers';
import useJourneyStack from './hooks/useJourneyStack';
import ListersHeader from './components/ListersHeader';
import PendingApprovals from './components/PendingApprovals';
import SupplyInsightCard from './components/SupplyInsightCard';
import ListersTable from './components/ListersTable';
import ListerDetailView from './ListerDetailView';
import './ListersView.css';

interface ListersViewProps {
  onEditingChange?: (isEditing: boolean) => void;
}

export const ListersView: React.FC<ListersViewProps> = ({ onEditingChange }) => {
  const [selectedListerId, setSelectedListerId] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Profile & Contact');

  const [filters, setFilters] = useState<ListerFilters>({
    status: undefined,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { listers, loading, error, totalCount, refreshListers } = useListers(filters);
  const { pushState } = useJourneyStack();

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
    setActiveTab('Profile & Contact');
    pushState({ type: 'detail', id: lister.id, tab: 'Profile & Contact' });
  };

  const handleAddLister = () => {
    setSelectedListerId(null);
    setIsCreateMode(true);
    setActiveTab('Profile & Contact');
    pushState({ type: 'detail', id: 'new', tab: 'Profile & Contact' });
  };

  const handleBack = () => {
    setSelectedListerId(null);
    setIsCreateMode(false);
  };

  if (isDetailActive) {
    const currentLister = listers.find(l => l.id === selectedListerId);
    const listerName = isCreateMode ? 'New Lister' : (currentLister?.name || 'Lister Detail');

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
                onClick={() => alert(isCreateMode ? "New lister record created successfully!" : "Lister profile updated successfully!")}
                className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition shadow-2xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </header>

        {/* Lister Detail Page Body */}
        <ListerDetailView
          listerId={selectedListerId || 'lister-1'}
          isCreateMode={isCreateMode}
          activeTab={activeTab}
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
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};

export default ListersView;