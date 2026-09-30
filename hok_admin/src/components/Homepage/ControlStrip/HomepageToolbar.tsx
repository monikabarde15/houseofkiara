/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · TOP BAR (Spec 5)
========================================================= */

import React, { useState, useRef, useEffect } from 'react';
import './HomepageToolbar.css';
import { SearchMagnifierIcon } from '../shared/icons/HomepageIcons';
import { searchHomepageIndex, HomepageSearchItem } from './searchIndex';
import { ChangedBandInfo } from './diffDetector';

interface HomepageToolbarProps {
  onSelectSearchResult: (item: HomepageSearchItem) => void;
  unsavedChanges: ChangedBandInfo[];
  onPublish: () => void;
  onDiscard: () => void;
  isPublishing?: boolean;
}

export const HomepageToolbar: React.FC<HomepageToolbarProps> = ({
  onSelectSearchResult,
  unsavedChanges,
  onPublish,
  onDiscard,
  isPublishing = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HomepageSearchItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUnsavedOpen, setIsUnsavedOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const unsavedPillRef = useRef<HTMLDivElement>(null);

  const hasUnsaved = unsavedChanges.length > 0;
  const unsavedCount = unsavedChanges.length;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setResults(searchHomepageIndex(val));
      setIsSearchOpen(true);
    } else {
      setResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setIsSearchOpen(false);
  };

  const handleSelectResult = (item: HomepageSearchItem) => {
    onSelectSearchResult(item);
    setIsSearchOpen(false);
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        unsavedPillRef.current &&
        !unsavedPillRef.current.contains(e.target as Node)
      ) {
        setIsUnsavedOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hok-hp-toolbar">
      {/* 5.1 Search input */}
      <div className="hok-hp-search-wrapper" ref={searchContainerRef}>
        <span className="hok-hp-search-icon">
          <SearchMagnifierIcon size={14} />
        </span>

        <input
          type="text"
          className="hok-hp-search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => query.trim() && setIsSearchOpen(true)}
          placeholder='Find a setting — “hero”, “quotes”, “layout”'
        />

        {query && (
          <button
            type="button"
            className="hok-hp-search-clear"
            onClick={handleClearSearch}
            title="Clear"
          >
            ×
          </button>
        )}

        {/* 5.2 Results popover */}
        {isSearchOpen && (
          <div className="hok-hp-search-popover">
            {results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item.id}
                  className="hok-hp-search-row"
                  onClick={() => handleSelectResult(item)}
                >
                  <span>{item.label}</span>
                  <span className="hok-hp-search-band-tag">{item.bandTitle}</span>
                </div>
              ))
            ) : (
              <div className="hok-hp-search-no-results">
                Nothing on the homepage is called “{query}”.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5.3 Actions & Save State */}
      <div className="hok-hp-actions" ref={unsavedPillRef}>
        {!hasUnsaved ? (
          <span className="hok-hp-clean-status">
            Everything here is live on the site
          </span>
        ) : (
          <>
            <button
              type="button"
              className="hok-hp-unsaved-pill"
              onClick={() => setIsUnsavedOpen(!isUnsavedOpen)}
            >
              {unsavedCount} unsaved {unsavedCount === 1 ? 'change' : 'changes'}
            </button>

            {isUnsavedOpen && (
              <div className="hok-hp-unsaved-popover">
                <div className="hok-hp-unsaved-title">Changed but not published</div>
                {unsavedChanges.map((change, idx) => (
                  <div key={idx} className="hok-hp-unsaved-item">
                    {change.bandName}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="hok-hp-discard-btn"
              onClick={onDiscard}
            >
              Discard
            </button>
          </>
        )}

        <button
          type="button"
          className="hok-hp-publish-btn"
          disabled={!hasUnsaved || isPublishing}
          onClick={onPublish}
        >
          {isPublishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  );
};
