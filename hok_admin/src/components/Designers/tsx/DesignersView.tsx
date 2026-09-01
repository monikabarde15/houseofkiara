import React, { useState, useEffect } from 'react';
import Designers from './Designers';
import DesignerEdit from './DesignerEdit';
import { Designer } from '../types/designer.types';
import { designers as initialDesigners } from '../data/mockDesigners';
import * as designerApi from '../../../services/designerApi';

const emptyDesigner: Designer = {
  id: '',
  name: '',
  bio: '',
  slug: '',
  type: 'Indie Designer',
  joinedAt: new Date().toISOString().split('T')[0],
  isNewToHOK: true,
  isFeatured: false,
  featuredOrder: null,
  livePieces: 0,
  totalPieces: 0,
  status: 'Active',
};

interface DesignersViewProps {
  onEditingChange?: (isEditing: boolean) => void;
}

const DesignersView: React.FC<DesignersViewProps> = ({ onEditingChange }) => {
  const [designers, setDesigners] = useState<Designer[]>(initialDesigners);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDesigners = async () => {
    setLoading(true);
    try {
      const data = await designerApi.getDesigners();
      if (Array.isArray(data)) {
        setDesigners(data);
      }
    } catch (err) {
      console.warn('Backend designer API offline or empty, fallback to local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  const selectedDesigner = designers.find((d) => d.id === selectedId) ?? null;

  const handleBack = () => {
    setSelectedId(null);
    setIsCreating(false);
  };

  const designerToEdit = selectedDesigner ?? (isCreating ? emptyDesigner : null);
  const isEditing = !!designerToEdit;

  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  const handleSaveProfile = async (updated: Designer) => {
    try {
      if (isCreating || !updated.id) {
        const saved = await designerApi.createDesigner(updated);
        setDesigners((prev) => [saved, ...prev.filter((d) => d.id !== saved.id)]);
        setSelectedId(saved.id);
        setIsCreating(false);
      } else {
        const saved = await designerApi.updateDesigner(updated.id, updated);
        setDesigners((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
        setSelectedId(saved.id);
      }
    } catch (err) {
      console.error('Failed to save designer via API:', err);
      // Fallback local update
      const fallbackId = updated.id || `DES-${Date.now()}`;
      const withId: Designer = { ...updated, id: fallbackId };
      if (isCreating) {
        setDesigners((prev) => [withId, ...prev]);
        setSelectedId(fallbackId);
        setIsCreating(false);
      } else {
        setDesigners((prev) => prev.map((d) => (d.id === updated.id ? withId : d)));
      }
    }
  };

  const handleMergeProfile = async (targetDesignerId: string) => {
    if (!designerToEdit || !designerToEdit.id) return;
    try {
      await designerApi.deleteDesigner(designerToEdit.id);
    } catch (err) {
      console.error('Failed to delete merged designer via API:', err);
    }
    setDesigners((prev) => prev.filter((d) => d.id !== designerToEdit.id));
    handleBack();
  };

  const handleDeleteProfile = async () => {
    if (!designerToEdit || !designerToEdit.id) return;
    try {
      await designerApi.deleteDesigner(designerToEdit.id);
    } catch (err) {
      console.error('Failed to delete designer via API:', err);
    }
    setDesigners((prev) => prev.filter((d) => d.id !== designerToEdit.id));
    handleBack();
  };

  if (designerToEdit) {
    return (
      <DesignerEdit
        designer={designerToEdit}
        onBack={handleBack}
        allDesigners={designers}
        onSaveProfile={handleSaveProfile}
        onMergeProfile={handleMergeProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    );
  }

  return (
    <Designers
      designers={designers}
      onEditDesigner={(id) => setSelectedId(id)}
      onAddDesigner={() => setIsCreating(true)}
    />
  );
};

export default DesignersView;