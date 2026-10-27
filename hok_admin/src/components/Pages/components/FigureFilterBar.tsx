/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureFilterBar (Spec §5.1, Screens 04 & 05)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useRef, useEffect } from 'react';
import { FigureItem, FigureSubjectMeta } from '../types';

export type FigureStatusFilter = 'all' | 'set-here' | 'waiting' | 'retired' | 'never-printed' | 'changing';

interface FigureFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeStatus: FigureStatusFilter;
  onStatusChange: (status: FigureStatusFilter) => void;
  activeSubject: string; // 'all' or subject id
  onSubjectChange: (subjectId: string) => void;
  subjects: FigureSubjectMeta[];
  figures: FigureItem[];
}

export const FigureFilterBar: React.FC<FigureFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
  activeSubject,
  onSubjectChange,
  subjects,
  figures
}) => {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    };
    if (isSubjectDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSubjectDropdownOpen]);

  // Compute live counts for the 6 status filters (Spec §5.1)
  const counts = {
    all: figures.length,
    setHere: figures.filter(f => f.owner === 'Set here').length,
    waiting: figures.filter(f => f.status === 'waiting').length,
    retired: figures.filter(f => f.status === 'retired').length,
    neverPrinted: figures.filter(f => f.owner === 'Never printed' || f.status === 'never-printed').length,
    changing: figures.filter(f => f.hasScheduled || f.hasPendingChange).length
  };

  // Find active subject label
  const activeSubjectMeta = subjects.find(s => s.id === activeSubject);
  const subjectButtonLabel = activeSubject === 'all' 
    ? 'Every subject' 
    : (activeSubjectMeta?.label || 'Every subject');

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#e6dccb]/70 mb-6">
      {/* Left side: Search input + Status words */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Search input (Spec §5.1: "Find a figure or a value, like 24 hours") */}
        <div className="relative w-64 md:w-72">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#8a7f73]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Find a figure or a value, like 24 hours"
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#e6dccb] rounded-[6px] text-[12.5px] text-[#1a1612] placeholder-[#8a7f73] focus:outline-none focus:border-[#bda67b] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#8a7f73] hover:text-[#1a1612] text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Status filters with counts (Spec §5.1) */}
        <div className="flex items-center gap-4 text-[12.5px]">
          {/* All */}
          <button
            onClick={() => onStatusChange('all')}
            className={`cursor-pointer transition-colors pb-0.5 ${
              activeStatus === 'all'
                ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            All {counts.all}
          </button>

          {/* Set here */}
          <button
            onClick={() => onStatusChange('set-here')}
            className={`cursor-pointer transition-colors pb-0.5 ${
              activeStatus === 'set-here'
                ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Set here {counts.setHere}
          </button>

          {/* Waiting for a decision (terracotta count when above nought) */}
          <button
            onClick={() => onStatusChange('waiting')}
            className={`cursor-pointer transition-colors pb-0.5 ${
              activeStatus === 'waiting'
                ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Waiting for a decision{' '}
            <span className={counts.waiting > 0 ? 'text-[#b85c38] font-medium' : ''}>
              {counts.waiting}
            </span>
          </button>

          {/* Retired (terracotta count when above nought) */}
          <button
            onClick={() => onStatusChange('retired')}
            className={`cursor-pointer transition-colors pb-0.5 ${
              activeStatus === 'retired'
                ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Retired{' '}
            <span className={counts.retired > 0 ? 'text-[#b85c38] font-medium' : ''}>
              {counts.retired}
            </span>
          </button>

          {/* Never printed */}
          <button
            onClick={() => onStatusChange('never-printed')}
            className={`cursor-pointer transition-colors pb-0.5 ${
              activeStatus === 'never-printed'
                ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Never printed {counts.neverPrinted}
          </button>

          {/* Changing */}
          <button
            onClick={() => onStatusChange('changing')}
            className={`cursor-pointer transition-colors pb-0.5 ${
              activeStatus === 'changing'
                ? 'border-b-2 border-[#bda67b] font-medium text-[#1a1612]'
                : 'text-[#73675a] hover:text-[#1a1612]'
            }`}
          >
            Changing {counts.changing}
          </button>
        </div>
      </div>

      {/* Right side: Subject dropdown menu (Spec §5.1) */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsSubjectDropdownOpen(prev => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e6dccb] rounded-[6px] text-[12.5px] text-[#1a1612] hover:border-[#bda67b] transition-colors cursor-pointer"
        >
          <span>{subjectButtonLabel}</span>
          <svg className="w-3.5 h-3.5 text-[#8a7f73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isSubjectDropdownOpen && (
          <div className="absolute right-0 mt-1 w-64 max-h-80 overflow-y-auto bg-white border border-[#e6dccb] rounded-[8px] shadow-lg z-30 py-1">
            <button
              onClick={() => {
                onSubjectChange('all');
                setIsSubjectDropdownOpen(false);
              }}
              className={`w-full text-left px-3.5 py-1.5 text-[12px] flex items-center justify-between cursor-pointer hover:bg-[#f7f2ea] ${
                activeSubject === 'all' ? 'font-semibold text-[#8a6a36] bg-[#fbf9f5]' : 'text-[#1a1612]'
              }`}
            >
              <span>Every subject</span>
              <span className="text-[#8a7f73]">{figures.length}</span>
            </button>
            <div className="border-t border-[#f0ebe3] my-1" />
            {subjects.map(s => {
              const subCount = figures.filter(f => f.subject === s.id).length;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSubjectChange(s.id);
                    setIsSubjectDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-[12px] flex items-center justify-between cursor-pointer hover:bg-[#f7f2ea] ${
                    activeSubject === s.id ? 'font-semibold text-[#8a6a36] bg-[#fbf9f5]' : 'text-[#1a1612]'
                  }`}
                >
                  <span className="truncate pr-2">{s.label}</span>
                  <span className="text-[#8a7f73] shrink-0">{subCount}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FigureFilterBar;
