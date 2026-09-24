import React, { useState, useEffect } from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useSubmissionDetail } from './hooks/useSubmissionDetail';
import { useJourneyStack } from './hooks/useJourneyStack';
import { SubmissionRecord } from './record/SubmissionRecord';
import './LYPDetailView.css';

interface LYPDetailViewProps {
  submissionId: string;
}

export const LYPDetailView: React.FC<LYPDetailViewProps> = ({ submissionId }) => {
  const [currentId, setCurrentId] = useState(submissionId);
  
  const {
    submission,
    loading,
    error,
    refreshSubmission,
    goPrev,
    goNext,
    hasPrev,
    hasNext,
    currentIndex,
    totalCount,
  } = useSubmissionDetail(currentId);

  const { pushState, updateCurrentState, goBack } = useJourneyStack();

  useEffect(() => {
    if (submission) {
      updateCurrentState({ id: submission.subid });
    }
  }, [submission, updateCurrentState]);

  const handleNavigate = (id: string) => {
    setCurrentId(id);
    pushState({ type: 'detail', id });
  };

  const handleSave = () => {
    alert(`Worksheet changes for ${submission?.subid} saved successfully!`);
  };

  const handleViewLive = () => {
    window.open('/', '_blank');
  };

  if (loading) {
    return (
      <div className="lyp-detail-loading">
        Loading submission...
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="lyp-detail-error">
        {error || 'Submission not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top Header Bar - Matches Listers & Designers sections */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E0D6] px-6 py-3 flex items-center justify-between shrink-0 h-[52px]">
        {/* Left: Back Button & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E6DED3] bg-white px-3 text-[12px] font-medium text-[#6F675D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back to Submissions</span>
          </button>
          <div className="flex items-center gap-1.5 text-[13px] font-sans">
            <span className="text-[#9C9287]">List Your Piece</span>
            <span className="text-[#C3BAAF]">›</span>
            <span className="font-semibold text-[#2C2926]">{submission.subid}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleViewLive}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5DDD3] bg-white px-3.5 text-[12px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#6F675D]" />
            <span>View Live Site</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition shadow-2xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Detail Body (Padded container) */}
      <div className="lyp-detail-view">
        <SubmissionRecord 
          submission={submission}
          onUpdate={refreshSubmission}
          onNavigate={handleNavigate}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={goPrev}
          onNext={goNext}
          currentIndex={currentIndex}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};