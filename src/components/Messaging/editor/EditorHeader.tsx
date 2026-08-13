// editor/EditorHeader.tsx (UPDATED)
import React from 'react';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import './styles/EditorHeader.css';

interface EditorHeaderProps {
  onBack: () => void;
  messageName?: string;
  status?: 'Live' | 'Paused' | 'Not written' | 'Delivered' | 'Bounced';
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  onBack,
  messageName = 'Welcome Email',
  status = 'Not written',
}) => {
  const statusPillMap = {
    'Live': 'green' as const,
    'Paused': 'amber' as const,
    'Not written': 'grey' as const,
    'Delivered': 'blue' as const,
    'Bounced': 'terracotta' as const,
  };

  return (
    <div className="msg-editor-header">
      <Button variant="secondary" size="small" onClick={onBack}>
        ← Back to Messages
      </Button>
    </div>
  );
};