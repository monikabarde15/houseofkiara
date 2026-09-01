// editor/AttachmentList.tsx (UPDATED)
import React, { useState } from 'react';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { LiveLink } from '../components/LiveLink';
import './styles/AttachmentList.css';

interface Document {
  id: string;
  name: string;
  tag?: 'required-by-law' | 'added-by-you';
  reason?: string;
  isTaxDocument?: boolean;
  // NEW: Addendum fields
  isTemplate?: boolean;
  wordCount?: number;
  hasFile?: boolean;
  fileState?: 'held' | 'missing' | 'builtin' | 'record' | 'uploaded';
}

interface AttachmentListProps {
  documents: Document[];
  onToggleCrossOff?: (id: string, crossed: boolean) => void;
  onDocumentClick?: (id: string) => void;
  // NEW: Addendum callbacks
  onChangeDocument?: (id: string) => void;
  onTemplateClick?: (id: string) => void;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  documents,
  onToggleCrossOff,
  onDocumentClick,
  onChangeDocument,
  onTemplateClick,
}) => {
  const [crossedOff, setCrossedOff] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    if (documents.find(d => d.id === id)?.isTaxDocument) {
      // Show alert - tax document cannot be crossed off
      return;
    }

    const newCrossed = new Set(crossedOff);
    if (newCrossed.has(id)) {
      newCrossed.delete(id);
    } else {
      newCrossed.add(id);
    }
    setCrossedOff(newCrossed);
    onToggleCrossOff?.(id, !newCrossed.has(id));
  };

  if (documents.length === 0) {
    return (
      <div className="msg-attachment-list-empty">
        Nothing. This message goes out on its own.
      </div>
    );
  }

  return (
    <div className="msg-attachment-list">
      {documents.map((doc) => {
        const isCrossed = crossedOff.has(doc.id);
        const isTax = doc.isTaxDocument;
        const isTemplate = doc.isTemplate;
        const wordCount = doc.wordCount || 0;
        const hasFile = doc.hasFile !== false;
        const fileState = doc.fileState || 'held';

        // Determine file state pill
        let fileStatePill: React.ReactNode = null;
        if (fileState === 'missing') {
          fileStatePill = (
            <span className="msg-attachment-pill msg-attachment-pill--missing">
              not uploaded yet
            </span>
          );
        } else if (isTemplate) {
          fileStatePill = (
            <span 
              className="msg-attachment-pill msg-attachment-pill--template"
              onClick={(e) => {
                e.stopPropagation();
                onTemplateClick?.(doc.id);
              }}
              title="Click to see what this template fills in"
            >
              filled in per recipient - {wordCount} words
            </span>
          );
        }

        return (
          <div
            key={doc.id}
            className={`msg-attachment-list-row ${isCrossed ? 'msg-attachment-list-row--crossed' : ''}`}
          >
            <Chip
              variant="document"
              crossed={isCrossed}
              onClick={() => onDocumentClick?.(doc.id)}
            >
              {doc.name}
            </Chip>

            {/* Tag: required by law */}
            {doc.tag === 'required-by-law' && (
              <span className="msg-attachment-pill msg-attachment-pill--required">
                required by law
              </span>
            )}

            {/* NEW: Template pill - filled in per recipient */}
            {isTemplate && (
              <span 
                className="msg-attachment-pill msg-attachment-pill--template"
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateClick?.(doc.id);
                }}
                title="Click to see what this template fills in"
              >
                filled in per recipient - {wordCount} words
              </span>
            )}

            {/* NEW: Missing file pill */}
            {!hasFile && !isTemplate && (
              <span className="msg-attachment-pill msg-attachment-pill--missing">
                not uploaded yet
              </span>
            )}

            {/* Tag: added by you */}
            {doc.tag === 'added-by-you' && (
              <span className="msg-attachment-pill msg-attachment-pill--added">
                added by you
              </span>
            )}

            {doc.reason && (
              <span className="msg-attachment-list-reason">{doc.reason}</span>
            )}

            <button
              className={`msg-attachment-list-remove ${isTax ? 'msg-attachment-list-remove--locked' : ''}`}
              onClick={() => !isTax && handleToggle(doc.id)}
              disabled={isTax}
              title={isTax ? 'A tax document cannot be turned off' : undefined}
            >
              {isCrossed ? '○' : '×'}
            </button>
          </div>
        );
      })}

      {/* NEW: "Change the document" button */}
      <div className="msg-attachment-list-actions">
        <Button 
          variant="secondary" 
          size="small"
          onClick={() => {
            if (documents.length > 0) {
              onChangeDocument?.(documents[0].id);
            }
          }}
        >
          Change the document
        </Button>
      </div>

      {/* UPDATED: Hint referencing Setup → Documents */}
      <div className="msg-attachment-list-hint">
        Worked out from the rules in{' '}
        <LiveLink to="Setup → Documents" section="Setup">
          Setup → Documents
        </LiveLink>
        , read against this record and this wording. Cross one off to stop it going with this message. 
        Tax documents cannot be crossed off.
      </div>
    </div>
  );
};