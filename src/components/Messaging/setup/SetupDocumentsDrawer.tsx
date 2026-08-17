// setup/SetupDocumentsDrawer.tsx
import React, { useState } from 'react';
import { SetupDrawer } from './SetupDrawer';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { LiveLink } from '../components/LiveLink';
import './styles/SetupDocumentsDrawer.css';

interface Document {
  id: string;
  name: string;
  kind: string;
  required: boolean;
  isTemplate: boolean;
  wordCount?: number;
  version: string;
  fileState: 'builtin' | 'uploaded' | 'record' | 'held' | 'missing';
  carriedBy: number;
  description?: string;
  source?: string[];
  usedElsewhere?: string;
}

// FIXED — version no longer carries its own "V" prefix; the render adds "v" itself
const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'GST Invoice', kind: 'Tax document', required: true, isTemplate: false, version: '3', fileState: 'builtin', carriedBy: 4, description: 'Tax invoice for rental of occasion wear', source: ['Orders → Rental', 'Orders → Preloved'] },
  { id: '2', name: 'Rental Agreement', kind: 'Agreement', required: false, isTemplate: true, wordCount: 12, version: '2', fileState: 'held', carriedBy: 3 },
  { id: '3', name: 'Care Card', kind: 'Logistics', required: false, isTemplate: false, version: '1', fileState: 'missing', carriedBy: 2 },
  { id: '4', name: 'Inspection Photographs', kind: 'Evidence', required: false, isTemplate: false, version: '—', fileState: 'record', carriedBy: 1 },
];

const FILE_STATE_LABELS = {
  builtin: { label: 'Generated', color: 'green' as const },
  uploaded: { label: 'Generated', color: 'green' as const },
  record: { label: 'On the record', color: 'green' as const },
  held: { label: 'Held', color: 'green' as const },
  missing: { label: 'No file yet', color: 'terracotta' as const },
};

const KIND_ORDER = ['Tax document', 'Agreement', 'Logistics', 'Evidence', 'Statement', 'Commercial', 'Insert'];

