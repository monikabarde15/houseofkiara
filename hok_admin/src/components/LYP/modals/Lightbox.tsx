// src/components/LYP/modals/Lightbox.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Media } from '../types/submission.types';
import './styles/Lightbox.css';

interface LightboxProps {
  media: Media[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  media,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const currentMedia = media[currentIndex];
  const isImage = currentMedia?.kind === 'image';
  const totalCount = media.length;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    }
  }, [currentIndex, media]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const goPrev = () => {
    if (totalCount <= 1) return;
    setCurrentIndex(prev => (prev - 1 + totalCount) % totalCount);
    setZoom(1);
  };

  const goNext = () => {
    if (totalCount <= 1) return;
    setCurrentIndex(prev => (prev + 1) % totalCount);
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1));
  };

  const handleDownload = () => {
    if (!currentMedia) return;
    const link = document.createElement('a');
    link.href = currentMedia.url;
    const extension = currentMedia.url.split('.').pop() || 'jpg';
    const name = currentMedia.name || `image-${currentIndex + 1}`;
    link.download = `${name.replace(/\.[^/.]+$/, '')}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentMedia) return null;

  return (
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <div className="lightbox-inner">
        {/* Close button */}
        <button className="lightbox-close" onClick={onClose}>×</button>

        {/* Content */}
        <div className="lightbox-content">
          {isImage ? (
            <img 
              src={currentMedia.url} 
              alt={currentMedia.name || `Photo ${currentIndex + 1}`}
              style={{ transform: `scale(${zoom})` }}
            />
          ) : (
            <div className="lightbox-placeholder">
              <svg viewBox="0 0 24 24" width="36" height="36">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none"/>
                <polyline points="21 15 16 10 5 21" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="lightbox-placeholder-label">{currentMedia.name || 'Video'}</span>
              <span className="lightbox-placeholder-empty">No image file to download yet — upload a photo first.</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        {totalCount >= 2 && (
          <div className="lightbox-nav">
            <button className="lightbox-nav-btn" onClick={goPrev}>
              ← Prev
            </button>
            <span className="lightbox-nav-counter">
              {currentIndex + 1} / {totalCount}
            </span>
            <button className="lightbox-nav-btn" onClick={goNext}>
              Next →
            </button>
          </div>
        )}

        {/* Tools */}
        <div className="lightbox-tools">
          <button className="lightbox-tool-btn" onClick={zoomOut}>
            <svg viewBox="0 0 24 24" width="12" height="12">
              <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.8" fill="none"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="white" strokeWidth="1.8"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="white" strokeWidth="1.8"/>
            </svg>
            Zoom Out
          </button>
          <button className="lightbox-tool-btn" onClick={zoomIn}>
            <svg viewBox="0 0 24 24" width="12" height="12">
              <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.8" fill="none"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="white" strokeWidth="1.8"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="white" strokeWidth="1.8"/>
              <line x1="11" y1="8" x2="11" y2="14" stroke="white" strokeWidth="1.8"/>
            </svg>
            Zoom In
          </button>
          <button className="lightbox-tool-btn" onClick={handleDownload}>
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.8" fill="none"/>
              <polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="1.8" fill="none"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="white" strokeWidth="1.8"/>
            </svg>
            Download
          </button>
        </div>

        {/* Caption */}
        {currentMedia.name && (
          <div className="lightbox-caption">{currentMedia.name}</div>
        )}
      </div>
    </div>
  );
};