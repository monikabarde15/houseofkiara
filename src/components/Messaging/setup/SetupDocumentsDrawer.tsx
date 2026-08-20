// setup/SetupDocumentsDrawer.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SetupDrawer } from './SetupDrawer';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { LiveLink } from '../components/LiveLink';
import './styles/SetupDocumentsDrawer.css';

interface DocumentWording {
  id: string;
  name: string; // e.g. "Rental · deposit outstanding"
}

interface DocumentMessage {
  id: string;
  name: string;
  audience: string; // "Customer"
  groupLabel: string; // "Customer · Orders" — drives the group heading
  wordings: DocumentWording[]; // empty = message has only one wording (no sub-row shown)
}

interface TemplateWord {
  word: string;
  description: string;
}

interface Document {
  id: string;
  name: string;
  kind: string;
  required: boolean;
  isTemplate: boolean;
  wordCount?: number;
  version?: string;
  fileState: 'builtin' | 'uploaded' | 'record' | 'held' | 'missing';
  carriedBy: number;
  description?: string;
  source?: string[]; // "Where its content comes from" — one live link per line
  figuresFrom?: string[]; // used in "Where else it is used" paragraph, by kind
  fileName?: string;              // literal filename for 'held' docs
  wordingOwner?: string[];        // where the wording is owned — one or more source sections
  fileDateInForce?: string;
  layoutUploaded?: boolean; // true → "Your layout", false → "Built-in layout"
  messages?: DocumentMessage[];
  templateWords?: TemplateWord[]; // the {{placeholders}} a held template fills in per recipient
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'GST invoice',
    kind: 'Tax document',
    required: true,
    isTemplate: false,
    version: '1',
    fileState: 'builtin',
    carriedBy: 1,
    description: '18% under SAC 997326, added on top of the rental',
    source: ['Orders', 'Platform & Legal → Tax & GST'],
    figuresFrom: ['Orders', 'Platform & Legal → Tax & GST'],
    fileDateInForce: '01 Apr 2025',
    layoutUploaded: false,
    messages: [
      {
        id: 'm1',
        name: 'Order Confirmed',
        audience: 'Customer',
        groupLabel: 'Customer · Orders',
        wordings: [
          { id: 'w1', name: 'Rental · deposit outstanding' },
          { id: 'w2', name: 'Rental · deposit paid' },
          { id: 'w3', name: 'Preloved' },
          { id: 'w4', name: 'Buy New' },
          { id: 'w5', name: 'Multi-item' },
        ],
      },
      {
        id: 'm2',
        name: 'Return Initiated',
        audience: 'Customer',
        groupLabel: 'Customer · Orders',
        wordings: [],
      },
    ],
  },
  {
    id: '2',
    name: 'GST invoice, preloved',
    kind: 'Tax document',
    required: true,
    isTemplate: false,
    version: '1',
    fileState: 'builtin',
    carriedBy: 1,
    description: '5% under HSN 6309, added on top of the sale price',
    source: ['Orders', 'Platform & Legal → Tax & GST'],
    figuresFrom: ['Orders', 'Platform & Legal → Tax & GST'],
    fileDateInForce: '01 Apr 2025',
    layoutUploaded: false,
    messages: [
      {
        id: 'm1',
        name: 'Order Confirmed',
        audience: 'Customer',
        groupLabel: 'Customer · Orders',
        wordings: [
          { id: 'w1', name: 'Rental · deposit outstanding' },
          { id: 'w2', name: 'Rental · deposit paid' },
          { id: 'w3', name: 'Preloved' },
          { id: 'w4', name: 'Buy New' },
          { id: 'w5', name: 'Multi-item' },
        ],
      },
    ],
  },
  // no designs yet
  { id: '3', name: 'GST invoice, Buy New', kind: 'Tax document', required: true, isTemplate: false, version: '1', fileState: 'builtin', carriedBy: 1, source: ['Orders → Buy New'] },

  {
    id: '4',
    name: 'Late fee invoice',
    kind: 'Tax document',
    required: true,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 3,
    description: 'A late fee is consideration for the days the piece stayed out, so it is invoiced',
    source: ['Returns → Receivables', 'Orders'],
    figuresFrom: ['Returns → Receivables', 'Orders'],
    messages: [
      {
        id: 'm1',
        name: 'Return Overdue',
        audience: 'Customer',
        groupLabel: 'Customer · Returns',
        wordings: [
          { id: 'w1', name: 'D+1 · first notice' },
          { id: 'w2', name: 'D+3 · second notice' },
          { id: 'w3', name: 'D+7 · final notice' },
        ],
      },
      { id: 'm2', name: 'Late Fee Raised', audience: 'Customer', groupLabel: 'Customer · Receivables', wordings: [] },
      { id: 'm3', name: 'Late Fee Reminder', audience: 'Customer', groupLabel: 'Customer · Receivables', wordings: [] },
    ],
  },
  {
    id: '5',
    name: 'Credit note',
    kind: 'Tax document',
    required: true,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 1,
    description: 'Reverses the original under the code the original carried',
    source: ['Orders', 'Platform & Legal → Tax & GST'],
    figuresFrom: ['Orders', 'Platform & Legal → Tax & GST'],
    messages: [
      { id: 'm1', name: 'Order Cancelled', audience: 'Customer', groupLabel: 'Customer · Orders', wordings: [] },
    ],
  },

  {
    id: '6',
    name: 'Revised invoice',
    kind: 'Tax document',
    required: true,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 1,
    description: 'Reissued when a piece is removed before dispatch',
    source: ['Orders'],
    figuresFrom: ['Orders'],
    messages: [
      { id: 'm1', name: 'Piece Removed From Order', audience: 'Customer', groupLabel: 'Customer · Orders', wordings: [] },
    ],
  },
  // no designs yet
  {
    id: '7',
    name: 'Rental agreement',
    kind: 'Agreement',
    required: false,
    isTemplate: true,
    wordCount: 6,
    version: '1',
    fileState: 'held',
    carriedBy: 5,
    description: 'Care, damage and the return window. Rentals only.',
    source: ['Platform & Legal → Rental Agreement', 'Orders'],
    wordingOwner: ['Platform & Legal → Rental Agreement', 'Orders'],
    fileName: 'HOK-Rental-Agreement.pdf',
    fileDateInForce: '12 Feb 2026',
    templateWords: [
      { word: 'customer_name', description: 'Customer full name' },
      { word: 'piece_name', description: 'Piece as described at intake' },
      { word: 'order_id', description: 'Order number' },
      { word: 'rental_start', description: 'Start date of the rental window' },
      { word: 'rental_end', description: 'End date of the rental window' },
      { word: 'deposit_amount', description: 'Security deposit held' },
    ],
    messages: [
      {
        id: 'm1', name: 'Order Confirmed', audience: 'Customer', groupLabel: 'Customer · Orders',
        wordings: [
          { id: 'w1', name: 'Rental · deposit outstanding' },
          { id: 'w2', name: 'Rental · deposit paid' },
          { id: 'w3', name: 'Preloved' },
          { id: 'w4', name: 'Buy New' },
          { id: 'w5', name: 'Multi-item' },
        ],
      },
      {
        id: 'm2', name: 'Return Overdue', audience: 'Customer', groupLabel: 'Customer · Returns',
        wordings: [
          { id: 'w6', name: 'D+1 · first notice' },
          { id: 'w7', name: 'D+3 · second notice' },
          { id: 'w8', name: 'D+7 · final notice' },
        ],
      },
      { id: 'm3', name: 'Deposit Forfeited', audience: 'Customer', groupLabel: 'Customer · Deposits', wordings: [] },
      { id: 'm4', name: 'Late Fee Raised', audience: 'Customer', groupLabel: 'Customer · Receivables', wordings: [] },
    ],
  },
  {
    id: '8',
    name: 'Lister Terms',
    kind: 'Agreement',
    required: false,
    isTemplate: false,
    version: '1',
    fileState: 'held',
    carriedBy: 2,
    description: 'The platform terms she accepts once, when she joins us as a lister',
    source: ['Platform & Legal → Legal Pages'],
    wordingOwner: ['Platform & Legal → Legal Pages'],
    fileName: 'HOK-Lister-Terms.pdf',
    fileDateInForce: '12 Feb 2026',
    messages: [
      { id: 'm1', name: 'Submission Approved', audience: 'Lister', groupLabel: 'Lister', wordings: [] },
      { id: 'm2', name: 'Lister Terms For Acceptance', audience: 'Lister', groupLabel: 'Lister', wordings: [] },
    ],
  },
  {
    id: '9',
    name: 'Lister agreement',
    kind: 'Agreement',
    required: false,
    isTemplate: true,
    wordCount: 6,
    version: '1',
    fileState: 'held',
    carriedBy: 1,
    description: 'The consignment agreement for one particular piece. Signed per piece, not once.',
    source: ['Submissions', 'Products'],
    wordingOwner: ['Submissions', 'Products'],
    fileName: 'HOK-Consignment-Agreement.pdf',
    fileDateInForce: '02 Mar 2026',
    messages: [
      { id: 'm1', name: 'Submission Approved', audience: 'Lister', groupLabel: 'Lister', wordings: [] },
    ],
    templateWords: [
      { word: 'lister_name', description: 'Lister full name' },
      { word: 'piece_name', description: 'Piece as described at intake' },
      { word: 'submission_id', description: 'Submission number' },
      { word: 'sku', description: 'House number' },
      { word: 'condition_grade', description: 'Pristine, Excellent, Good or Fair' },
      { word: 'payout_pct', description: 'Applied share for this transaction' },
    ],
  },
  {
    id: '10',
    name: 'Prepaid return label',
    kind: 'Logistics',
    required: false,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 1,
    description: 'Travels in the box, so she has nothing to arrange or pay',
    source: ['Dispatch', 'Orders'],
    figuresFrom: ['Dispatch', 'Orders'],
    messages: [
      {
        id: 'm1',
        name: 'Dispatched',
        audience: 'Customer',
        groupLabel: 'Customer · Orders',
        wordings: [
          { id: 'w1', name: 'Rental' },
          { id: 'w2', name: 'Preloved' },
          { id: 'w3', name: 'Buy New' },
        ],
      },
    ],
  },
  {
    id: '11',
    name: 'Inspection photographs',
    kind: 'Evidence',
    required: false,
    isTemplate: false,
    fileState: 'record',
    carriedBy: 3,
    description: 'What we found, so a deduction is never our word against hers',
    source: ['Returns'],
    messages: [
      { id: 'm1', name: 'Damage Assessed', audience: 'Customer', groupLabel: 'Customer · Returns', wordings: [] },
      { id: 'm2', name: 'Deposit Partially Released', audience: 'Customer', groupLabel: 'Customer · Deposits', wordings: [] },
      { id: 'm3', name: 'Damage Compensation', audience: 'Lister', groupLabel: 'Lister', wordings: [] },
    ],
  },
  // no designs yet
  { id: '12', name: 'Deduction statement', kind: 'Statement', required: false, isTemplate: false, fileState: 'builtin', carriedBy: 4 },

  {
    id: '13',
    name: 'Payout advice',
    kind: 'Statement',
    required: false,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 1,
    description: 'Transaction value, her share, our commission, the reference',
    source: ['Payouts'],
    figuresFrom: ['Payouts'],
    messages: [
      { id: 'm1', name: 'Payout Processed', audience: 'Lister', groupLabel: 'Lister', wordings: [] },
    ],
  },
  {
    id: '14',
    name: 'Closing statement',
    kind: 'Statement',
    required: false,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 1,
    description: 'Every payout across the whole period, not just the last one',
    source: ['Payouts → By Lister'],
    figuresFrom: ['Payouts → By Lister'],
    messages: [
      { id: 'm1', name: 'Returning Your Pieces', audience: 'Lister', groupLabel: 'Lister', wordings: [] },
    ],
  },
  {
    id: '15',
    name: 'Purchase order',
    kind: 'Commercial',
    required: false,
    isTemplate: false,
    fileState: 'builtin',
    carriedBy: 1,
    description: 'What the studio ships, to whom, and on what commission',
    source: ['Orders', 'Designers'],
    figuresFrom: ['Orders', 'Designers'],
    messages: [
      { id: 'm1', name: 'Buy New Order To Fulfil', audience: 'Designer', groupLabel: 'Designer Partners', wordings: [] },
    ],
  },
  {
    id: '16',
    name: 'Care card, rental',
    kind: 'Insert',
    required: false,
    isTemplate: false,
    fileState: 'missing',
    carriedBy: 1,
    description: 'How to wear it, what never to attempt, and how it travels home',
    source: ['Master Data → Care Instructions'],
    wordingOwner: ['Master Data → Care Instructions'],
    messages: [
      {
        id: 'm1',
        name: 'Dispatched',
        audience: 'Customer',
        groupLabel: 'Customer · Orders',
        wordings: [
          { id: 'w1', name: 'Rental' },
          { id: 'w2', name: 'Preloved' },
          { id: 'w3', name: 'Buy New' },
        ],
      },
    ],
  },
  // no designs yet
  { id: '17', name: 'Care card, preloved', kind: 'Insert', required: false, isTemplate: false, fileState: 'missing', carriedBy: 1 },
  {
    id: '18',
    name: 'Size and fit guide',
    kind: 'Insert',
    required: false,
    isTemplate: false,
    fileState: 'missing',
    carriedBy: 0,
    description: 'Held in the master with no rule for now. Give it one when you want it going out.',
    source: ['Master Data → Sizes & Fit'],
    wordingOwner: ['Master Data → Sizes & Fit'],
    messages: [],
  },
];

