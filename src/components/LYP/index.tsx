import React, { useEffect } from 'react';
import { LYPView } from './LYPView';
import { LYPDetailView } from './LYPDetailView';
import { useJourneyStack } from './hooks/useJourneyStack';

interface LYPSubmissionsViewProps {
  onEditingChange?: (isEditing: boolean) => void;
}

export const LYPSubmissionsView: React.FC<LYPSubmissionsViewProps> = ({ onEditingChange }) => {
  const { currentState, pushState } = useJourneyStack();
  const isDetail = currentState?.type === 'detail';

  useEffect(() => {
    onEditingChange?.(isDetail);
  }, [isDetail, onEditingChange]);

  useEffect(() => {
    if (!currentState) {
      pushState({ type: 'section', id: 'lyp' });
    }
  }, [currentState, pushState]);

  if (isDetail && currentState?.id) {
    return <LYPDetailView submissionId={currentState.id} />;
  }

  return <LYPView />;
};

export default LYPSubmissionsView;
