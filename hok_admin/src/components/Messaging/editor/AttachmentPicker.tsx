// editor/AttachmentPicker.tsx (UPDATED)
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { LiveLink } from '../components/LiveLink';
import './styles/AttachmentPicker.css';

interface DocumentOption {
  id: string;
  name: string;
  kind: string;
}

interface AttachmentPickerProps {
  availableDocuments: DocumentOption[];
  onAdd: (documentId: string) => void;
  disabledIds?: string[];
  hint?: string;
}

export const AttachmentPicker: React.FC<AttachmentPickerProps> = ({
  availableDocuments,
  onAdd,
  disabledIds = [],
  hint,
}) => {
  const [selectedId, setSelectedId] = useState('');

  const handleAdd = () => {
    if (selectedId) {
      onAdd(selectedId);
      setSelectedId('');
    }
  };

  const filteredOptions = availableDocuments.filter(
    (doc) => !disabledIds.includes(doc.id)
  );

  // UPDATED: Default hint references Setup → Documents
  const defaultHint = (
    <>
      Chosen from the master, never typed, so the system knows what to attach. 
      A document that does not exist yet is created in{' '}
      <LiveLink to="Setup → Documents" section="Setup">
        Setup → Documents
      </LiveLink>{' '}
      first.
    </>
  );

  return (
    <div className="msg-attachment-picker">
      <div className="msg-attachment-picker-row">
        <select
          className="msg-attachment-picker-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Also attach...</option>
          {filteredOptions.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} · {doc.kind}
            </option>
          ))}
        </select>
        <Button
          variant="secondary"
          size="small"
          onClick={handleAdd}
          disabled={!selectedId}
        >
          Add
        </Button>
      </div>
      <div className="msg-attachment-picker-hint">
        {hint || defaultHint}
      </div>
    </div>
  );
};