// src/components/LYP/intake/ListerPicker.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Lister } from '../types/submission.types';
import { useListers } from '../../Listers/hooks/useListers';
import { getPhoneDigits } from '../utils/validators';
import './styles/ListerPicker.css';

interface ListerPickerProps {
  onSelect: (listerId: string) => void;
  onNewLister: () => void;
  selectedId: string | null;
  error?: string;
}

export const ListerPicker: React.FC<ListerPickerProps> = ({
  onSelect,
  onNewLister,
  selectedId,
  error,
}) => {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedLister, setSelectedLister] = useState<Lister | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { listers, loading } = useListers({ search: search || undefined });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedId && listers.length > 0) {
      const found = listers.find(l => l.id === selectedId);
      if (found) {
        setSelectedLister(found);
        setSearch(found.name);
      }
    }
  }, [selectedId, listers]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowResults(true);
    if (!value) {
      setSelectedLister(null);
      onSelect('');
    }
  };

  const handleSelect = (lister: Lister) => {
    setSelectedLister(lister);
    setSearch(lister.name);
    setShowResults(false);
    onSelect(lister.id);
  };

  const handleClear = () => {
    setSearch('');
    setSelectedLister(null);
    setShowResults(false);
    onSelect('');
  };

  const isPhoneMatch = (phone: string, searchTerm: string) => {
    const phoneDigits = getPhoneDigits(phone);
    const searchDigits = getPhoneDigits(searchTerm);
    return phoneDigits.includes(searchDigits) || searchDigits.includes(phoneDigits);
  };

  const filteredListers = listers.filter(l => {
    const searchLower = search.toLowerCase();
    return l.name.toLowerCase().includes(searchLower) ||
           (l.email && l.email.toLowerCase().includes(searchLower)) ||
           isPhoneMatch(l.phone, search);
  });

  const displayListers = filteredListers.slice(0, 6);

  return (
    <div className="lister-picker" ref={wrapperRef}>
      <label className="fld-label">Lister — search name or phone</label>
      <div className="lister-picker-input">
        <input
          type="text"
          className={`fld-input ${error ? 'fld-error' : ''}`}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Start typing... a matching phone surfaces the existing record"
        />
        {search && (
          <button className="lister-picker-clear" onClick={handleClear} title="Clear search">
            ×
          </button>
        )}
      </div>
      {error && <div className="fld-error-text">{error}</div>}

      {showResults && search && (
        <div className="lister-picker-results">
          {loading ? (
            <div className="lister-picker-loading">Searching...</div>
          ) : displayListers.length > 0 ? (
            <>
              {displayListers.map((lister) => (
                <div 
                  key={lister.id} 
                  className="lister-picker-result"
                  onClick={() => handleSelect(lister)}
                >
                  <span className="lister-picker-name">{lister.name}</span>
                  <span className="lister-picker-phone">— {lister.phone}</span>
                  <span className="lister-picker-status">{lister.status}</span>
                  {isPhoneMatch(lister.phone, search) && (
                    <span className="tchip warn">Existing — same phone</span>
                  )}
                </div>
              ))}
              {filteredListers.length > 6 && (
                <div className="lister-picker-more">
                  +{filteredListers.length - 6} more results
                </div>
              )}
            </>
          ) : (
            <div className="lister-picker-no-results">
              No matching lister found.
            </div>
          )}
          <div 
            className="lister-picker-new" 
            onClick={onNewLister}
          >
            + New lister — record them right here →
          </div>
        </div>
      )}

      {selectedLister && (
        <div className="lister-picker-selected">
          <span className="tchip ok">
            Lister {selectedLister.name} — {selectedLister.phone}
            <span className="lister-picker-remove" onClick={handleClear}>×</span>
          </span>
          <div className="lister-picker-terms">
            <span className="tchip ok">Terms LST-2026-01 — accepted {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};