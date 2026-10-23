/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureFilters (Spec §5.1, Page 10)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { Search, X } from 'lucide-react';
import { FigureSubjectId } from '../../types';
import { FIGURE_SUBJECTS } from '../../data';

export type FigureFilterStatus =
  | 'all'
  | 'set-here'
  | 'waiting'
  | 'retired'
  | 'never-printed'
  | 'changing';

interface FigureFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeStatusFilter: FigureFilterStatus;
  onSelectStatusFilter: (status: FigureFilterStatus) => void;
  activeSubjectFilter: string; // 'all' or FigureSubjectId
  onSelectSubjectFilter: (subject: string) => void;
  statusCounts: {
    all: number;
    setHere: number;
    waiting: number;
    retired: number;
    neverPrinted: number;
    changing: number;
  };
  subjectCounts: Record<string, number>;
}

export const FigureFilters: React.FC<FigureFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeStatusFilter,
  onSelectStatusFilter,
  activeSubjectFilter,
  onSelectSubjectFilter,
  statusCounts,
  subjectCounts
}) => {
  return (
    <div className="space-y-3 bg-[#fffefb] p-3.5 rounded-[8px] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.02)]">
      {/* Search Input Row (Spec §5.1) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#6e6358] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Find a figure or a value, like 24 hours"
            className="w-full pl-8 pr-8 py-1.5 rounded-[6px] bg-[#f7f2ea] border border-[#d9ccb6] text-xs text-[#1a1612] placeholder-[#6e6358] focus:outline-none focus:border-[#8a6a36] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6e6358] hover:text-[#1a1612] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Subject Filter Dropdown / Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[12.5px] text-[#6e6358] whitespace-nowrap">Subject:</label>
          <select
            value={activeSubjectFilter}
            onChange={e => onSelectSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-[6px] bg-[#f7f2ea] border border-[#d9ccb6] text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36] cursor-pointer"
          >
            <option value="all">Every subject ({statusCounts.all})</option>
            {FIGURE_SUBJECTS.map(s => (
              <option key={s.id} value={s.id}>
                {s.label} ({subjectCounts[s.id] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filters Bar (Spec §5.1: Written as words, underlined in gold when on) */}
      <div className="flex items-center gap-6 overflow-x-auto pt-1 pb-0.5 text-xs border-t border-[#efe7da]">
        {/* All */}
        <button
          onClick={() => onSelectStatusFilter('all')}
          className={`pb-1.5 font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeStatusFilter === 'all'
              ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
              : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
          }`}
        >
          <span>All</span>
          <span className="ml-1 text-[11px] font-mono text-[#6e6358]">{statusCounts.all}</span>
        </button>

        {/* Set here */}
        <button
          onClick={() => onSelectStatusFilter('set-here')}
          className={`pb-1.5 font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeStatusFilter === 'set-here'
              ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
              : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
          }`}
        >
          <span>Set here</span>
          <span className="ml-1 text-[11px] font-mono text-[#6e6358]">{statusCounts.setHere}</span>
        </button>

        {/* Waiting for a decision (terracotta count when > 0) */}
        <button
          onClick={() => onSelectStatusFilter('waiting')}
          className={`pb-1.5 font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeStatusFilter === 'waiting'
              ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
              : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
          }`}
        >
          <span>Waiting for a decision</span>
          <span
            className={`ml-1 text-[11px] font-mono font-medium ${
              statusCounts.waiting > 0 ? 'text-[#a4512f]' : 'text-[#6e6358]'
            }`}
          >
            {statusCounts.waiting}
          </span>
        </button>

        {/* Retired (terracotta count when > 0) */}
        <button
          onClick={() => onSelectStatusFilter('retired')}
          className={`pb-1.5 font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeStatusFilter === 'retired'
              ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
              : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
          }`}
        >
          <span>Retired</span>
          <span
            className={`ml-1 text-[11px] font-mono font-medium ${
              statusCounts.retired > 0 ? 'text-[#a4512f]' : 'text-[#6e6358]'
            }`}
          >
            {statusCounts.retired}
          </span>
        </button>

        {/* Never printed */}
        <button
          onClick={() => onSelectStatusFilter('never-printed')}
          className={`pb-1.5 font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeStatusFilter === 'never-printed'
              ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
              : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
          }`}
        >
          <span>Never printed</span>
          <span className="ml-1 text-[11px] font-mono text-[#6e6358]">{statusCounts.neverPrinted}</span>
        </button>

        {/* Changing (change waiting or scheduled) */}
        <button
          onClick={() => onSelectStatusFilter('changing')}
          className={`pb-1.5 font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeStatusFilter === 'changing'
              ? 'border-b-2 border-[#c9a96e] text-[#1a1612] font-semibold'
              : 'border-b-2 border-transparent text-[#6e6358] hover:text-[#1a1612]'
          }`}
        >
          <span>Changing</span>
          <span className="ml-1 text-[11px] font-mono text-[#3d6e8e]">{statusCounts.changing}</span>
        </button>
      </div>
    </div>
  );
};

export default FigureFilters;
