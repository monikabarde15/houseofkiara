// src/components/LYP/record/Photographs.tsx

import React, { useState } from 'react';
import { Submission, Media } from '../types/submission.types';
import { pluralize } from '../utils/formatter';
import { Lightbox } from '../modals/Lightbox';
import './styles/Photographs.css';

interface PhotographsProps {
  submission: Submission;
  onUpdate: () => void;
}

export const Photographs: React.FC<PhotographsProps> = ({ submission, onUpdate }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isDecided = !!submission.decision;
  const isUndecided = !isDecided;

  const photos = submission.media?.filter(m => m.kind === 'image') || [];
  const videos = submission.media?.filter(m => m.kind === 'video') || [];
  const hasVideo = videos.length > 0;
  const photoCount = photos.length;
  const isShort = photoCount < 3 && !hasVideo;

  // Form slot labels
  const slotLabels = ['1 - Full view', '2 - Detail / work', '3 - Back view'];

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: 'image',
    }));

    // In production, this would upload to storage
    // For now, we'll just update the local state via callback
    const updatedMedia = [...submission.media, ...newMedia];
    // This would be handled by the parent component
    onUpdate();
  };

  const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: 'video',
    }));

    const updatedMedia = [...submission.media, ...newMedia];
    onUpdate();
  };

  const handleRemoveMedia = (index: number) => {
    // In production, this would delete from storage
    const updatedMedia = [...submission.media];
    URL.revokeObjectURL(updatedMedia[index].url);
    updatedMedia.splice(index, 1);
    onUpdate();
  };

  const getCountDisplay = () => {
    let text = `${photoCount} of 10 - min 3`;
    if (videos.length > 0) {
      text += ` · ${pluralize(videos.length, 'video')}`;
    }
    if (isShort && isUndecided) {
      text += ' — short of the form\'s 3; the call is yours';
    } else if (isShort && isUndecided && hasVideo) {
      text += ' — video covers detail; minimum waived at review';
    }
    return text;
  };

  const getCountClass = () => {
    if (isShort && isUndecided) return 'photo-count-warning';
    return 'photo-count';
  };

  const allMedia = [...photos, ...videos];

  return (
    <div className="photographs">
      <div className="photo-header">
        <span className="photo-header-label">PHOTOGRAPHS</span>
        <span className={getCountClass()}>{getCountDisplay()}</span>
      </div>

      <div className="photo-grid">
        {/* Show existing photos */}
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="photo-tile"
            onClick={() => setLightboxIndex(index)}
          >
            <img src={photo.url} alt={photo.name || `Photo ${index + 1}`} />
            <span className="photo-label">{photo.name || `Photo ${index + 1}`}</span>
          </div>
        ))}

        {/* Show video tiles */}
        {videos.map((video, index) => (
          <div key={`video-${index}`} className="photo-tile video-tile">
            <div className="video-placeholder">
              <span className="video-play-icon">▶</span>
              <span className="video-name">{video.name}</span>
            </div>
          </div>
        ))}

        {/* Show missing slots if no video */}
        {!hasVideo && (
          <>
            {Array.from({ length: Math.max(0, 3 - photoCount) }).map((_, index) => (
              <div key={`missing-${index}`} className="photo-tile photo-tile-missing">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="photo-label">Missing - {slotLabels[index] || `Slot ${index + 1}`}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Video chips */}
      {videos.length > 0 && (
        <div className="video-chips">
          {videos.map((video, index) => (
            <span key={index} className="video-chip" title="Video on record - plays in production">
              {video.name || `Video ${index + 1}`}
            </span>
          ))}
        </div>
      )}

      {/* Add controls - only for undecided */}
      {isUndecided && (
        <>
          <div className="photo-controls">
            <label className="btn btn-sec btn-sm">
              + Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhotos}
                style={{ display: 'none' }}
              />
            </label>
            <label className="btn btn-sec btn-sm">
              + Video
              <input
                type="file"
                accept="video/*"
                onChange={handleAddVideo}
                style={{ display: 'none' }}
              />
            </label>
            <span className="photo-helper">Lister replied with more? Attach it here — straight onto the record.</span>
          </div>

          <div className="photo-form-slots-note">
            Form slots - 1 Full view - 2 Detail / work - 3 Back view - up to 10. Click any photo to enlarge; zoom and Download original live in the viewer. Honest flaw photos are gold - worn shots are a bonus. A detailed video can stand in for photos - the minimum is the form's ask; the call is the desk's.
          </div>
        </>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          media={allMedia}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};