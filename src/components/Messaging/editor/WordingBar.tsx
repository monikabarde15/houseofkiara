// editor/WordingBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import './styles/WordingBar.css';

interface Wording {
  id: string;
  name: string;
}

interface WordingBarProps {
  wordings: Wording[];
  activeId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onCopy: () => void;
}

export const WordingBar: React.FC<WordingBarProps> = ({
  wordings,
  activeId,
  onSelect,
  onRename,
  onCopy,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleSave = (id: string) => {
    if (editValue.trim() && editValue.trim() !== '') {
      // Check for duplicates
      const exists = wordings.some(w => w.name === editValue.trim() && w.id !== id);
      if (exists) {
        alert(`There is already a wording called "${editValue.trim()}". Give this one a different name.`);
        return;
      }
      onRename(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSave(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  return (
    <div className="msg-wording-bar">
      <div className="msg-wording-bar-tabs">
        {wordings.map((wording) => (
          <div
            key={wording.id}
            className={`msg-wording-tab ${activeId === wording.id ? 'msg-wording-tab--active' : ''}`}
            onClick={() => onSelect(wording.id)}
            onDoubleClick={() => handleDoubleClick(wording.id, wording.name)}
            title="Double-click to rename"
          >
            {editingId === wording.id ? (
              <input
                ref={inputRef}
                className="msg-wording-rename-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(wording.id)}
                onKeyDown={(e) => handleKeyDown(e, wording.id)}
              />
            ) : (
              wording.name
            )}
          </div>
        ))}
        <div
          className="msg-wording-tab msg-wording-tab--copy"
          onClick={onCopy}
        >
          + Copy this wording
        </div>
      </div>
      <div className="msg-wording-bar-hint">
        Double-click a wording's name to rename it.
      </div>
    </div>
  );
};