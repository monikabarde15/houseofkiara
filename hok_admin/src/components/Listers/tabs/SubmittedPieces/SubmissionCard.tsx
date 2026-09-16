// src/components/Listers/tabs/SubmittedPieces/SubmissionCard.tsx

import React, { useState } from 'react';
import { Submission } from '../../types/lister.types';
import { formatDate, pluralize, inr } from '../../utils/formatter';
import { CHANNEL_TAG_MAPPING } from '../../utils/constants';
import toast from 'react-hot-toast';
import { getSubmissionStatus, getStatusChipVariant } from '../../utils/derived';
import { useSubmissions } from '../../hooks/useSubmissions';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '../../utils/generators';
import './styles/SubmissionCard.css';

interface SubmissionCardProps {
  submission: Submission;
  listerId: string;
  onUpdate: () => void;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  listerId,
  onUpdate,
}) => {
  const { approveSubmission, rejectSubmission, withdrawSubmission } = useSubmissions(listerId);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');

  const status = getSubmissionStatus(submission);
  const chipVariant = getStatusChipVariant(status);
  const channelTag = CHANNEL_TAG_MAPPING[submission.channel] || CHANNEL_TAG_MAPPING['Website'];
  const isPending = !submission.decision && !submission.sku;
  const isApproved = submission.decision?.what === 'Approved';
  const isRejected = submission.decision?.what === 'Rejected';
  const isWithdrawn = submission.decision?.what === 'Withdrawn';

  const handleApprove = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await approveSubmission(submission.subid, 'Admin');
      toast.success('Submission approved successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve: ' + (error.message || 'Unknown error'));
    } finally { setIsLoading(false); }
  };

  const handleReject = async () => {
    if (isLoading || !rejectReason.trim()) return;
    setIsLoading(true);
    try {
      await rejectSubmission(submission.subid, 'Admin', rejectReason);
      toast.success('Submission rejected successfully');
      setShowRejectBox(false);
      setRejectReason('');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject: ' + (error.message || 'Unknown error'));
    } finally { setIsLoading(false); }
  };

  const handleWithdraw = async () => {
    if (isLoading || !withdrawReason.trim()) return;
    setIsLoading(true);
    try {
      await withdrawSubmission(submission.subid, withdrawReason);
      toast.success('Submission marked as withdrawn');
      setShowWithdrawModal(false);
      setWithdrawReason('');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to withdraw:', error);
      toast.error('Failed to withdraw: ' + (error.message || 'Unknown error'));
    } finally { setIsLoading(false); }
  };

  // Derive timeline nodes
  const rawDate = submission.submittedAt || submission.createdAt || submission.submitted;
  const submittedDate = rawDate ? formatDate(rawDate) : 'Unknown date';
  const approvedDate = submission.decision?.what === 'Approved' ? formatDate(submission.decision.on) : null;
  const rejectedDate = submission.decision?.what === 'Rejected' ? formatDate(submission.decision.on) : null;
  const publishedDate = submission.sku ? approvedDate : null;

  return (
    <div className="submission-card card">
      {/* ── Card Header ── */}
      <div className="sc-hd">
        <div className="sc-hd-left">
          <span className="subid-chip">{submission.subid}</span>
          <span className="sc-piece-name">{submission.piece}</span>
        </div>
        <div className="sc-hd-right">
          <span className={`s-chip ${chipVariant}`}>{status}</span>
        </div>
      </div>

      {/* ── Meta Row ── */}
      <div className="sc-meta">
        <span>{submission.designer}</span>
        <span className="sc-meta-dot">·</span>
        <span>{submission.category}</span>
        <span className={`tag ${channelTag.class}`} style={{ marginLeft: '6px' }}>{submission.channel}</span>
        <span className="sc-meta-dot sc-meta-space">Submitted {submittedDate}</span>
      </div>

      {/* ── Timeline Pipeline ── */}
      <div className="sc-timeline">
        {/* Submitted */}
        <span className="sc-tl-node sc-tl-done">
          <span className="sc-tl-dot sc-tl-dot-done" />
          <span className="sc-tl-label">Submitted · {submittedDate}</span>
        </span>

        <span className="sc-tl-connector" />

        {/* Approved / In Review */}
        {approvedDate ? (
          <span className="sc-tl-node sc-tl-done">
            <span className="sc-tl-dot sc-tl-dot-done" />
            <span className="sc-tl-label">Approved · {approvedDate}</span>
          </span>
        ) : rejectedDate ? (
          <span className="sc-tl-node sc-tl-dead">
            <span className="sc-tl-dot sc-tl-dot-dead" />
            <span className="sc-tl-label sc-tl-dead-text">Rejected · {rejectedDate}</span>
          </span>
        ) : (
          <span className="sc-tl-node sc-tl-pending">
            <span className="sc-tl-dot" />
            <span className="sc-tl-label sc-tl-muted">In review</span>
          </span>
        )}

        <span className="sc-tl-connector" />

        {/* Published */}
        {publishedDate ? (
          <span className="sc-tl-node sc-tl-done">
            <span className="sc-tl-dot sc-tl-dot-done" />
            <span className="sc-tl-label">Published · {publishedDate}</span>
          </span>
        ) : (
          <span className="sc-tl-node">
            <span className="sc-tl-dot" />
            <span className="sc-tl-label sc-tl-muted">Published</span>
          </span>
        )}

        <span className="sc-tl-connector" />

        {/* Outcome */}
        <span className={`sc-tl-node ${submission.sku ? 'sc-tl-done' : ''}`}>
          <span className={`sc-tl-dot ${submission.sku ? 'sc-tl-dot-done' : ''}`} />
          <span className={`sc-tl-label ${submission.sku ? '' : 'sc-tl-muted'}`}>
            {submission.sku ? 'Sold' : 'Outcome'}
          </span>
        </span>
      </div>

      {/* ── Facts Grid ── */}
      <div className="sc-facts">
        <div className="sc-fact">
          <div className="sc-fact-label">Intent</div>
          <div className="sc-fact-value">{submission.intent}</div>
        </div>
        {submission.askSell && (
          <div className="sc-fact">
            <div className="sc-fact-label">Ask — Outright</div>
            <div className="sc-fact-value">{submission.askSell}</div>
          </div>
        )}
        {submission.timesWorn && (
          <div className="sc-fact">
            <div className="sc-fact-label">Times Worn</div>
            <div className="sc-fact-value">{submission.timesWorn}</div>
          </div>
        )}
        {submission.originalPrice && (
          <div className="sc-fact">
            <div className="sc-fact-label">Original Price</div>
            <div className="sc-fact-value">{submission.originalPrice}</div>
          </div>
        )}
        {(submission.colour || submission.size) && (
          <div className="sc-fact">
            <div className="sc-fact-label">Colour · Size</div>
            <div className="sc-fact-value">
              {[submission.colour, submission.size].filter(Boolean).join(' · ') || '—'}
            </div>
          </div>
        )}
        <div className="sc-fact">
          <div className="sc-fact-label">Media</div>
          <div className="sc-fact-value">
            {submission.photos > 0
              ? pluralize(submission.photos, 'photo')
              : '—'}
            {submission.videos > 0 && ` · ${pluralize(submission.videos, 'video')}`}
          </div>
        </div>
      </div>

      {/* ── Condition Claimed ── */}
      {submission.conditionClaim && (
        <div className="sc-condition">
          <div className="sc-condition-label">Condition Claimed</div>
          <div className="sc-condition-text">{submission.conditionClaim}</div>
        </div>
      )}

      {/* ── Notes / lister quote ── */}
      {submission.notes && (
        <div className="sc-notes">
          <span className="sc-quote">"{submission.notes}"</span>
        </div>
      )}

      {/* ── Verdict Strip (Approved) ── */}
      {isApproved && (
        <div className="sc-verdict sc-verdict-sage">
          <span className="sc-verdict-text">
            Approved {formatDate(submission.decision!.on)} by {submission.decision!.by}
            {' — '}created
            {submission.sku && (
              <span className="subid-chip" style={{ margin: '0 4px' }}>{submission.sku}</span>
            )}
            {submission.sku ? ' · currently Sold' : ' pricing pending'}
          </span>
          {submission.sku && (
            <button className="btn btn-sec btn-sm sc-verdict-btn">Open Product →</button>
          )}
        </div>
      )}

      {/* ── Verdict Strip (Rejected) ── */}
      {isRejected && (
        <div className="sc-verdict sc-verdict-terra">
          <span className="sc-verdict-text">
            Rejected {formatDate(submission.decision!.on)} by {submission.decision!.by}
            {submission.decision!.reason ? ` — ${submission.decision!.reason}` : ''}
            {' · Lister notified on WhatsApp.'}
          </span>
        </div>
      )}

      {/* ── Verdict Strip (Withdrawn) ── */}
      {isWithdrawn && (
        <div className="sc-verdict sc-verdict-muted">
          <span className="sc-verdict-text">
            Withdrawn by lister {formatDate(submission.decision!.on)}
            {submission.decision!.reason ? ` — ${submission.decision!.reason}` : ''}
          </span>
        </div>
      )}

      {/* ── Pending Actions ── */}
      {isPending && (
        <div className="sc-actions">
          <div className="sc-actions-row">
            <button className="btn btn-gold btn-sm">Review in queue →</button>
            <button className="btn btn-sec btn-sm" onClick={handleApprove} disabled={isLoading}>
              Approve
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setShowRejectBox(!showRejectBox)} disabled={isLoading}>
              Reject
            </button>
            <button className="sc-withdraw-link" onClick={handleWithdraw} disabled={isLoading}>
              mark withdrawn
            </button>
          </div>
          {showRejectBox && (
            <div className="sc-reject-box">
              <textarea
                className="fld-input"
                placeholder="Reason — goes on the record and to the lister"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
              />
              <button
                className="btn btn-danger btn-sm"
                onClick={handleReject}
                disabled={!rejectReason.trim() || isLoading}
              >
                Confirm Reject
              </button>
            </div>
          )}
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="recall-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="recall-modal-content" style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', color: '#2f2a27' }}>
              Withdraw Submission
            </h3>
            <div className="fld" style={{ marginBottom: '20px' }}>
              <label className="fld-label">Reason for withdrawal</label>
              <input
                type="text"
                className="fld-input"
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="e.g. Lister sold the piece elsewhere"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-sec"
                onClick={() => setShowWithdrawModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                disabled={!withdrawReason.trim() || isLoading}
                onClick={handleWithdraw}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;