// src/components/LYP/record/SubmissionRecord.tsx

import React, { useState } from 'react';
import { Submission } from '../types/submission.types';
import { RecordHeader } from './RecordHeader';
import { RecordChips } from './RecordChips';
import { ApplicantBanner } from './ApplicantBanner';
import { FactsLeft } from './FactsLeft';
import { FactsRight } from './FactsRight';
import { WorksheetCard } from './WorksheetCard';
import { AwaitingBanner } from './AwaitingBanner';
import { ActionsRow } from './ActionsRow';
import { VerdictBlock } from './VerdictBlock';
import { ReviewHistory } from './ReviewHistory';
import { SKUReservationLine } from './SKUReservationLine';
import { MoreInfoComposer } from './MoreInfoComposer';
import { RejectPanel } from './RejectPanel';
import { WithdrawRow } from './WithdrawRow';
import { ExpireConfirmModal } from './ExpireConfirmModal';
import { getSubmissionStatus } from '../utils/derived';
import './styles/SubmissionRecord.css';

interface SubmissionRecordProps {
  submission: Submission;
  onUpdate: () => void;
  onNavigate: (id: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}

export const SubmissionRecord: React.FC<SubmissionRecordProps> = ({
  submission,
  onUpdate,
  onNavigate,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showExpire, setShowExpire] = useState(false);

  const status = getSubmissionStatus(submission);
  const isDecided = !!submission.decision;
  const isUndecided = !isDecided;
  const isAwaitingReply = status === 'Awaiting Reply';
  const isPendingReview = false; // Would check lister status

  const handleActionSuccess = () => {
    setShowMoreInfo(false);
    setShowReject(false);
    setShowWithdraw(false);
    setShowExpire(false);
    onUpdate();
  };

  const handleExpireConfirm = async () => {
    try {
      const { submissionService } = await import('../services/submissionService');
      const { toast } = await import('react-hot-toast');
      await submissionService.expireSubmission(submission.subid);
      toast.success('Submission marked as expired');
      handleActionSuccess();
    } catch (err: any) {
      import('react-hot-toast').then(({ toast }) => toast.error(err.message || 'Failed to expire submission'));
    }
  };

  return (
    <div className="submission-record">
      <RecordHeader 
        submission={submission}
        onNavigate={onNavigate}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={onPrev}
        onNext={onNext}
        currentIndex={currentIndex}
        totalCount={totalCount}
        onSave={onUpdate}
      />

      <div className="submission-record-body">
        <div className="submission-record-main">
          <RecordChips submission={submission} />

          {isPendingReview && isUndecided && (
            <ApplicantBanner submission={submission} />
          )}

                  <div className="submission-record-facts g2">
                      <FactsLeft submission={submission} onUpdate={handleActionSuccess} />
                      <FactsRight submission={submission} onUpdate={handleActionSuccess} />
                  </div>

          {isUndecided && (
            <>
              <WorksheetCard 
                submission={submission} 
                onUpdate={onUpdate}
              />

              {isAwaitingReply && (
                <AwaitingBanner 
                  submission={submission}
                  onUpdate={handleActionSuccess}
                />
              )}

              <ActionsRow 
                submission={submission}
                onApprove={async () => {
                  try {
                    const { submissionService } = await import('../services/submissionService');
                    const { toast } = await import('react-hot-toast');
                    await submissionService.approveSubmission(submission.subid, 'Admin');
                    toast.success('Submission approved successfully!');
                    handleActionSuccess();
                  } catch (err: any) {
                    const { toast } = await import('react-hot-toast');
                    toast.error(err.message || 'Failed to approve submission');
                  }
                }}
                onMoreInfo={() => setShowMoreInfo(!showMoreInfo)}
                onReject={() => setShowReject(!showReject)}
                onWithdraw={() => setShowWithdraw(!showWithdraw)}
                onExpire={() => setShowExpire(true)}
              />

              {/* Expire Confirm Modal — renders over everything */}
              {showExpire && (
                <ExpireConfirmModal
                  subid={submission.subid}
                  onConfirm={handleExpireConfirm}
                  onCancel={() => setShowExpire(false)}
                />
              )}

              {showMoreInfo && (
                <MoreInfoComposer 
                  submission={submission}
                  onSuccess={handleActionSuccess}
                  onCancel={() => setShowMoreInfo(false)}
                />
              )}

              {showReject && (
                <RejectPanel 
                  submission={submission}
                  onSuccess={handleActionSuccess}
                  onCancel={() => setShowReject(false)}
                />
              )}

              {showWithdraw && (
                <WithdrawRow 
                  submission={submission}
                  onSuccess={handleActionSuccess}
                  onCancel={() => setShowWithdraw(false)}
                />
              )}
            </>
          )}

          {isDecided && (
            <>
              <VerdictBlock submission={submission} />
              <SKUReservationLine submission={submission} />
            </>
          )}
        </div>

        <ReviewHistory history={submission.history || []} />
      </div>
    </div>
  );
};