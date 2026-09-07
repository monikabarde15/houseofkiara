// src/components/products/tabs/ImagesTab.tsx

import React, { useRef, useState } from 'react';
import { Product } from '../../types/product';
import { uploadFile } from '../../../services/uploadApi';
import toast from 'react-hot-toast';

interface ImagesTabProps {
  formData: Partial<Product>;
  onFieldChange: <K extends keyof Product>(field: K, value: Product[K]) => void;
  uploadingImages: boolean;
  setUploadingImages: (loading: boolean) => void;
  onSave?: () => void;
}

export function ImagesTab({ formData, onFieldChange, uploadingImages, setUploadingImages, onSave }: ImagesTabProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = formData.images || [];

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      onFieldChange('images', [...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    
    setUploadingImages(true);
    toast.loading('Uploading media to Cloudinary...', { id: 'prod-upload' });
    try {
      const uploaded = await Promise.all(files.map(file => uploadFile(file, 'product')));
      const newUrls = uploaded.map(file => file.url);
      onFieldChange('images', [...images, ...newUrls]);
      toast.success('Media uploaded to Cloudinary & saved to Product!', { id: 'prod-upload' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Media upload failed', { id: 'prod-upload' });
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    onFieldChange('images', images.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onFieldChange('images', newImages);
  };

  const isVideoUrl = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('/video/upload/');
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-[#e8dfd8] shadow-sm space-y-4">
      <h3 className="font-serif font-bold text-stone-900 text-sm">Visual Assets Carousels (Images & Videos)</h3>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-stone-500 font-medium">Add Image / Video URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="flex-1 p-2 bg-[#fcf9f5] border border-stone-200 rounded text-xs"
            />
            <button 
              type="button" 
              onClick={handleAddImageUrl}
              className="rounded bg-[#1e1412] px-4 py-2 text-xs font-bold text-white hover:bg-[#2c1d1a] transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-stone-500 font-medium text-xs">Or upload from device (Max 10MB Images, 50MB Videos):</span>
          <label className="inline-flex cursor-pointer rounded border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition">
            <input 
              type="file" 
              accept="image/*,video/*" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload}
              ref={fileInputRef}
              disabled={uploadingImages}
            />
            {uploadingImages ? 'Uploading to Cloudinary...' : 'Upload images / videos'}
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((mediaUrl, index) => (
            <div key={`${mediaUrl}-${index}`} className="rounded border border-stone-200 p-2 bg-white">
              {isVideoUrl(mediaUrl) ? (
                <video 
                  src={mediaUrl} 
                  controls 
                  className="h-28 w-full rounded object-cover bg-black" 
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt={`Product Asset ${index + 1}`} 
                  className="h-28 w-full rounded object-cover" 
                />
              )}
              <div className="mt-2 flex justify-between text-[10px]">
                <button 
                  type="button" 
                  disabled={index === 0} 
                  onClick={() => handleMoveImage(index, 'left')}
                  className="disabled:opacity-30 text-stone-600 hover:text-stone-900"
                >
                  ←
                </button>
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(index)} 
                  className="text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Remove
                </button>
                <button 
                  type="button" 
                  disabled={index === images.length - 1} 
                  onClick={() => handleMoveImage(index, 'right')}
                  className="disabled:opacity-30 text-stone-600 hover:text-stone-900"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-[#e8dfd8]">
        <button
          type="button"
          onClick={onSave}
          className="rounded bg-[#C7A55C] px-5 py-2 text-xs font-bold text-stone-900 hover:bg-[#b8931f] transition"
        >
          Save Images
        </button>
      </div>
    </div>
  );
}