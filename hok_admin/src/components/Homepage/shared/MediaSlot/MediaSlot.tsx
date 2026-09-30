/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · MEDIA SLOT (Spec 4.9)
========================================================= */

import React, { useRef } from 'react';
import './MediaSlot.css';
import { PlusIcon, SwapIcon } from '../icons/HomepageIcons';

interface MediaSlotProps {
  id?: string;
  name: string;
  specLine: string;
  needed?: boolean;
  value?: string; // Data URL or Image path
  altText: string;
  onAltTextChange: (alt: string) => void;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  width?: number;
  height?: number;
  className?: string;
}

export const MediaSlot: React.FC<MediaSlotProps> = ({
  id,
  name,
  specLine,
  needed = false,
  value,
  altText,
  onAltTextChange,
  onUpload,
  onRemove,
  width = 132,
  height = 176,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFilled = !!value;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`hok-media-slot ${className}`.trim()} id={id}>
      <div className="hok-media-slot-header">
        <span className="hok-media-slot-name">{name}</span>
        {!isFilled && needed && <span className="hok-media-needed-chip">NEEDED</span>}
      </div>

      <div className="hok-media-spec-line">{specLine}</div>

      <div className="hok-media-slot-row">
        {/* Preview Frame */}
        <div
          className={`hok-media-preview-box ${isFilled ? 'is-filled' : 'is-empty'}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {isFilled ? (
            <img src={value} alt={altText || name} />
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Nothing uploaded yet</span>
            </>
          )}
        </div>

        {/* Form & Actions */}
        <div className="hok-media-controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="hok-field">
            <label className="hok-field-label">Alt text</label>
            <input
              type="text"
              className="hok-field-input"
              value={altText}
              onChange={(e) => onAltTextChange(e.target.value)}
              placeholder="What a screen reader announces, and what shows if the picture fails to load."
            />
          </div>

          <div className="hok-media-actions">
            {!isFilled ? (
              <button
                type="button"
                className="hok-media-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <PlusIcon size={11} />
                <span>Upload</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="hok-media-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <SwapIcon size={11} />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  className="hok-media-btn is-remove"
                  onClick={onRemove}
                >
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
