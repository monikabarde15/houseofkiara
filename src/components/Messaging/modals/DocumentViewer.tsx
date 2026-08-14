// modals/DocumentViewer.tsx (UPDATED)
import React from 'react';
import { Button } from '../components/Button';
import { LiveLink } from '../components/LiveLink';
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
    source?: string | string[];  // UPDATED: Can be string or array of strings
    sourceLinks?: Array<{ label: string; section: string; to: string }>;  // NEW: For live links
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

  // Helper to render source links
  const renderSourceLinks = () => {
    if (document.sourceLinks && document.sourceLinks.length > 0) {
      return document.sourceLinks.map((link, index) => (
        <React.Fragment key={index}>
          {index > 0 && ' · '}
          <LiveLink to={link.to} section={link.section}>
            {link.label}
          </LiveLink>
        </React.Fragment>
      ));
    }

    if (document.source) {
      if (Array.isArray(document.source)) {
        return document.source.map((src, index) => (
          <React.Fragment key={index}>
            {index > 0 && ' · '}
            <LiveLink to={src} section={src.split(' → ')[0]}>
              {src}
            </LiveLink>
          </React.Fragment>
        ));
      }
      return (
        <LiveLink to={document.source} section={document.source.split(' → ')[0]}>
          {document.source}
        </LiveLink>
      );
    }

    return null;
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

          <div className="msg-doc-viewer-footer">
            {document.footer && (
              <div className="msg-doc-viewer-footer-legal">
                {document.footer.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {/* UPDATED: "Filled in from" section with live links */}
            <div className="msg-doc-viewer-source">
              <span className="msg-doc-viewer-source-label">Filled in from</span>
              {' '}
              {renderSourceLinks() || (
                <span className="msg-doc-viewer-source-empty">—</span>
              )}
            </div>

            {/* NEW: Additional note if document has one */}
            {document.sourceLinks && document.sourceLinks.length > 0 && (
              <div className="msg-doc-viewer-source-note">
                These sections supply the figures for this document. A change there changes every use at once.
              </div>
            )}
          </div>
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