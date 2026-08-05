// src/components/LYP/hooks/useLightbox.ts

import { useState, useCallback } from 'react';
import { Media } from '../types/submission.types';

export const useLightbox = (media: Media[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoom(1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setZoom(1);
  }, []);

  const goPrev = useCallback(() => {
    if (media.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + media.length) % media.length);
    setZoom(1);
  }, [media.length]);

  const goNext = useCallback(() => {
    if (media.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % media.length);
    setZoom(1);
  }, [media.length]);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.5, 1));
  }, []);

  const hasPrev = media.length > 1 && currentIndex > 0;
  const hasNext = media.length > 1 && currentIndex < media.length - 1;
  const currentMedia = media[currentIndex] || null;

  return {
    isOpen,
    currentIndex,
    currentMedia,
    zoom,
    open,
    close,
    goPrev,
    goNext,
    zoomIn,
    zoomOut,
    hasPrev,
    hasNext,
    totalCount: media.length,
  };
};