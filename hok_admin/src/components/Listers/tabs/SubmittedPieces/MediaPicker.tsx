// src/components/Listers/tabs/SubmittedPieces/MediaPicker.tsx

import React, { useRef } from 'react';
import { Media } from '../../types/lister.types';
import { pluralize } from '../../utils/formatter';
import './styles/MediaPicker.css';

interface MediaPickerProps {
  media: Media[];
  onChange: (media: Media[]) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ media, onChange }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: 'image',
      file: file,
    }));

    onChange([...media, ...newMedia]);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleAddVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: 'video',
      file: file,
    }));

    onChange([...media, ...newMedia]);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newMedia = [...media];
    // Revoke object URL to free memory
    URL.revokeObjectURL(newMedia[index].url);
    newMedia.splice(index, 1);
    onChange(newMedia);
  };

  const photos = media.filter(m => m.kind === 'image');
  const videos = media.filter(m => m.kind === 'video');

  return (
    <div className="media-picker">
      <div className="media-picker-controls">
        <label className="btn btn-sec btn-sm">
          + Add Photos
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
          + Add Video
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleAddVideos}
            style={{ display: 'none' }}
          />
        </label>
        <span className="media-picker-count">
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
        <div className="media-picker-grid">
          {media.map((item, index) => (
            <div key={index} className="media-picker-item">
              {item.kind === 'image' ? (
                <div 
                  className="media-picker-thumb"
                  style={{ backgroundImage: `url(${item.url})` }}
                />
              ) : (
                <div className="media-picker-video">
                  <div className="media-picker-video-play">▶</div>
                  <div className="media-picker-video-name">{item.name}</div>
                </div>
              )}
              <button 
                className="media-picker-remove"
                onClick={() => handleRemove(index)}
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

export default MediaPicker;