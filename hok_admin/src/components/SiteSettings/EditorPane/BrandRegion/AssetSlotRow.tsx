import React, { useRef } from 'react';
import './BrandRegion.css';
import { BrandAssetSlot } from '../../types/siteSettings.types';

export interface AssetSlotConfig {
  key: string;
  label: string;
  previewWidth: number;
  previewHeight: number;
  required: string;
  showsIn: string;
  whatToPrepare?: string;
  isInverse?: boolean;
  acceptTypes: string;
  allowUseLogoMark?: boolean;
  hasContextMock?: 'tab' | 'phone' | 'linkPreview';
}

interface AssetSlotRowProps {
  config: AssetSlotConfig;
  slot: BrandAssetSlot;
  logoMarkSlot?: BrandAssetSlot;
  siteName: string;
  headline?: string;
  onChange: (updated: BrandAssetSlot) => void;
  onUseLogoMark?: () => void;
}

export const AssetSlotRow: React.FC<AssetSlotRowProps> = ({
  config,
  slot,
  siteName,
  headline = 'House of Kaira — Rent, Buy & List Luxury Indian Occasion Wear',
  onChange,
  onUseLogoMark
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFilled = !!slot.file;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.ceil(file.size / 1024);
    const fileName = file.name;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Off-screen image to get true pixel dimensions (Spec 10.5)
      const img = new Image();
      img.onload = () => {
        onChange({
          file: fileName,
          dataUrl,
          dimensions: `${img.naturalWidth}×${img.naturalHeight}`,
          sizeKb,
          addedBy: 'Soumya',
          addedWhen: 'Just now'
        });
      };
      img.onerror = () => {
        onChange({
          file: fileName,
          dataUrl,
          dimensions: '0×0',
          sizeKb,
          addedBy: 'Soumya',
          addedWhen: 'Just now'
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange({ file: '' });
  };

  return (
    <div className="hok-asset-slot-row" id={`brand-asset-${config.key}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={config.acceptTypes}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Preview Box (Spec 10.5) */}
      <div
        className={`hok-asset-preview-box ${config.isInverse ? 'is-inverse' : ''} ${
          !isFilled ? 'is-empty' : ''
        }`}
        style={{
          width: config.previewWidth,
          height: config.previewHeight
        }}
      >
        {isFilled ? (
          <img
            src={slot.dataUrl || '/logo.png'}
            alt={config.label}
            className="hok-asset-img"
          />
        ) : (
          <div className="hok-asset-empty-label">{config.required}</div>
        )}
      </div>

      {/* Details (Right Column) */}
      <div className="hok-asset-details">
        <div className="hok-asset-header-line">
          <span className="hok-asset-title">{config.label}</span>
          {isFilled ? (
            <span className="hok-asset-name-code">{slot.file}</span>
          ) : (
            <span className="hok-asset-not-set">Not set</span>
          )}
        </div>

        {/* Detail Meta Line */}
        {isFilled && (
          <div className="hok-asset-meta-line">
            {slot.dimensions} · {slot.sizeKb} KB · Added by {slot.addedBy || 'Soumya'} {slot.addedWhen || '12 days ago'}
          </div>
        )}

        {/* Shows In Tag */}
        <div className="hok-asset-tag-row">
          <span className="hok-asset-tag-chip chip-shows-in">SHOWS IN</span>
          <span>{config.showsIn}</span>
        </div>

        {/* What to Prepare Tag */}
        {config.whatToPrepare && (
          <div className="hok-asset-tag-row">
            <span className="hok-asset-tag-chip chip-what-to-prepare">WHAT TO PREPARE</span>
            <span>{config.whatToPrepare}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="hok-asset-actions-row">
          {!isFilled ? (
            <>
              <button
                type="button"
                className="hok-asset-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </button>
              {config.allowUseLogoMark && onUseLogoMark && (
                <button
                  type="button"
                  className="hok-asset-btn hok-asset-btn-use-mark"
                  onClick={onUseLogoMark}
                  data-hint="Copy the logo mark into this slot. Fine to start with — replace it later if you want it cropped differently."
                >
                  Use the logo mark
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                className="hok-asset-btn"
                onClick={() => fileInputRef.current?.click()}
                data-hint="Choose a file from this computer to replace what is here"
              >
                Replace
              </button>

              {slot.dataUrl ? (
                <a
                  href={slot.dataUrl}
                  download={slot.file}
                  className="hok-asset-btn"
                  data-hint="Download the file the site is using now"
                  style={{ textDecoration: 'none' }}
                >
                  Download
                </a>
              ) : (
                <button
                  type="button"
                  className="hok-asset-btn"
                  data-hint="Download the file the site is using now"
                >
                  Download
                </button>
              )}

              <button
                type="button"
                className="hok-btn-text-action is-destructive"
                onClick={handleRemove}
                data-hint="Clear this slot. Nothing on the site will use it until something replaces it."
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
