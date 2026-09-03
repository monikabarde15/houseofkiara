// src/components/LYP/utils/derived.ts

import { Submission, SubmissionStats, Intent } from '../types/submission.types';
import { SUB_SLA_HOURS } from './constants';
import { formatDays, formatHours } from './formatter';

const OPS_TODAY = new Date('2026-03-23T12:00:00');

export const parseSubmissionDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr);
  } catch {
    return null;
  }
};

export const getLiveClockHours = (submission: Submission): number => {
  const dateStr = submission.replyAt || submission.submittedAt;
  const date = parseSubmissionDate(dateStr);
  if (!date) return 0;
  const diff = OPS_TODAY.getTime() - date.getTime();
  return Math.max(0, Math.round(diff / 3600000));
};

export const getAwaitingDays = (submission: Submission): number => {
  if (!submission.moreInfo) return 0;
  const date = parseSubmissionDate(submission.moreInfo.on);
  if (!date) return 0;
  const diff = OPS_TODAY.getTime() - date.getTime();
  return Math.max(0, Math.round(diff / 86400000));
};

export const getAgeChip = (submission: Submission): { text: string; class: string } => {
  const isDecided = !!submission.decision;
  if (isDecided) return { text: '', class: '' };

  const hasOpenAsk = !!submission.moreInfo;
  if (hasOpenAsk) {
    const days = getAwaitingDays(submission);
    return {
      text: `Reply - ${formatDays(days)}`,
      class: 'agec-due'
    };
  }

  const hours = getLiveClockHours(submission);
  const isReplied = !!submission.replyAt;
  const prefix = isReplied ? 'Replied - ' : '';

  if (hours <= 35) {
    return { text: `${prefix}${formatHours(hours)}`, class: 'agec-ok' };
  }
  if (hours <= 48) {
    return { text: `${prefix}Due - ${formatHours(hours)}`, class: 'agec-due' };
  }
  const over = hours - SUB_SLA_HOURS;
  return { text: `${prefix}Overdue +${formatHours(over)}`, class: 'agec-over' };
};

export const getSubmissionStatus = (submission: Submission): string => {
  if (submission.decision) {
    return submission.decision.what;
  }
  if (submission.moreInfo) {
    return 'Awaiting Reply';
  }
  if (submission.replyAt) {
    return 'In Review';
  }
  return 'New';
};

export const getStatusClass = (status: string): string => {
  const mapping: Record<string, string> = {
    'New': 's-pend',
    'In Review': 's-pend',
    'Awaiting Reply': 's-pend',
    'Approved': 's-live',
    'Rejected': 's-sold',
    'Withdrawn': 's-draft',
    'Expired': 's-draft'
  };
  return mapping[status] || 's-pend';
};

export const getFirstResponseHours = (submission: Submission): number | null => {
  if (!submission.history || submission.history.length === 0) return null;
  
  const receiptIndex = submission.history.findIndex(h => 
    (h.e || '').toLowerCase().includes('received')
  );
  if (receiptIndex === -1) return null;
  
  // Find first non-receipt action after receipt
  const receiptDate = parseSubmissionDate(submission.history[receiptIndex].t);
  if (!receiptDate) return null;
  
  for (let i = submission.history.length - 1; i >= 0; i--) {
    if (i === receiptIndex) continue;
    const actionDate = parseSubmissionDate(submission.history[i].t);
    if (!actionDate) continue;
    const diff = actionDate.getTime() - receiptDate.getTime();
    return Math.max(0, Math.round(diff / 3600000));
  }
  
  return null;
};

export const calculateMedian = (numbers: number[]): number | null => {
  if (numbers.length === 0) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

export const calculateStats = (submissions: Submission[]): SubmissionStats => {
  const undecided = submissions.filter(s => !s.decision);
  
  // Awaiting Review: undecided, no open ask
  const awaitingReview = undecided.filter(s => !s.moreInfo);
  
  // Awaiting Reply: undecided with open ask
  const awaitingReply = undecided.filter(s => s.moreInfo);
  
  // Approved This Month: approved in current month
  const now = new Date(OPS_TODAY);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const approvedThisMonth = submissions.filter(s => 
    s.decision?.what === 'Approved' && 
    s.decision.on && 
    new Date(s.decision.on).getMonth() === currentMonth &&
    new Date(s.decision.on).getFullYear() === currentYear
  );
  
  // Oldest hours (max live clock)
  let oldestHours = 0;
  for (const s of awaitingReview) {
    const hours = getLiveClockHours(s);
    if (hours > oldestHours) oldestHours = hours;
  }
  
  // Longest wait days
  let longestWaitDays = 0;
  for (const s of awaitingReply) {
    const days = getAwaitingDays(s);
    if (days > longestWaitDays) longestWaitDays = days;
  }
  
  // Median first response
  const responseHours: number[] = [];
  for (const s of submissions) {
    const hours = getFirstResponseHours(s);
    if (hours !== null) responseHours.push(hours);
  }
  const medianFirstResponse = calculateMedian(responseHours);
  
  return {
    awaitingReview: awaitingReview.length,
    awaitingReply: awaitingReply.length,
    approvedThisMonth: approvedThisMonth.length,
    medianFirstResponse,
    oldestHours,
    longestWaitDays
  };
};

export const getIntentClass = (intent: Intent): string => {
  const mapping: Record<Intent, string> = {
    'Rent it': 't-r',
    'Sell it': 't-p',
    'Open to both': 't-n'
  };
  return mapping[intent] || 't-n';
};

export const getChannelClass = (channel: string): string => {
  const mapping: Record<string, string> = {
    'WhatsApp': 't-r',
    'Instagram': 't-p',
    'Website': 't-n',
    'In Person': 't-n'
  };
  return mapping[channel] || 't-n';
};