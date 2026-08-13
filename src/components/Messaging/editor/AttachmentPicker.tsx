// editor/AttachmentPicker.tsx
import React, { useState } from 'react';
import { Button } from '../components/Button';
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
  hint = 'Chosen from the master, never typed, so the system knows what to attach. A document that does not exist yet is created in Settings → Documents we issue first.',
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
      <div className="msg-attachment-picker-hint">{hint}</div>
    </div>
  );
};