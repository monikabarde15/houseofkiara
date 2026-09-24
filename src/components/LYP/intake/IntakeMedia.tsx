// src/components/LYP/intake/IntakeMedia.tsx

import React, { useRef } from 'react';
import { Media } from '../types/submission.types';
import { pluralize } from '../utils/formatter';
import './styles/IntakeMedia.css';

interface IntakeMediaProps {
  media: Media[];
  onChange: (media: Media[]) => void;
}

export const IntakeMedia: React.FC<IntakeMediaProps> = ({ media, onChange }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: 'image',
    }));

    onChange([...media, ...newMedia]);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: 'video',
    }));

    onChange([...media, ...newMedia]);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newMedia = [...media];
    URL.revokeObjectURL(newMedia[index].url);
    newMedia.splice(index, 1);
    onChange(newMedia);
  };

  const photos = media.filter(m => m.kind === 'image');
  const videos = media.filter(m => m.kind === 'video');

  return (
    <div className="intake-media">
      <label className="fld-label">MEDIA</label>

      <div className="intake-media-controls">
        <label className="btn btn-sec btn-sm">
          + Photos
          <input
            ref={photoInputRef}
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
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleAddVideo}
            style={{ display: 'none' }}
          />
        </label>
        <span className="intake-media-count">
          {media.length === 0 ? (
            'No media added yet — save WhatsApp photos to this device and add them here.'
          ) : (
            <>
              {pluralize(photos.length, 'photo')}
              {videos.length > 0 && ` · ${pluralize(videos.length, 'video')}`}
              {' attached'}
            </>
          )}
        </span>
      </div>

      {media.length > 0 && (
        <div className="intake-media-grid">
          {media.map((item, index) => (
            <div key={index} className="intake-media-item">
              {item.kind === 'image' ? (
                <div 
                  className="intake-media-thumb"
                  style={{ backgroundImage: `url(${item.url})` }}
                />
              ) : (
                <div className="intake-media-video">
                  <span className="intake-media-video-play">▶</span>
                  <span className="intake-media-video-name">{item.name}</span>
                </div>
              )}
              <button 
                className="intake-media-remove"
                onClick={() => handleRemove(index)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};