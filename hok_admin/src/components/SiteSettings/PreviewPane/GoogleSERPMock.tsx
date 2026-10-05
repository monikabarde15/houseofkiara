import React from 'react';
import './GoogleSERPMock.css';
import { GoogleSettings, BrandSettings } from '../types/siteSettings.types';
import { LIVE_POINTERS } from '../shared/PointerPicker/PointerPicker';

interface GoogleSERPMockProps {
  google: GoogleSettings;
  brand: BrandSettings;
}

export const GoogleSERPMock: React.FC<GoogleSERPMockProps> = ({ google, brand }) => {
  const evaluatePointers = (text?: string): string => {
    if (!text) return '';
    let res = text;
    LIVE_POINTERS.forEach((p) => {
      if (res.includes(p.code)) {
        res = res.split(p.code).join(p.printsToday);
      }
    });
    return res;
  };

  const titleText = evaluatePointers(google?.headline || 'House of Kiara — Luxury Designer Rental & Preloved');
  const descText = evaluatePointers(google?.description || 'Rent authentic luxury couture and designer lehengas.');
  const linkImg = brand?.assets?.linkPreviewImage;
  const imageSource = linkImg?.dataUrl || linkImg?.file;

  return (
    <div className="hok-serp-mock-container">
      {/* 1. Google Search Result Mockup */}
      <div>
        <div className="hok-serp-section-title">Google Search Snippet</div>
        <div className="hok-serp-google-card">
          <div className="hok-serp-google-url-row">
            <span className="hok-serp-favicon" />
            <span className="hok-serp-site-name">{brand?.siteName || 'House of Kiara'}</span>
            <span className="hok-serp-url-breadcrumb">https://houseofkiara.com › rent</span>
          </div>

          <div className="hok-serp-title-link">{titleText}</div>
          <p className="hok-serp-description">{descText}</p>
        </div>
      </div>

      {/* 2. Social Share Card Mockup */}
      <div>
        <div className="hok-serp-section-title">Social Share Preview (WhatsApp / Meta)</div>
        <div className="hok-social-card">
          <div className="hok-social-image-preview">
            {imageSource ? (
              <img src={imageSource} alt="Social preview" />
            ) : (
              <span>1200 × 630 Link Preview</span>
            )}
          </div>
          <div className="hok-social-meta-body">
            <span className="hok-social-domain">houseofkiara.com</span>
            <div className="hok-social-title">{titleText}</div>
            <div className="hok-social-desc">{descText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
