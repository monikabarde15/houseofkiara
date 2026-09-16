// src/components/LYP/record/RecordHeader.tsx

import React, { useState, useEffect } from 'react';
import { Submission } from '../types/submission.types';
import { 
  formatDate, 
  formatTime, 
  getFirstName,
  formatDateTime
} from '../utils/formatter';
import { 
  getSubmissionStatus, 
  getStatusClass, 
  getAgeChip,
  getChannelClass
} from '../utils/derived';
import { useJourneyStack } from '../hooks/useJourneyStack';
import { submissionService } from '../services/submissionService';
import './styles/RecordHeader.css';

interface RecordHeaderProps {
  submission: Submission;
  onNavigate: (id: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
  onSave?: () => void;
  onViewLive?: () => void;
}

export const RecordHeader: React.FC<RecordHeaderProps> = ({
  submission,
  onNavigate,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
  onSave,
  onViewLive,
}) => {
  const { goBack, getBackDestination } = useJourneyStack();
  const backDest = getBackDestination();

  const [localAssignedTo, setLocalAssignedTo] = useState(submission.assignedTo || 'Unassigned');

  useEffect(() => {
    setLocalAssignedTo(submission.assignedTo || 'Unassigned');
  }, [submission.assignedTo]);

  const status = getSubmissionStatus(submission);
  const statusClass = getStatusClass(status);
  const ageChip = getAgeChip(submission);
  const channelClass = getChannelClass(submission.channel);

  const handleBack = () => {
    goBack();
  };

  return (
    <div className="record-header">
      {/* Gold Back link in body - matches design */}
      <div className="record-back-link mb-2 text-[11px]">
        <span className="qlnk cursor-pointer select-none" onClick={handleBack}>
          ← Submissions
        </span>
      </div>

      {/* Record Title & Navigation */}
      <div className="record-head">
        <div className="record-head-left font-sans">
          <div className="record-title-row">
            <h1 className="record-title">{submission.piece}</h1>
            <span className={`s-chip ${statusClass}`}>{status}</span>
            {ageChip.text && (
              <span className={`agec ${ageChip.class}`}>{ageChip.text}</span>
            )}
          </div>
          <div className="record-meta mt-1.5 flex items-center gap-1.5 text-[#8C847A] text-[11px]">
            <span className="subid font-mono text-[#C7A55C] font-semibold">{submission.subid}</span>
            <span>Submitted {formatDateTime(submission.submittedAt)}</span>
            <span className="record-meta-sep">·</span>
            <span className={`tag ${channelClass}`}>{submission.channel}</span>
            <span className="record-meta-sep">·</span>
            <span className="qlnk text-[#C7A55C]" onClick={() => onNavigate(submission.listerID)}>from {getFirstName(submission.listerID)}</span>
            <span className="record-meta-sep">·</span>
            <span className="flex items-center gap-1">
              Assigned to:
              <select 
                className="bg-transparent border-b border-dashed border-[#C7A55C] text-[#C7A55C] outline-none cursor-pointer"
                value={localAssignedTo}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setLocalAssignedTo(newVal);
                  submissionService.updateSubmission(submission.subid, { assignedTo: newVal })
                    .then(() => onSave?.())
                    .catch(() => setLocalAssignedTo(submission.assignedTo || 'Unassigned'));
                }}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Soumya">Soumya</option>
                <option value="Operations Team">Operations Team</option>
              </select>
            </span>
          </div>
        </div>

        <div className="record-head-right justify-center">
          {/* Navigation - matches design: < Previous counter Next > */}
          <div className="record-nav">
            <button 
              className="btn btn-sec btn-sm"
              onClick={onPrev}
              disabled={!hasPrev}
            >
              ‹ Previous
            </button>
            <span className="record-counter">
              {currentIndex} of {totalCount}
            </span>
            <button 
              className="btn btn-sec btn-sm"
              onClick={onNext}
              disabled={!hasNext}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};