const FILE_STATE_LABELS = {
  builtin: { label: 'Generated', color: 'green' as const },
  uploaded: { label: 'Generated', color: 'green' as const },
  record: { label: 'On the record', color: 'green' as const },
  held: { label: 'Held', color: 'green' as const },
  missing: { label: 'No file yet', color: 'terracotta' as const },
};

const KIND_ORDER = ['Tax document', 'Agreement', 'Logistics', 'Evidence', 'Statement', 'Commercial', 'Insert'];

// Ticks per document → per message → either 'all' (every wording) or an array of ticked wording ids.
// Seeded here to match the design: GST invoice's "Order Confirmed" carries 3 of its 5 wordings.
type TickState = string[] | 'all';
const INITIAL_TICKS: Record<string, Record<string, TickState>> = {
  '1': { m1: ['w1', 'w2', 'w5'] },
  '2': { m1: ['w3'] },
  '4': {
    m1: ['w2', 'w3'], // D+3 second notice and D+7 final notice ticked; D+1 unticked
    m2: [],
    m3: [],
  },
  '5': { m1: [] },
  '6': { m1: [] },
  '7': {
    m1: ['w1', 'w2', 'w5'],
    m2: ['w7', 'w8'],
    m3: [],
    m4: [],
  },
  '8': { m1: [], m2: [] },
  '9': { m1: [] },
  '10': { m1: ['w1'] }, // only Rental ticked
  '11': { m1: [], m2: [], m3: [] },
  '13': { m1: [] },
  '14': { m1: [] },
  '15': { m1: [] },
  '16': { m1: ['w1'] },
  // '18': { m1: ['w1'] },
};

