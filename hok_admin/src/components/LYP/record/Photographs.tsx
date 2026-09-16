// src/components/LYP/record/Photographs.tsx

import React, { useState } from 'react';
import { Submission, Media } from '../types/submission.types';
import { pluralize } from '../utils/formatter';
import { Lightbox } from '../modals/Lightbox';
import { toast } from 'react-hot-toast';
import { submissionService } from '../services/submissionService';
import { uploadFile } from '../../../services/uploadApi';
import './styles/Photographs.css';

interface PhotographsProps {
  submission: Submission;
  onUpdate: () => void;
}

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60';

const getPhotoUrl = (url: string) => {
  if (!url) return FALLBACK_PHOTO;
  if (url.startsWith('blob:') || url.includes('test.jpg') || url.includes('v12345')) return FALLBACK_PHOTO;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('photo-')) {
    return `https://images.unsplash.com/${url}?w=800&auto=format&fit=crop&q=60`;
  }
  return FALLBACK_PHOTO;
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const result = await uploadFile(file, 'submissions');
  if (!result || !result.url) throw new Error('Cloudinary returned empty response');
  return result.url;
};

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



  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`"${file.name}" exceeds maximum image size limit of 10 MB!`, { id: 'upload' });
        return;
      }
    }

    toast.loading('Uploading photo to Cloudinary...', { id: 'upload' });
    try {
      const uploadedMedia: Media[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        uploadedMedia.push({ name: file.name, url, kind: 'image' });
      }
      const updatedMedia = [...(submission.media || []), ...uploadedMedia];
      await submissionService.updateSubmission(submission.subid, { media: updatedMedia });
      toast.success('Photos uploaded to Cloudinary & saved!', { id: 'upload' });
      onUpdate();
    } catch (err: any) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  const handleAddVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        toast.error(`"${file.name}" exceeds maximum video size limit of 50 MB!`, { id: 'upload' });
        return;
      }
    }

    toast.loading('Uploading video to Cloudinary...', { id: 'upload' });
    try {
      const uploadedMedia: Media[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        uploadedMedia.push({ name: file.name, url, kind: 'video' });
      }
      const updatedMedia = [...(submission.media || []), ...uploadedMedia];
      await submissionService.updateSubmission(submission.subid, { media: updatedMedia });
      toast.success('Video uploaded to Cloudinary & saved!', { id: 'upload' });
      onUpdate();
    } catch (err: any) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  const handleRemoveMedia = async (index: number) => {
    try {
      const updatedMedia = [...(submission.media || [])];
      updatedMedia.splice(index, 1);
      await submissionService.updateSubmission(submission.subid, { media: updatedMedia });
      toast.success('Media item removed');
      onUpdate();
    } catch (err: any) {
      toast.error('Failed to remove media');
    }
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
            <img 
              src={getPhotoUrl(photo.url)} 
              alt={photo.name || `Photo ${index + 1}`} 
              onError={(e) => { e.currentTarget.src = FALLBACK_PHOTO; }}
            />
            <span className="photo-label">{photo.name || `Photo ${index + 1}`}</span>
          </div>
        ))}

        {/* Show video tiles */}
        {videos.map((video, index) => (
          <div key={`video-${index}`} className="photo-tile">
            <video 
              src={video.url} 
              controls
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
            />
            <span className="photo-label">{video.name || `Video ${index + 1}`}</span>
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
          media={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};