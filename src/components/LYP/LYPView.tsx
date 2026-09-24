// src/components/LYP/LYPView.tsx

import React, { useState, useEffect } from 'react';
import { Submission, SubmissionFilters, SubmissionStats } from './types/submission.types';
import { useSubmissions } from './hooks/useSubmissions';
import { useJourneyStack } from './hooks/useJourneyStack';
import { LYPHeader } from './components/LYPHeader';
import { StatCards } from './components/StatCards';
import { LYPTable } from './components/LYPTable';
import { LYPTableToolbar } from './components/LYPTableToolbar';
import { LYPTableFooter } from './components/LYPTableFooter';
import { IntakeCard } from './intake/IntakeCard';
import { calculateStats } from './utils/derived';
import './LYPView.css';

export const LYPView: React.FC = () => {
  const [filters, setFilters] = useState<SubmissionFilters>({
    search: '',
    status: '',
    intent: undefined,
    channel: undefined,
    dateFrom: '',
    dateTo: '',
    view: undefined,
  });
  const [showIntake, setShowIntake] = useState(false);
  const [viewLabel, setViewLabel] = useState<string>('');

  const { submissions, loading, error, totalCount, refreshSubmissions } = useSubmissions(filters);
  const { pushState } = useJourneyStack();
  const stats = calculateStats(submissions);



  const handleFilterChange = (newFilters: Partial<SubmissionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewChange = (view: SubmissionFilters['view'], label: string) => {
    if (filters.view === view) {
      // Toggle off
      setFilters(prev => ({ ...prev, view: undefined }));
      setViewLabel('');
    } else {
      setFilters(prev => ({ ...prev, view }));
      setViewLabel(label);
    }
  };

  const handleClearView = () => {
    setFilters({ search: '', status: '', intent: undefined, channel: undefined, dateFrom: '', dateTo: '', view: undefined });
    setViewLabel('');
  };

  const handleRowClick = (submission: Submission) => {
    pushState({ type: 'detail', id: submission.subid });
    // Navigation handled by parent
  };

  const handleIntakeSuccess = () => {
    setShowIntake(false);
    refreshSubmissions();
  };

  return (
    <div className="lyp-view">
      <LYPHeader 
        onRecordSubmission={() => setShowIntake(!showIntake)}
        showIntake={showIntake}
      />

      <StatCards 
        stats={stats}
        activeView={filters.view}
        onViewChange={handleViewChange}
      />

      {showIntake && (
        <IntakeCard 
          onSuccess={handleIntakeSuccess}
          onCancel={() => setShowIntake(false)}
        />
      )}

      <div className="lyp-table-container card">
        <LYPTableToolbar 
          filters={filters}
          onFilterChange={handleFilterChange}
          viewLabel={viewLabel}
          onClearView={handleClearView}
          onExport={() => {}}
          onRecordSubmission={() => setShowIntake(!showIntake)}
        />

        <LYPTable 
          submissions={submissions}
          loading={loading}
          onRowClick={handleRowClick}
        />

        <LYPTableFooter 
          shownCount={submissions.length}
          totalCount={totalCount}
          isFiltered={!!filters.search || !!filters.status || !!filters.intent || !!filters.channel || !!filters.dateFrom || !!filters.dateTo || !!filters.view}
          onShowAll={handleClearView}
        />
      </div>
    </div>
  );
};