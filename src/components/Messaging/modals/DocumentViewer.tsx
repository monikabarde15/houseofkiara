// modals/DocumentViewer.tsx
import React from 'react';
import { Button } from '../components/Button';
import './styles/DocumentViewer.css';

interface DocumentViewerProps {
  isOpen: boolean;
  document: {
    title: string;
    subtitle?: string;
    wordmark?: string;
    rows?: Array<{ label: string; value: string }>;
    clauses?: Array<{ heading: string; text: string }>;
    photos?: string[];
    footer?: string;
    source?: string;
  } | null;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  document,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="msg-doc-viewer-overlay" onClick={handleBackdropClick}>
      <div className="msg-doc-viewer-panel">
        <div className="msg-doc-viewer-content">
          <div className="msg-doc-viewer-header">
            <div className="msg-doc-viewer-wordmark">
              {document.wordmark || 'House of Kaira'}
            </div>
            <div className="msg-doc-viewer-title">{document.title}</div>
            {document.subtitle && (
              <div className="msg-doc-viewer-subtitle">{document.subtitle}</div>
            )}
          </div>

          {document.rows && document.rows.length > 0 && (
            <>
              {document.rows.map((row, index) => (
                <div key={index} className="msg-doc-viewer-row">
                  <span className="msg-doc-viewer-row-label">{row.label}</span>
                  <span className="msg-doc-viewer-row-value">{row.value || '—'}</span>
                </div>
              ))}
            </>
          )}

          {document.clauses && document.clauses.length > 0 && (
            <>
              <div className="msg-doc-viewer-separator" />
              {document.clauses.map((clause, index) => (
                <div key={index} className="msg-doc-viewer-clause">
                  <div className="msg-doc-viewer-clause-heading">{clause.heading}</div>
                  <div className="msg-doc-viewer-clause-text">{clause.text}</div>
                </div>
              ))}
            </>
          )}

          {document.photos && document.photos.length > 0 && (
            <>
              <div className="msg-doc-viewer-separator" />
              <div className="msg-doc-viewer-photos">
                {document.photos.map((_, index) => (
                  <div key={index} className="msg-doc-viewer-photo-placeholder">
                    Photo {index + 1}
                  </div>
                ))}
              </div>
            </>
          )}

          {document.footer && (
            <div className="msg-doc-viewer-footer">
              {document.footer.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {document.source && (
                <div className="msg-doc-viewer-source">
                  <span className="msg-doc-viewer-source-label">Filled in from</span> {document.source}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="msg-doc-viewer-close">
          <Button variant="secondary" size="small" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};