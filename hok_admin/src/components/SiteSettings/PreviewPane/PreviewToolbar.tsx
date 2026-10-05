import React from 'react';
import './PreviewToolbar.css';
import { EyeCrossLineIcon } from '../shared/icons/SiteSettingsIcons';

interface PreviewToolbarProps {
  mode: 'Desktop' | 'Mobile';
  onChangeMode: (mode: 'Desktop' | 'Mobile') => void;
  activePage: string;
  onChangePage: (page: string) => void;
  onHidePreview: () => void;
}

export const PREVIEW_PAGES = [
  'All pages',
  'Rent',
  'Preloved',
  'Buy New',
  'List Your Piece',
  'Account',
  'Checkout'
];

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  mode,
  onChangeMode,
  activePage,
  onChangePage,
  onHidePreview
}) => {
  return (
    <div className="hok-preview-toolbar">
      {/* Device Mode Switcher */}
      <div className="hok-preview-toolbar-left">
        <button
          type="button"
          className={`hok-preview-mode-btn ${mode === 'Desktop' ? 'is-active' : ''}`}
          onClick={() => onChangeMode('Desktop')}
        >
          Desktop
        </button>
        <button
          type="button"
          className={`hok-preview-mode-btn ${mode === 'Mobile' ? 'is-active' : ''}`}
          onClick={() => onChangeMode('Mobile')}
        >
          Mobile
        </button>
      </div>

      {/* Page Context Selector */}
      <div className="hok-preview-toolbar-center">
        <span className="hok-preview-viewing-label">VIEWING</span>
        <select
          className="hok-preview-page-select"
          value={activePage}
          onChange={(e) => onChangePage(e.target.value)}
        >
          {PREVIEW_PAGES.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>

      {/* Hide Preview Button */}
      <div className="hok-preview-toolbar-right">
        <button
          type="button"
          className="hok-preview-hide-btn"
          onClick={onHidePreview}
          title="Hide preview pane"
        >
          <EyeCrossLineIcon size={14} />
          <span>Hide</span>
        </button>
      </div>
    </div>
  );
};
