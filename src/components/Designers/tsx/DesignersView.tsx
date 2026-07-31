import React, { useState } from 'react';
import Designers from './Designers';
import DesignerEdit from './DesignerEdit';
import { Designer } from '../types/designer.types';
import { designers as initialDesigners } from '../data/mockDesigners';

const emptyDesigner: Designer = {
  id: '',
  name: '',
  bio: '',
  slug: '',
  type: 'Indie Designer',
  joinedAt: new Date().toISOString(),
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

  const selectedDesigner = designers.find((d) => d.id === selectedId) ?? null;

  const handleBack = () => {
    setSelectedId(null);
    setIsCreating(false);
  };

  const designerToEdit = selectedDesigner ?? (isCreating ? emptyDesigner : null);
  const isEditing = !!designerToEdit;

  React.useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  const handleSaveProfile = (updated: Designer) => {
    if (isCreating) {
      const withId: Designer = { ...updated, id: crypto.randomUUID() };
      setDesigners((prev) => [...prev, withId]);
    } else {
      setDesigners((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    }
    handleBack();
  };

  const handleMergeProfile = (targetDesignerId: string) => {
    if (!designerToEdit) return;
    // TODO: once pieces are modeled, remap designerToEdit.id's pieces to targetDesignerId
    // and record designerToEdit.slug as a redirect on the target before removing it.
    setDesigners((prev) => prev.filter((d) => d.id !== designerToEdit.id));
    handleBack();
  };

  const handleDeleteProfile = () => {
    if (!designerToEdit) return;
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