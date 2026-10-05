import React, { useState, useRef, useEffect } from 'react';
import './ControlStrip.css';
import { SearchMagnifierIcon } from '../shared/icons/SiteSettingsIcons';
import { SearchEntry, searchSettingsIndex } from './searchIndex';
import { ChangedAreaName } from './diffDetector';
import { RegionId } from '../types/siteSettings.types';

interface ControlStripProps {
  onSelectSearchResult: (item: SearchEntry) => void;
  unsavedChanges: ChangedAreaName[];
  onPublish: () => void;
  onDiscard: () => void;
  currentRegion: RegionId;
}

export const ControlStrip: React.FC<ControlStripProps> = ({
  onSelectSearchResult,
  unsavedChanges,
  onPublish,
  onDiscard,
  currentRegion
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchEntry[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChangedListOpen, setIsChangedListOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const changedListRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on region change
  useEffect(() => {
    setIsChangedListOpen(false);
    setIsSearchOpen(false);
  }, [currentRegion]);

  // Handle outside clicks
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        changedListRef.current &&
        !changedListRef.current.contains(e.target as Node)
      ) {
        setIsChangedListOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      const res = searchSettingsIndex(val);
      setSearchResults(res);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchOpen(false);
    searchInputRef.current?.focus();
  };

  const handleResultClick = (item: SearchEntry) => {
    setSearchTerm('');
    setIsSearchOpen(false);
    onSelectSearchResult(item);
  };

  const changeCount = unsavedChanges.length;

  return (
    <div className="hok-control-strip">
      {/* 6.1 Search Field */}
      <div className="hok-search-container" ref={searchContainerRef}>
        <SearchMagnifierIcon />
        <input
          ref={searchInputRef}
          type="text"
          className="hok-search-input"
          placeholder="Find a setting — “whatsapp”, “copyright”, “pixel”"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchTerm.trim()) setIsSearchOpen(true);
          }}
        />
        {searchTerm && (
          <button
            type="button"
            className="hok-search-clear-btn"
            onClick={handleClearSearch}
            data-hint="Clear"
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {isSearchOpen && searchTerm.trim() && (
          <div className="hok-search-results-overlay">
            {searchResults.length > 0 ? (
              searchResults.map((res) => (
                <div
                  key={res.targetFieldId}
                  className="hok-search-result-row"
                  onClick={() => handleResultClick(res)}
                >
                  <span className="hok-search-result-name">{res.name}</span>
                  <span className="hok-search-result-region">{res.regionLabel}</span>
                </div>
              ))
            ) : (
              <div className="hok-search-empty-row">
                Nothing here is called “{searchTerm}”.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6.2 Unsaved state & 6.3 Actions */}
      <div className="hok-control-strip-actions" ref={changedListRef}>
        {changeCount === 0 ? (
          <span className="hok-unsaved-text-clean">Everything here is live on the site.</span>
        ) : (
          <button
            type="button"
            className="hok-unsaved-btn-dirty"
            onClick={() => setIsChangedListOpen((prev) => !prev)}
          >
            {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
          </button>
        )}

        {isChangedListOpen && changeCount > 0 && (
          <div className="hok-changed-list-dropdown">
            <div className="hok-changed-list-heading">Changed but not published</div>
            {unsavedChanges.map((area) => (
              <div key={area} className="hok-changed-list-row">
                {area}
              </div>
            ))}
          </div>
        )}

        {changeCount > 0 && (
          <button type="button" className="hok-btn-secondary" onClick={onDiscard}>
            Discard
          </button>
        )}

        <button
          type="button"
          className="hok-btn-publish"
          disabled={changeCount === 0}
          onClick={onPublish}
        >
          Publish
        </button>
      </div>
    </div>
  );
};