export const SetupDocumentsDrawer: React.FC = () => {
  const [documents] = useState(MOCK_DOCUMENTS);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [showAllByDoc, setShowAllByDoc] = useState<Record<string, boolean>>({});
  const [ticks, setTicks] = useState(INITIAL_TICKS);
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);

  const groupedDocuments = KIND_ORDER.reduce((acc, kind) => {
    const docs = documents.filter(d => d.kind === kind);
    if (docs.length > 0) acc[kind] = docs;
    return acc;
  }, {} as Record<string, Document[]>);

  const documentCount = documents.length;
  const oursToHold = documents.filter(d => d.fileState === 'held' || d.fileState === 'missing').length;
  const missingFiles = documents.filter(d => d.fileState === 'missing').length;

  const isMessageOn = (docId: string, messageId: string) => {
    return ticks[docId]?.[messageId] !== undefined;
  };

  const toggleMessage = (docId: string, message: DocumentMessage) => {
    setTicks(prev => {
      const docTicks = { ...(prev[docId] || {}) };
      if (isMessageOn(docId, message.id)) {
        delete docTicks[message.id];
      } else {
        docTicks[message.id] = message.wordings.length > 1 ? 'all' : [];
      }
      return { ...prev, [docId]: docTicks };
    });
  };

  const toggleWording = (docId: string, message: DocumentMessage, wordingId: string) => {
    setTicks(prev => {
      const docTicks = { ...(prev[docId] || {}) };
      const current = docTicks[message.id];
      const allIds = message.wordings.map(w => w.id);
      let currentSet = current === 'all' ? [...allIds] : (current || []);
      currentSet = currentSet.includes(wordingId)
        ? currentSet.filter(id => id !== wordingId)
        : [...currentSet, wordingId];

      // Unticking the last wording removes the pairing entirely (spec 3.8.1)
      if (currentSet.length === 0) {
        delete docTicks[message.id];
        return { ...prev, [docId]: docTicks };
      }
      docTicks[message.id] = currentSet.length === allIds.length ? 'all' : currentSet;
      return { ...prev, [docId]: docTicks };
    });
  };

  const toggleEveryWording = (docId: string, message: DocumentMessage) => {
    setTicks(prev => {
      const docTicks = { ...(prev[docId] || {}) };
      const current = docTicks[message.id];
      docTicks[message.id] = current === 'all' ? [message.wordings[0].id] : 'all';
      return { ...prev, [docId]: docTicks };
    });
  };

  const previewDoc = documents.find(d => d.id === previewDocId);
  const viewerDoc = documents.find(d => d.id === viewerDocId);

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
              const docMessages = doc.messages || [];
              const showAll = showAllByDoc[doc.id] || false;
              const carriedCount = docMessages.filter(m => isMessageOn(doc.id, m.id)).length;
              const visibleMessages = showAll ? docMessages : docMessages.filter(m => isMessageOn(doc.id, m.id));

              // Group visible messages by their groupLabel, preserving first-seen order
              const groups: string[] = [];
              const byGroup: Record<string, DocumentMessage[]> = {};
              visibleMessages.forEach(m => {
                if (!byGroup[m.groupLabel]) { byGroup[m.groupLabel] = []; groups.push(m.groupLabel); }
                byGroup[m.groupLabel].push(m);
              });

              return (
                <div key={doc.id} className={`msg-doc-row ${isOpen ? 'msg-doc-row--open' : ''}`}>
                  <div className="msg-doc-row-header" onClick={() => setOpenRow(isOpen ? null : doc.id)}>
                    <svg
                      className={`msg-doc-row-chevron ${isOpen ? 'msg-doc-row-chevron--open' : ''}`}
                      viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="4,2 8,6 4,10" />
                    </svg>
                    <span className="msg-doc-row-name">{doc.name}</span>
                    {doc.required && (
                      <Pill status="terracotta" className="msg-doc-pill-required">Required by law</Pill>
                    )}
                    {doc.isTemplate && (
                      <span
                        className="msg-doc-pill-template"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewDocId(doc.id);
                        }}
                      >
                        personalised · {doc.wordCount} words
                      </span>
                    )}
                    <div className="msg-doc-row-trailing">
                      {doc.version && <span className="msg-doc-version">v{doc.version}</span>}
                      <Pill status={fileState.color} className="msg-doc-file-state">{fileState.label}</Pill>
                      <span className="msg-doc-carried-by">
                        {doc.carriedBy === 0 ? 'travels with nothing' : `${doc.carriedBy} message${doc.carriedBy > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="msg-doc-row-body">
                      <div className="msg-doc-row-grid">
                        <div className="msg-doc-row-left">
                          <div className="msg-doc-label">What it is</div>
                          <div className="msg-doc-text">{doc.description || 'No description'}</div>

                          {doc.source && (
                            <>
                              <div className="msg-doc-label">Where its content comes from</div>
                              <div className="msg-doc-text msg-doc-source-list">
                                {doc.source.map((src, i) => (
                                  <div key={i} className="msg-doc-source-line">
                                    <LiveLink to={src} section={src}>{src}</LiveLink>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          <div className="msg-doc-label">Where else it is used</div>
                          <div className="msg-doc-text">
                            <strong>Platform-wide.</strong> This is the document House of Kaira issues,
                            not an email copy of one. The same version travels with a message, is served
                            on her order page, and is what Reports counts. It is uploaded and versioned in{' '}
                            <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">Platform & Legal, Documents</LiveLink>
                            ; what this tab decides is which message carries it.
                            {doc.figuresFrom && doc.fileState === 'builtin' && (
                              <>
                                {' '}Its figures come from{' '}
                                {doc.figuresFrom.map((f, i) => (
                                  <React.Fragment key={f}>
                                    <LiveLink to={f} section={f}>{f}</LiveLink>
                                    {i < doc.figuresFrom!.length - 1 ? ', ' : ''}
                                  </React.Fragment>
                                ))}
                                , so a change there changes every use at once. Its layout is built in code,
                                so a new format is specified below and built by the team.
                              </>
                            )}
                          </div>
                          {doc.fileState === 'record' && doc.source && (
                            <div className="msg-doc-text">
                              Supplied per order in{' '}
                              <LiveLink to={doc.source[0]} section={doc.source[0]}>{doc.source[0]}</LiveLink>
                              . Nothing about it is held here.
                            </div>
                          )}

                          {(doc.fileState === 'held' || doc.fileState === 'missing') && doc.wordingOwner && (
                            <div className="msg-doc-text">
                              The file is held here, and the wording it is based on is owned in{' '}
                              {doc.wordingOwner.map((owner, i) => (
                                <React.Fragment key={owner}>
                                  <LiveLink to={owner} section={owner}>{owner}</LiveLink>
                                  {i < doc.wordingOwner!.length - 1 ? ' ' : ''}
                                </React.Fragment>
                              ))}
                              . Change the wording there; upload the replacement here.
                            </div>
                          )}

                          <div className="msg-doc-label">The file</div>
                          <div className="msg-doc-file-info">
                            {doc.fileState === 'builtin' && (
                              <>
                                <div className="msg-doc-file-pill-row">
                                  <Pill status="green" className="msg-doc-file-pill">
                                    {doc.layoutUploaded ? 'Your layout' : 'Built-in layout'}
                                  </Pill>
                                  <span className="msg-doc-file-pill-grey">Built from the record</span>
                                </div>
                                {doc.version && doc.fileDateInForce ? (
                                  <span className="msg-doc-file-version">v{doc.version} in force from {doc.fileDateInForce}</span>
                                ) : (
                                  <span className="msg-doc-file-version">no version yet</span>
                                )}
                                <div className="msg-doc-file-hint">
                                  Uploaded and versioned in{' '}
                                  <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">Platform & Legal, Documents</LiveLink>
                                  , because it is the same document her order page and Reports issue, not an email copy of one.
                                </div>
                              </>
                            )}

                            {doc.fileState === 'held' && (
                              <>
                                <div className="msg-doc-file-pill-row">
                                  <Pill status="green" className="msg-doc-file-pill">Held</Pill>
                                  <span className="msg-doc-file-pill-grey">
                                    {doc.isTemplate ? `Filled in per recipient · ${doc.wordCount} words` : 'The same for everyone'}
                                  </span>
                                </div>
                                <span className="msg-doc-file-detail">
                                  {doc.fileName || `${doc.name.replace(/\s+/g, '_')}_v${doc.version}.pdf`} · v{doc.version} in force{doc.fileDateInForce ? ` from ${doc.fileDateInForce}` : ''}
                                </span>
                                <div className="msg-doc-file-hint">
                                  Uploaded and versioned in{' '}
                                  <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">Platform & Legal, Documents</LiveLink>
                                  . It is the same document her order page and Reports issue, not an email copy of one.
                                </div>
                              </>
                            )}
                            {doc.fileState === 'missing' && (
                              <>
                                <div className="msg-doc-file-pill-row">
                                  <Pill status="terracotta" className="msg-doc-file-pill">No file yet</Pill>
                                  <span className="msg-doc-file-pill-grey">The same for everyone</span>
                                </div>
                                <span className="msg-doc-file-detail msg-doc-file-detail--warning">
                                  Nothing is held, so this would arrive empty.
                                </span>
                                <Button variant="secondary" size="small">Upload it in Platform & Legal</Button>
                              </>
                            )}
                            {doc.fileState === 'record' && (
                              <>
                                <Pill status="green" className="msg-doc-file-pill">On the record</Pill>
                                <span className="msg-doc-file-detail">Supplied per order on the record itself</span>
                                <span className="msg-doc-file-sub">There is no single copy of it.</span>
                              </>
                            )}
                          </div>

                          <div className="msg-doc-row-actions">
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => setViewerDocId(doc.id)}
                            >
                              See the document
                            </Button>
                            <Button variant="secondary" size="small">Change the document</Button>
                          </div>
                        </div>

                        <div className="msg-doc-row-right">
                          <div className="msg-doc-label">Which messages carry it</div>

                          {docMessages.length === 0 ? (
                            <>
                              <div className="msg-doc-message-list-scroll msg-doc-message-list-scroll--empty">
                                <span className="msg-doc-empty-messages">Travels with nothing yet.</span>
                              </div>
                              <div className="msg-doc-message-toolbar">
                                <Button variant="primary" size="small">Choose messages</Button>
                                <span className="msg-doc-message-toolbar-hint">
                                  Showing only what it travels with. Choose messages to change that.
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="msg-doc-message-list-scroll">
                                {groups.map(groupLabel => (
                                  <div key={groupLabel}>
                                    <div className="msg-doc-message-group-heading">{groupLabel}</div>
                                    {byGroup[groupLabel].map((m) => {
                                      const on = isMessageOn(doc.id, m.id);
                                      const tickState = ticks[doc.id]?.[m.id];
                                      const everyWording = tickState === 'all';
                                      return (
                                        <div key={m.id} className={`msg-doc-message-row ${on ? 'msg-doc-message-row--on' : ''}`}>
                                          <div className="msg-doc-message-main" onClick={() => toggleMessage(doc.id, m)}>
                                            <span className="msg-doc-message-checkbox">{on && '✓'}</span>
                                            <span className="msg-doc-message-name">{m.name}</span>
                                            <span className="msg-doc-message-audience">{m.audience}</span>
                                          </div>
                                          {on && m.wordings.length > 1 && (
                                            <div className="msg-doc-wording-row">
                                              <button
                                                type="button"
                                                className={`msg-doc-wording-tick ${everyWording ? 'msg-doc-wording-tick--on' : ''}`}
                                                onClick={() => toggleEveryWording(doc.id, m)}
                                              >
                                                <span className="msg-doc-wording-checkbox">{everyWording && '✓'}</span>
                                                Every wording
                                              </button>
                                              {m.wordings.map(w => {
                                                const wOn = everyWording || (Array.isArray(tickState) && tickState.includes(w.id));
                                                return (
                                                  <button
                                                    type="button"
                                                    key={w.id}
                                                    className={`msg-doc-wording-tick ${wOn ? 'msg-doc-wording-tick--on' : ''}`}
                                                    onClick={() => toggleWording(doc.id, m, w.id)}
                                                  >
                                                    <span className="msg-doc-wording-checkbox">{wOn && '✓'}</span>
                                                    {w.name}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>

                              <div className="msg-doc-message-toolbar">
                                <Button
                                  variant={showAll ? 'secondary' : 'primary'}
                                  size="small"
                                  onClick={() => setShowAllByDoc(prev => ({ ...prev, [doc.id]: !showAll }))}
                                >
                                  {showAll ? `Show only the ${carriedCount} it travels with` : 'Choose messages'}
                                </Button>
                                <span className="msg-doc-message-toolbar-hint">
                                  {showAll
                                    ? 'Tick every message this document travels with.'
                                    : 'Showing only what it travels with. Choose messages to change that.'}
                                </span>
                              </div>
                            </>
                          )}
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

      <div className="msg-doc-drawer-footer">
        <Button variant="secondary" size="small">Export the whole picture</Button>
        <span className="msg-doc-export-hint">
          One line per document and message, for the build team. What is on screen is the same information, arranged for reading.
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
          It joins the master in{' '}
          <LiveLink to="Platform & Legal → Documents" section="Platform & Legal">Platform & Legal, Documents</LiveLink>
          , where it is uploaded and versioned. Come back here to choose which messages carry it.
          Tax documents cannot be added: their rate and code come from Platform & Legal and are decided by law.
        </div>
      </div>

      {/* Rendered via portal to document.body so a transformed/positioned ancestor (e.g. the drawer's slide-in) can't hijack this "fixed" overlay's centering */}
      {previewDoc && createPortal(
        <div className="msg-tpl-overlay-backdrop" onClick={() => setPreviewDocId(null)}>
          <div className="msg-tpl-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="msg-tpl-overlay-brand">HOUSE OF KAIRA</div>
            <div className="msg-tpl-overlay-title">{previewDoc.name}</div>
            <div className="msg-tpl-overlay-subtitle">
              {previewDoc.isTemplate
                ? 'Filled in for each recipient'
                : previewDoc.fileState === 'record'
                ? 'Supplied per order, not a single file'
                : previewDoc.fileState === 'missing'
                ? 'No file held yet'
                : 'The same document every recipient gets'}
            </div>
            <div className="msg-tpl-overlay-rule" />

            {previewDoc.isTemplate ? (
              <>
                <p className="msg-tpl-overlay-text">
                  The uploaded template is not a finished document. It holds these words, and
                  every send replaces them with what is on the record before it goes out, so
                  one template serves every customer.
                </p>
                <div className="msg-tpl-overlay-rule" />
                <div className="msg-tpl-overlay-words">
                  {(previewDoc.templateWords || []).map(tw => (
                    <div key={tw.word} className="msg-tpl-overlay-word-row">
                      <span className="msg-tpl-overlay-word">{'{{' + tw.word + '}}'}</span>
                      <span className="msg-tpl-overlay-word-desc">{tw.description}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : previewDoc.fileState === 'missing' ? (
              <p className="msg-tpl-overlay-text">
                Nothing has been uploaded for this document yet, so there is nothing to preview.
                Upload it in Platform &amp; Legal, Documents to make it available here.
              </p>
            ) : previewDoc.fileState === 'record' ? (
              <p className="msg-tpl-overlay-text">
                {previewDoc.description || 'This document is supplied per order, on the record itself.'}
                {' '}There is no single file to preview — each order carries its own copy.
              </p>
            ) : (
              <p className="msg-tpl-overlay-text">
                {previewDoc.description || 'No description on file.'}
                {previewDoc.fileState === 'held' && previewDoc.fileName && (
                  <> The current file is <strong>{previewDoc.fileName}</strong>.</>
                )}
                {previewDoc.fileState === 'builtin' && (
                  <> This is built from the record each time it is issued, using the layout on file.</>
                )}
              </p>
            )}

            <div className="msg-tpl-overlay-rule" />
            <div className="msg-tpl-overlay-travels-row">
              <span className="msg-tpl-overlay-travels-label">Travels with</span>
              <span className="msg-tpl-overlay-travels-value">
                {(previewDoc.messages || [])
                  .filter(m => isMessageOn(previewDoc.id, m.id))
                  .map(m => m.name)
                  .join(', ') || 'Nothing yet'}
              </span>
            </div>
            {previewDoc.isTemplate && (
              <p className="msg-tpl-overlay-confirm">
                Every message that carries this can supply every word it needs.
              </p>
            )}
            <div className="msg-tpl-overlay-rule" />
            <div className="msg-tpl-overlay-footer-legal">
              House of Kaira, Indore, Madhya Pradesh, India · GSTIN 23XXXXXXXXXXXZX<br />
              hello@houseofkaira.com · @house_of_kaira
            </div>
            {previewDoc.source && previewDoc.source.length > 0 && (
              <div className="msg-tpl-overlay-filled-from">
                <strong>{previewDoc.isTemplate ? 'Filled in from' : 'Content comes from'}</strong>
                {previewDoc.source.map(src => (
                  <div key={src}><LiveLink to={src} section={src}>{src}</LiveLink></div>
                ))}
              </div>
            )}
            {previewDoc.isTemplate && (
              <div className="msg-tpl-overlay-hint">
                Upload the template with these words in it, exactly as written, double braces included.
              </div>
            )}
            <div className="msg-tpl-overlay-close-row">
              <Button variant="secondary" size="small" onClick={() => setPreviewDocId(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/*
        Document viewer overlay — rebuilt to reuse the exact same "msg-tpl-overlay" shell
        (brand header, title, subtitle, rule, footer legal, close row) as the template
        preview above. That shell is the one that already centers correctly in the
        backdrop; the old bespoke "msg-doc-viewer-overlay" markup/CSS did not, which is
        why it rendered pinned to the top-left instead of centered like the template
        preview. Reusing the same classes fixes the centering and gives it the same
        branded look.
      */}
      {viewerDoc && createPortal(
        <div className="msg-tpl-overlay-backdrop" onClick={() => setViewerDocId(null)}>
          <div className="msg-tpl-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="msg-tpl-overlay-brand">HOUSE OF KAIRA</div>
            <div className="msg-tpl-overlay-title">{viewerDoc.name}</div>
            <div className="msg-tpl-overlay-subtitle">
              {viewerDoc.fileState === 'missing'
                ? 'No file held yet'
                : viewerDoc.fileState === 'record'
                ? 'Supplied per order, not a single file'
                : viewerDoc.fileName || 'The rendered document'}
            </div>
            <div className="msg-tpl-overlay-rule" />

            {viewerDoc.fileState === 'missing' ? (
              <p className="msg-tpl-overlay-text">
                Nothing has been uploaded for this document yet. Upload it in Platform &amp; Legal,
                Documents to see a preview here.
              </p>
            ) : viewerDoc.fileState === 'record' ? (
              <p className="msg-tpl-overlay-text">
                This document is supplied per order, on the record itself. There is no single file —
                open a specific order to see its copy.
              </p>
            ) : (
              <>
                <div className="msg-tpl-overlay-words">
                  <div className="msg-doc-viewer-page-placeholder-lines">
                    <div /><div /><div /><div className="short" />
                  </div>
                </div>
                <div className="msg-tpl-overlay-rule" />
                <p className="msg-tpl-overlay-text">
                  This is a placeholder preview — the real rendered file will appear here once wired
                  to Platform &amp; Legal.
                </p>
              </>
            )}

            <div className="msg-tpl-overlay-rule" />
            <div className="msg-tpl-overlay-footer-legal">
              House of Kaira, Indore, Madhya Pradesh, India · GSTIN 23XXXXXXXXXXXZX<br />
              hello@houseofkaira.com · @house_of_kaira
            </div>

            <div className="msg-tpl-overlay-close-row">
              <Button variant="secondary" size="small" onClick={() => setViewerDocId(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </SetupDrawer>
  );
};