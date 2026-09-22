import { API_BASE_URL } from './apiClient';
const BASE = API_BASE_URL;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

export interface UploadedFile {
  url: string;
  publicId: string;
  folder?: string;
  resourceType: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
}

export type UploadFolder =
  | 'product'
  | 'product/instagram'
  | 'submissions'
  | 'order'
  | 'order/issue'
  | 'documents'
  | string;

export const uploadFile = async (file: File, folder: UploadFolder = 'product') => {
  const isVideo = file.type.startsWith('video/');
  const maxLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  const limitLabel = isVideo ? '50 MB' : '10 MB';

  if (file.size > maxLimit) {
    throw new Error(`File "${file.name}" exceeds maximum allowed limit of ${limitLabel}`);
  }

  const data = new FormData();
  data.append('file', file);
  data.append('folder', folder);

  const r = await fetch(`${BASE}/uploads`, { method: 'POST', body: data });
  const b = await r.json().catch(() => ({}));
  if (!r.ok || b.success === false) throw new Error(b.message || 'Upload failed');
  return b.data as UploadedFile;
};

export const deleteUploadedFile = async (publicId: string, resourceType = 'image') => {
  const r = await fetch(`${BASE}/uploads`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, resourceType }),
  });
  const b = await r.json().catch(() => ({}));
  if (!r.ok || b.success === false) throw new Error(b.message || 'Delete failed');
  return b.data;
};
