// src/components/Listers/utils/derived.ts

import { Lister, ListerLedger, PayoutTransaction, AttentionFlag, Submission } from '../types/lister.types';

export const calculateLedger = (transactions: PayoutTransaction[]): ListerLedger => {
  let paid = 0;
  let pending = 0;
  let sales = 0;
  let rentals = 0;
  let tv = 0;
  let paidCount = 0;
  let pctSum = 0;
  let pctCount = 0;
  
  for (const tx of transactions) {
    tv += tx.tv;
    
    if (tx.status === 'Paid') {
      paid += tx.amount;
      paidCount++;
      if (tx.type === 'Preloved Sale') sales++;
      else rentals++;
      
      const pct = tx.isDamage ? (tx.stdPct || 0) : tx.pct;
      pctSum += pct;
      pctCount++;
    }
    
    if (tx.status === 'Pending Approval' || tx.status === 'Approved' || tx.status === 'On Hold') {
      pending += tx.amount;
    }
  }
  
  return {
    paid,
    pending,
    sales,
    rentals,
    tv,
    paidCount,
    avgPct: pctCount > 0 ? Math.round((pctSum / pctCount) * 10) / 10 : null,
  };
};

export const calculateAttentionFlags = (
  lister: Lister,
  submissions: Submission[],
  recalls: any[],
  pendingPayouts: PayoutTransaction[]
): AttentionFlag[] => {
  const flags: AttentionFlag[] = [];
  
  // Flag 1: Application to review
  if (lister.status === 'Pending Review') {
    flags.push({
      text: 'Application to review',
      door: 'review',
    });
  }
  
  // Flag 2: Pending payouts
  const pendingCount = pendingPayouts.filter(t => t.status === 'Pending Approval').length;
  if (pendingCount > 0) {
    flags.push({
      text: `${pendingCount} payout${pendingCount > 1 ? 's' : ''} to approve`,
      door: 'payout',
      target: pendingPayouts.find(t => t.status === 'Pending Approval')?.id,
    });
  }
  
  // Flag 3: Bank unverified with money in flight
  if (!lister.bank?.verified && lister.status !== 'Pending Review' && lister.status !== 'Rejected') {
    const hasPending = pendingPayouts.some(t => 
      t.status === 'Pending Approval' || t.status === 'Approved' || t.status === 'On Hold'
    );
    if (hasPending) {
      flags.push({
        text: 'Bank unverified — payouts hold',
        door: 'profile',
      });
    }
  }
  
  // Flag 4: PAN missing
  if (!lister.pan && (lister.status === 'Verified' || lister.status === 'Paused' || lister.status === 'Suspended')) {
    flags.push({
      text: 'PAN missing — 5% TDS',
      door: 'profile',
    });
  }
  
  // Flag 5: Recall requested/scheduled
  // const activeRecalls = recalls.filter(r => r.status === 'Requested' || r.status === 'Scheduled');
  // if (activeRecalls.length > 0) {
  //   flags.push({
  //     text: 'Recall requested / Recall scheduled',
  //     door: 'listings',
  //   });
  // }
  
  // Flag 6: Awaiting info
  const awaitingInfo = submissions.find(s => s.moreInfo && !s.decision && !s.sku);
  if (awaitingInfo) {
    flags.push({
      text: `Awaiting info — ${awaitingInfo.subid}`,
      door: 'submission',
      target: awaitingInfo.subid,
    });
  }
  
  return flags;
};

export const getSubmissionStatus = (submission: Submission): string => {
  // Check if product exists
  if (submission.sku) {
    // Product exists - check product status (simplified)
    // In real implementation, fetch product status
    // For now, assume product exists with status
    return 'Approved & Published';
  }
  
  if (submission.decision) {
    if (submission.decision.what === 'Approved') return 'Approved';
    if (submission.decision.what === 'Rejected') return 'Rejected';
    if (submission.decision.what === 'Withdrawn') return 'Withdrawn';
  }
  
  if (submission.moreInfo) {
    return 'More info requested';
  }
  
  return 'Awaiting review';
};

export const getStatusChipVariant = (status: string): string => {
  const mapping: Record<string, string> = {
    'Approved': 's-live',
    'Pending Review': 's-pend',
    'Paused': 's-paused',
    'Suspended': 's-sold',
    'Rejected': 's-sold',
    'Exited': 's-draft',
    'Paid': 's-live',
    'Pending Approval': 's-pend',
    'Approved & Published': 's-live',
    'Withdrawn': 's-draft',
    'More info requested': 's-pend',
    'Awaiting review': 's-pend',
  };
  return mapping[status] || 's-draft';
};

export const calculateUtilization = (products: any[]) => {
  let live = 0;
  let paused = 0;
  let draft = 0;
  let sold = 0;
  let archived = 0;
  let stale = 0;
  let lifetimeRentals = 0;
  let atHOK = 0;
  let withLister = 0;
  let withCustomer = 0;
  
  const now = new Date();
  const staleLiveDays = 45;
  const staleDraftDays = 30;
  
  for (const product of products) {
    if (product.status === 'Live') {
      live++;
      // Check staleness
      const lastTransaction = product.lastTransactionDate;
      const listedDate = product.listedDate;
      if (lastTransaction) {
        const days = (now.getTime() - new Date(lastTransaction).getTime()) / (1000 * 60 * 60 * 24);
        if (days > staleLiveDays) stale++;
      } else if (listedDate) {
        const days = (now.getTime() - new Date(listedDate).getTime()) / (1000 * 60 * 60 * 24);
        if (days > staleDraftDays) stale++;
      }
    } else if (product.status === 'Paused') paused++;
    else if (product.status === 'Draft') draft++;
    else if (product.status === 'Sold') sold++;
    else if (product.status === 'Archived') archived++;
    
    lifetimeRentals += product.timesRented || 0;
    
    if (product.custody === 'HOK') atHOK++;
    else if (product.custody === 'Lister') withLister++;
    else if (product.custody === 'Customer') withCustomer++;
  }
  
  return { live, paused, draft, sold, archived, stale, lifetimeRentals, atHOK, withLister, withCustomer };
};

export const calculateSupplyInsight = (listers: Lister[], products: any[], transactions: PayoutTransaction[]) => {
  const totalLive = products.filter(p => p.status === 'Live').length;
  const totalTV = transactions.reduce((sum, t) => sum + t.tv, 0);
  
  if (totalLive === 0 && totalTV === 0) return null;
  
  let topLister: Lister | null = null;
  let topLive = 0;
  let topTV = 0;
  
  for (const lister of listers) {
    const listerProducts = products.filter(p => p.listerId === lister.id);
    const liveCount = listerProducts.filter(p => p.status === 'Live').length;
    const listerTV = transactions.filter(t => t.listerId === lister.id).reduce((sum, t) => sum + t.tv, 0);
    
    if (liveCount > topLive || (liveCount === topLive && listerTV > topTV)) {
      topLive = liveCount;
      topTV = listerTV;
      topLister = lister;
    }
  }
  
  if (!topLister || (topLive === 0 && topTV === 0)) return null;
  
  const liveShare = totalLive > 0 ? Math.round((topLive / totalLive) * 100) : 0;
  const tvShare = totalTV > 0 ? Math.round((topTV / totalTV) * 100) : 0;
  
  const isRisk = liveShare >= 50 || tvShare >= 50;
  
  return {
    lister: topLister,
    liveShare,
    tvShare,
    isRisk,
    totalLive,
    totalTV,
  };
};