import React from 'react';
import './BrandRegion.css';
import { BrandAssetSlot } from '../../types/siteSettings.types';

export const TabIconContextMock: React.FC<{ slot: BrandAssetSlot; siteName: string }> = ({
  slot,
  siteName
}) => {
  const isSet = !!slot.file;

  return (
    <div className="hok-asset-context-mock">
      <div className="hok-mock-browser-tabs">
        <div className="hok-mock-browser-tab">
          {isSet ? (
            <img
              src={slot.dataUrl || '/favicon.ico'}
              alt="tab icon"
              className="hok-mock-tab-icon"
            />
          ) : (
            <div
              style={{
                width: 10,
                height: 10,
                border: '1px solid var(--cb)',
                borderRadius: 1
              }}
            />
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {siteName}
          </span>
        </div>
        <div className="hok-mock-browser-tab is-neighbor">
          <span>New Tab</span>
        </div>
      </div>
      {!isSet && (
        <span style={{ fontSize: '9.5px', color: 'var(--muted)' }}>
          Blank sheet is what customers see now.
        </span>
      )}
    </div>
  );
};

export const PhoneIconContextMock: React.FC<{ slot: BrandAssetSlot; siteName: string }> = ({
  slot,
  siteName
}) => {
  const isSet = !!slot.file;

  return (
    <div className="hok-asset-context-mock">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }}>
        <div className="hok-mock-phone-tile">
          {isSet ? (
            <img
              src={slot.dataUrl || '/logo.png'}
              alt="app icon"
              style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ fontSize: '9px', color: 'var(--muted-l)', textAlign: 'center', padding: 2 }}>
              180×180
            </div>
          )}
        </div>
        <span style={{ fontSize: '9px', color: 'var(--charcoal)', fontWeight: 500 }}>
          {siteName}
        </span>
      </div>
      {!isSet && (
        <span style={{ fontSize: '9.5px', color: 'var(--muted)' }}>
          A blurry screenshot of the page is used instead.
        </span>
      )}
    </div>
  );
};

export const LinkPreviewContextMock: React.FC<{
  slot: BrandAssetSlot;
  headline: string;
}> = ({ slot, headline }) => {
  const isSet = !!slot.file;

  return (
    <div className="hok-asset-context-mock">
      <div className="hok-mock-chat-bubble">
        {isSet ? (
          <img
            src={slot.dataUrl || '/og-image.jpg'}
            alt="link preview"
            style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 3 }}
          />
        ) : (
          <div
            style={{
              height: 48,
              backgroundColor: 'var(--canvas)',
              border: '1px dashed var(--ib)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'var(--muted-l)'
            }}
          >
            1200 × 630
          </div>
        )}
        <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.3 }}>
          {headline}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--muted)' }}>houseofkiara.com</div>
      </div>
      {!isSet && (
        <span style={{ fontSize: '9.5px', color: 'var(--muted)' }}>
          Today the link arrives as a bare grey address.
        </span>
      )}
    </div>
  );
};
