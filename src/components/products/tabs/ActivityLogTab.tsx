// src/components/products/tabs/ActivityLogTab.tsx

import React from 'react';
import { ActivityLog } from '../../types/product';

interface ActivityLogTabProps {
  activityLog: ActivityLog[];
  loading: boolean;
}

function dotColorClasses(type?: string) {
  switch (type) {
    case 'rental':
      return 'bg-emerald-600';
    case 'payout':
      return 'bg-amber-500';
    case 'listing':
      return 'bg-stone-500';
    default:
      return 'bg-stone-400';
  }
}

function formatDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ActivityLogTab({ activityLog, loading }: ActivityLogTabProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200/80 shadow-sm">
      <div className="p-5 pb-3">
        <h3 className="font-serif font-bold text-stone-900 text-sm">Activity Log</h3>
      </div>

      {loading ? (
        <p className="text-stone-400 text-xs px-5 pb-5">Loading activity...</p>
      ) : !activityLog || activityLog.length === 0 ? (
        <p className="text-stone-400 text-xs px-5 pb-5">No activity recorded.</p>
      ) : (
        <div className="px-5 pb-2">
          {activityLog.map((entry, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 py-3.5 ${
                idx !== activityLog.length - 1 ? 'border-b border-stone-100' : ''
              }`}
            >
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColorClasses((entry as any).type)}`} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-800 leading-relaxed">
                  {entry.action}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">{formatDate(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}