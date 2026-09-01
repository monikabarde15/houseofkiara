// hooks/useWording.ts
import { useState, useCallback } from 'react';

export interface Wording {
  id: string;
  name: string;
  subject: string;
  previewLine: string;
  email: string;
  whatsapp: string;
}

interface UseWordingOptions {
  initialWordings?: Wording[];
  initialActiveId?: string;
}

export const useWording = (options: UseWordingOptions = {}) => {
  const [wordings, setWordings] = useState<Wording[]>(options.initialWordings || []);
  const [activeId, setActiveId] = useState<string>(options.initialActiveId || '');

  const activeWording = wordings.find(w => w.id === activeId) || wordings[0] || null;

  const addWording = useCallback((wording: Omit<Wording, 'id'>) => {
    const newWording = {
      ...wording,
      id: `wording_${Date.now()}`,
    };
    setWordings(prev => [...prev, newWording]);
    setActiveId(newWording.id);
    return newWording;
  }, []);

  const removeWording = useCallback((id: string) => {
    if (wordings.length <= 1) {
      throw new Error('A message needs at least one wording.');
    }
    setWordings(prev => prev.filter(w => w.id !== id));
    if (id === activeId) {
      setActiveId(wordings[0]?.id || '');
    }
  }, [wordings, activeId]);

  const updateWording = useCallback((id: string, data: Partial<Wording>) => {
    setWordings(prev => prev.map(w =>
      w.id === id ? { ...w, ...data } : w
    ));
  }, []);

  const duplicateWording = useCallback((id: string) => {
    const source = wordings.find(w => w.id === id);
    if (!source) return null;
    const existingCopies = wordings.filter(w => w.name.startsWith('Copy of '));
    const copyNumber = existingCopies.length + 1;
    const newWording = {
      ...source,
      id: `wording_${Date.now()}`,
      name: `Copy of ${source.name}${copyNumber > 1 ? ` ${copyNumber}` : ''}`,
    };
    setWordings(prev => [...prev, newWording]);
    setActiveId(newWording.id);
    return newWording;
  }, [wordings]);

  const setActive = useCallback((id: string) => {
    if (wordings.some(w => w.id === id)) {
      setActiveId(id);
    }
  }, [wordings]);

  return {
    wordings,
    activeId,
    activeWording,
    addWording,
    removeWording,
    updateWording,
    duplicateWording,
    setActive,
  };
};