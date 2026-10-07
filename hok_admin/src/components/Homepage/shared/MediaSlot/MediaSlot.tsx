/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · MEDIA SLOT (Spec 4.9)
========================================================= */

import React, { useRef } from 'react';
import './MediaSlot.css';
import { PlusIcon, SwapIcon } from '../icons/HomepageIcons';

interface MediaSlotProps {
  id?: string;
  name?: string;
  title?: string;
  specLine?: string;
  specText?: string;
  needed?: boolean;
  required?: boolean;
  value?: string; // Data URL or Image path
  imageUrl?: string;
  altText?: string;
  altHint?: string;
  hideAltText?: boolean;
  onAltTextChange?: (alt: string) => void;
  onChangeAlt?: (alt: string) => void;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  width?: number;
  previewWidth?: number;
  height?: number;
  previewHeight?: number;
  className?: string;
}

export const MediaSlot: React.FC<MediaSlotProps> = ({
  id,
  name,
  title,
  specLine,
  specText,
  needed = false,
  required = false,
  value,
  imageUrl,
  altText = '',
  altHint,
  hideAltText = false,
  onAltTextChange,
  onChangeAlt,
  onUpload,
  onRemove,
  width,
  previewWidth,
  height,
  previewHeight,
  className = ''
}) => {
  const displayName = title || name || 'Media slot';
  const displaySpec = specLine || specText || '';
  const isNeeded = needed || required;
  const currentVal = value || imageUrl || '';
  const finalWidth = width ?? previewWidth ?? 132;
  const finalHeight = height ?? previewHeight ?? 176;
  const handleAltChange = onAltTextChange || onChangeAlt || (() => {});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFilled = !!currentVal;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { uploadFile } = await import('../../../../services/uploadApi');
        const res = await uploadFile(file, 'hero');
        if (res && res.url) {
          onUpload(res.url);
          return;
        }
      } catch (err) {
        console.warn('Upload API notice, falling back to local preview:', err);
      }
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
      <div className="hok-media-slot-row">
        {/* Preview Frame Column */}
        <div className="hok-media-preview-col">
          <div
            className={`hok-media-preview-box ${isFilled ? 'is-filled' : 'is-empty'}`}
            style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
          >
            {isFilled ? (
              <img src={currentVal} alt={altText || displayName} />
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

        {/* Form & Actions */}
        <div className="hok-media-controls">
          <div className="hok-media-slot-header">
            <span className="hok-media-slot-name">{displayName}</span>
            {!isFilled && isNeeded && <span className="hok-media-needed-chip">NEEDED</span>}
          </div>

          {displaySpec && <div className="hok-media-spec-line">{displaySpec}</div>}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {!hideAltText && (
            <div className="hok-field">
              <label className="hok-field-label">Alt text</label>
              <input
                type="text"
                className="hok-field-input"
                value={altText}
                onChange={(e) => handleAltChange(e.target.value)}
              />
              <span className="hok-field-hint">
                {altHint || 'What a screen reader announces, and what shows if the picture fails to load.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