export const SetupDocumentsDrawer: React.FC = () => {
  const [documents] = useState(MOCK_DOCUMENTS);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [showAllMessages, setShowAllMessages] = useState(false);

  const groupedDocuments = KIND_ORDER.reduce((acc, kind) => {
    const docs = documents.filter(d => d.kind === kind);
    if (docs.length > 0) acc[kind] = docs;
    return acc;
  }, {} as Record<string, Document[]>);

  const documentCount = documents.length;
  const oursToHold = documents.filter(d => d.fileState === 'held' || d.fileState === 'missing').length;
  const missingFiles = documents.filter(d => d.fileState === 'missing').length;

  return (
    <SetupDrawer
      title="Documents"
      summary={
        <>
          {documentCount} documents · {oursToHold} of them ours to hold
          {missingFiles > 0 && (
            <> · <span className="msg-drawer-summary-warning">{missingFiles} with no file</span></>
          )}
        </>
      }
      defaultOpen={true}
    >
      <div className="msg-doc-list">
        {Object.entries(groupedDocuments).map(([kind, docs]) => (
          <div key={kind} className="msg-doc-kind-group">
            <div className="msg-doc-kind-heading">{kind}</div>
            {docs.map((doc) => {
              const isOpen = openRow === doc.id;
              const fileState = FILE_STATE_LABELS[doc.fileState];

              return (
                <div key={doc.id} className={`msg-doc-row ${isOpen ? 'msg-doc-row--open' : ''}`}>
                  <div
                    className="msg-doc-row-header"
                    onClick={() => setOpenRow(isOpen ? null : doc.id)}
                  >
                    <svg
                      className={`msg-doc-row-chevron ${isOpen ? 'msg-doc-row-chevron--open' : ''}`}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="4,2 8,6 4,10" />
                    </svg>
                    <span className="msg-doc-row-name">{doc.name}</span>
                    {doc.required && (
                      <Pill status="terracotta" className="msg-doc-pill-required">
                        Required by law
                      </Pill>
                    )}
                    {doc.isTemplate && (
                      <span
                        className="msg-doc-pill-template"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open template filler modal
                        }}
                      >
                        personalised · {doc.wordCount} words
                      </span>
                    )}
                    <div className="msg-doc-row-trailing">
                      {doc.version && doc.version !== '—' && (
                        <span className="msg-doc-version">v{doc.version}</span>
                      )}
                      <Pill status={fileState.color} className="msg-doc-file-state">
                        {fileState.label}
                      </Pill>
                      <span className="msg-doc-carried-by">
                        {doc.carriedBy} message{doc.carriedBy > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="msg-doc-row-body">
                      <div className="msg-doc-row-grid">
                        {/* FLATTENED — no .msg-doc-section wrappers, so label:not(:first-child) spacing works */}
                        <div className="msg-doc-row-left">
                          <div className="msg-doc-label">What it is</div>
                          <div className="msg-doc-text">{doc.description || 'No description'}</div>

                          {doc.source && (
                            <>
                              <div className="msg-doc-label">Where its content comes from</div>
                              {/* FIXED — each source on its own line, not run together */}
                              <div className="msg-doc-text msg-doc-source-list">
                                {doc.source.map((src, i) => (
                                  <div key={i} className="msg-doc-source-line">
                                    <LiveLink to={src} section={src}>
                                      {src}
                                    </LiveLink>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          <div className="msg-doc-label">Where else it is used</div>
                          <div className="msg-doc-text">
                            <strong>Platform-wide.</strong> This is the document House of Kaira issues,
                            not an email copy of one. The same version travels with a message, is served
                            on her order page, and is what Reports counts.{' '}
                            <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">
                              Upload and version it in Platform & Legal → Documents
                            </LiveLink>
                            . This tab decides only which message carries it.
                          </div>

                          <div className="msg-doc-label">The file</div>
                          <div className="msg-doc-file-info">
                            <Pill status={fileState.color} className="msg-doc-file-pill">
                              {fileState.label}
                            </Pill>
                            {doc.fileState === 'held' && (
                              <>
                                <span className="msg-doc-file-detail">Rental_Agreement_v2.pdf · v2 in force from 15 Mar 2026</span>
                                <div className="msg-doc-file-hint">
                                  Uploaded and versioned in <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">
                                    Platform & Legal → Documents
                                  </LiveLink>
                                  . It is the same document her order page and Reports issue, not an email copy of one.
                                </div>
                              </>
                            )}
                            {doc.fileState === 'missing' && (
                              <>
                                <span className="msg-doc-file-detail msg-doc-file-detail--warning">
                                  Nothing is held — this would arrive empty.
                                </span>
                                <Button variant="secondary" size="small">
                                  Upload it in Platform & Legal
                                </Button>
                              </>
                            )}
                            {doc.fileState === 'builtin' && (
                              <>
                                <span className="msg-doc-file-detail">Built from the record</span>
                                {doc.version && doc.version !== '—' && (
                                  <span className="msg-doc-file-version">v{doc.version} in force</span>
                                )}
                              </>
                            )}
                            {doc.fileState === 'record' && (
                              <>
                                <span className="msg-doc-file-detail">Supplied per order on the record itself</span>
                                <span className="msg-doc-file-sub">There is no single copy of it.</span>
                              </>
                            )}
                          </div>

                          <div className="msg-doc-row-actions">
                            <Button variant="secondary" size="small">See the document</Button>
                            <Button variant="secondary" size="small">Change the document</Button>
                          </div>
                        </div>

                        <div className="msg-doc-row-right">
                          <div className="msg-doc-label">Which messages carry it</div>
                          <div className="msg-doc-message-list">
                            <div className="msg-doc-message-toolbar">
                              <Button
                                variant="secondary"
                                size="small"
                                onClick={() => setShowAllMessages(!showAllMessages)}
                              >
                                {showAllMessages ? 'Show only the 4 it travels with' : 'Choose messages'}
                              </Button>
                            </div>
                            {showAllMessages && (
                              <div className="msg-doc-hint">
                                Tick every message this document travels with.
                              </div>
                            )}
                            <div className="msg-doc-message-list-scroll">
                              <div className="msg-doc-message-row msg-doc-message-row--on">
                                <input type="checkbox" checked readOnly />
                                <span className="msg-doc-message-name">Welcome Email</span>
                                <span className="msg-doc-message-audience">Customer</span>
                              </div>
                              <div className="msg-doc-message-row msg-doc-message-row--on">
                                <input type="checkbox" checked readOnly />
                                <span className="msg-doc-message-name">Order Confirmation</span>
                                <span className="msg-doc-message-audience">Customer</span>
                              </div>
                              <div className="msg-doc-message-row">
                                <input type="checkbox" readOnly />
                                <span className="msg-doc-message-name">Return Initiated</span>
                                <span className="msg-doc-message-audience">Customer</span>
                              </div>
                              <div className="msg-doc-message-row msg-doc-message-row--on">
                                <input type="checkbox" checked readOnly />
                                <span className="msg-doc-message-name">Deposit Reminder</span>
                                <span className="msg-doc-message-audience msg-doc-message-audience--off">
                                  Customer · crossed off on this message
                                </span>
                                <button className="msg-doc-put-back">Put back</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="msg-doc-row-footer">
                        <Button variant="secondary" size="small">Export the whole picture</Button>
                        <span className="msg-doc-export-hint">
                          One line per document and message: document, kind, required, message, audience, wording, status.
                        </span>
                      </div>

                      <div className="msg-doc-add-new">
                        <div className="msg-doc-add-grid">
                          <div className="msg-doc-add-field">
                            <label className="msg-doc-add-label">A document we do not have yet</label>
                            <input className="msg-doc-add-input" placeholder="What it is called" />
                          </div>
                          <div className="msg-doc-add-field">
                            <label className="msg-doc-add-label">Kind</label>
                            <select className="msg-doc-add-select">
                              <option>Insert</option>
                              <option>Statement</option>
                              <option>Agreement</option>
                              <option>Logistics</option>
                              <option>Evidence</option>
                              <option>Commercial</option>
                            </select>
                          </div>
                          <div className="msg-doc-add-field">
                            <label className="msg-doc-add-label">Where its content comes from</label>
                            <input className="msg-doc-add-input" placeholder="Which section of the panel" />
                          </div>
                        </div>
                        <Button variant="secondary" size="small">Add it</Button>
                        <div className="msg-doc-add-hint">
                          It joins the master as one we hold, static, with no file.
                          <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">
                            Upload and version it in Platform & Legal → Documents
                          </LiveLink>
                          , then come back here to choose which messages carry it.
                          Tax documents cannot be added, because their rate and code come from Platform & Legal and are decided by law.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </SetupDrawer>
  );
};