// src/components/Listers/components/ListersTable.tsx

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Lister, ListerFilters } from '../types/lister.types';
import { formatDate, inr, pluralize } from '../utils/formatter';
import { STATUS_CHIP_MAPPING } from '../utils/constants';
import { calculateLedger, calculateAttentionFlags } from '../utils/derived';
import { mockPayouts, mockSubmissions, mockRecalls, mockProducts } from '../data/mockListers';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '../utils/generators';
import './styles/ListersTable.css';

interface ListersTableProps {
  listers: Lister[];
  loading: boolean;
  filters: ListerFilters;
  onFilterChange: (filters: Partial<ListerFilters>) => void;
  onRowClick: (lister: Lister) => void;
  onDeleteLister?: (lister: Lister) => Promise<void>;
  totalCount: number;
}

export const ListersTable: React.FC<ListersTableProps> = ({
  listers,
  loading,
  filters,
  onFilterChange,
  onRowClick,
  onDeleteLister,
  totalCount,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<Lister | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSort = (sortBy: ListerFilters['sortBy']) => {
    if (filters.sortBy === sortBy) {
      onFilterChange({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onFilterChange({ sortBy, sortOrder: 'asc' });
    }
  };

  const getSortIndicator = (column: string) => {
    if (filters.sortBy !== column) return null;
    return (
      <span className="sort-indicator">
        {filters.sortOrder === 'asc' ? '▴' : '▾'}
      </span>
    );
  };

  const openDeleteModal = (lister: Lister, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(lister);
    setDeleteConfirmed(false);
    setDeleting(false);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteConfirmed(false);
    setDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteConfirmed || deleting || !onDeleteLister) return;
    setDeleting(true);
    try {
      await onDeleteLister(deleteTarget);
      alert(`Lister "${deleteTarget.name}" deleted from database successfully.`);
      setDeleteTarget(null);
      setDeleteConfirmed(false);
    } catch (err: any) {
      console.error("Failed to delete lister:", err);
      alert("Error deleting lister from database: " + (err.message || "Failed to delete"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="listers-table-card card">
        <div className="listers-table-loading">Loading listers...</div>
      </div>
    );
  }

  // Sort dynamically on derived values
  const sortedListers = [...listers].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    const aPayouts = mockPayouts.filter(p => p.listerId === a.id);
    const bPayouts = mockPayouts.filter(p => p.listerId === b.id);
    
    const aLedger = calculateLedger(aPayouts);
    const bLedger = calculateLedger(bPayouts);

    const aProducts = mockProducts.filter(p => p.listerId === a.id);
    const bProducts = mockProducts.filter(p => p.listerId === b.id);

    if (filters.sortBy === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (filters.sortBy === 'listings') {
      aVal = aProducts.length;
      bVal = bProducts.length;
    } else if (filters.sortBy === 'earned') {
      aVal = aLedger.paid;
      bVal = bLedger.paid;
    } else if (filters.sortBy === 'pending') {
      aVal = aLedger.pending;
      bVal = bLedger.pending;
    } else if (filters.sortBy === 'joined') {
      aVal = new Date(a.joined).getTime();
      bVal = new Date(b.joined).getTime();
    } else {
      aVal = a.name;
      bVal = b.name;
    }

    if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
    
    if (filters.sortBy !== 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Exporting CSV...");
  };

  return (
    <div className="listers-table-card card">
      <div className="listers-table-toolbar tbar">
        <div className="listers-table-search tsrch">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#8A7E72" strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke="#8A7E72" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>
        <select 
          className="tf"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: (e.target.value as any) || undefined })}
        >
          <option value="">All Statuses</option>
          <option value="Verified">Verified</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Paused">Paused</option>
          <option value="Suspended">Suspended</option>
          <option value="Rejected">Rejected</option>
          <option value="Exited">Exited</option>
        </select>
        <button className="btn btn-sec btn-sm" onClick={handleExportCSV}>Export CSV</button>
      </div>

      <div className="twrap">
        <table className="dt">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Lister {getSortIndicator('name')}
              </th>
              <th>Location</th>
              <th onClick={() => handleSort('listings')}>
                Listings {getSortIndicator('listings')}
              </th>
              <th onClick={() => handleSort('earned')}>
                Total Earned {getSortIndicator('earned')}
              </th>
              <th onClick={() => handleSort('pending')}>
                Pending Payout {getSortIndicator('pending')}
              </th>
              <th>Status</th>
              <th>Attention</th>
              <th onClick={() => handleSort('joined')}>
                Joined {getSortIndicator('joined')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedListers.map((lister) => {
              const listerPayouts = mockPayouts.filter(p => p.listerId === lister.id);
              const listerSubmissions = mockSubmissions.filter(s => s.listerId === lister.id);
              const listerRecalls = mockRecalls.filter(r => r.pieceId === lister.id || r.id === lister.id);
              const listerProducts = mockProducts.filter(p => p.listerId === lister.id);

              const ledger = calculateLedger(listerPayouts);
              const attentionFlags = calculateAttentionFlags(lister, listerSubmissions, listerRecalls, listerPayouts);
              const statusChip = STATUS_CHIP_MAPPING[lister.status] || { variant: 's-live' };
              const waLink = generateWhatsAppLink(lister.phone, getDefaultWhatsAppMessage(lister.name.split(' ')[0]));
              
              return (
                <tr key={lister.id} onClick={() => onRowClick(lister)}>
                  <td>
                    <div className="td-p">{lister.name}</div>
                    <div className="td-s">{lister.email || '—'}</div>
                  </td>
                  <td>{lister.city || '—'}</td>
                  <td>{listerProducts.length}</td>
                  <td className="td-earned">{inr(ledger.paid)}</td>
                  <td>
                    <div className="td-pending">{inr(ledger.pending)}</div>
                    {!lister.bank?.verified && ledger.pending > 0 && (
                      <div className="td-pending-hold">on hold – bank unverified</div>
                    )}
                  </td>
                  <td>
                    <span className={`s-chip ${statusChip.variant}`}>
                      {lister.status}
                    </span>
                  </td>
                  <td>
                    {attentionFlags.length > 0 ? (
                      <div className="td-attention">
                        {attentionFlags.slice(0, 2).map((flag, idx) => (
                          <span key={idx} className="attn-pill">
                            {flag.text}
                          </span>
                        ))}
                        {attentionFlags.length > 2 && (
                          <span className="attn-pill attn-overflow">
                            +{attentionFlags.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="td-attention-empty">—</span>
                    )}
                  </td>
                  <td>{formatDate(lister.joined)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                      {waLink && (
                        <a 
                          href={waLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-wa btn-xs"
                          style={{ padding: '5px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Contact via WhatsApp"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                          </svg>
                        </a>
                      )}
                      <button 
                        className="btn btn-sec btn-xs"
                        style={{ padding: '5px 8px', fontSize: '11px', borderRadius: '4px' }}
                        onClick={() => onRowClick(lister)}
                        title="View Lister Details"
                      >
                        View →
                      </button>
                      <button 
                        className="btn btn-xs"
                        style={{ 
                          padding: '5px 8px', 
                          fontSize: '11px', 
                          borderRadius: '4px', 
                          background: '#FDF1EE', 
                          color: '#B85C38', 
                          border: '1px solid #F5C5B5',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => openDeleteModal(lister, e)}
                        title="Delete Lister"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ftot">
        <span>{pluralize(listers.length, 'lister')} after the status filter</span>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in" onClick={closeDeleteModal}>
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-stone-200 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-600" />
                Delete Lister
              </h3>
              <button onClick={closeDeleteModal} disabled={deleting} className="text-stone-400 hover:text-stone-600 text-lg leading-none cursor-pointer">
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to delete <strong className="text-stone-900">{deleteTarget.name}</strong> ({deleteTarget.email || 'No email'})? This action will remove the record from MongoDB.
              </p>
              
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deleteConfirmed}
                  onChange={(e) => setDeleteConfirmed(e.target.checked)}
                  disabled={deleting}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-xs text-stone-600 leading-relaxed">
                  I understand this permanently deletes this lister's record from MongoDB database and cannot be undone.
                </span>
              </label>
            </div>

            <div className="px-6 py-4 bg-stone-50 flex justify-end gap-3 border-t border-stone-100">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="border border-stone-300 bg-white px-4 py-2 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100 transition disabled:opacity-40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={!deleteConfirmed || deleting}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-md text-xs font-semibold text-white transition cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Lister
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListersTable;