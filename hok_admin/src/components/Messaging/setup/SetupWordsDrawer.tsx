// setup/SetupWordsDrawer.tsx
import React, { useState } from 'react';
import { SetupDrawer } from './SetupDrawer';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { LiveLink } from '../components/LiveLink';
import './styles/SetupWordsDrawer.css';

interface Word {
  id: string;
  group: string;
  word: string;
  description: string;
  standIn: string;
  needed: boolean;
  recordsShort?: number;
  usedBy: number;
}

const MOCK_WORDS: Word[] = [
  { id: '1', group: 'customer', word: 'customer_name', description: 'Full name of the customer', standIn: 'Customer', needed: true, usedBy: 8, recordsShort: 0 },
  { id: '2', group: 'customer', word: 'customer_email', description: 'Email address of the customer', standIn: 'customer@email.com', needed: false, usedBy: 5 },
  { id: '3', group: 'order', word: 'order_id', description: 'Unique order identifier', standIn: 'ORD-1234', needed: true, usedBy: 6, recordsShort: 0 },
  { id: '4', group: 'item', word: 'item_name', description: 'Name of the piece', standIn: 'Rose Georgette Anarkali', needed: true, usedBy: 4, recordsShort: 2 },
  { id: '5', group: 'rental', word: 'rental_start', description: 'Start date of rental', standIn: '22 Mar 2026', needed: false, usedBy: 3 },
  { id: '6', group: 'rental', word: 'rental_end', description: 'End date of rental', standIn: '29 Mar 2026', needed: false, usedBy: 3 },
  { id: '7', group: 'shipping', word: 'tracking_number', description: 'Tracking number for shipment', standIn: 'nothing at all', needed: true, usedBy: 2, recordsShort: 5 },
];

const GROUP_SECTIONS: Record<string, { section: string; label: string }> = {
  customer: { section: 'Customer', label: 'Customer' },
  order: { section: 'Orders', label: 'Orders' },
  item: { section: 'Products', label: 'Products' },
  rental: { section: 'Rentals', label: 'Rentals' },
  shipping: { section: 'Shipping', label: 'Shipping' },
  deposit: { section: 'Deposits', label: 'Deposits' },
  payout: { section: 'Payouts', label: 'Payouts' },
  lister: { section: 'Listers', label: 'Listers' },
  designer: { section: 'Designers', label: 'Designers' },
};

export const SetupWordsDrawer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [words] = useState(MOCK_WORDS);

  const groups = [...new Set(words.map(w => w.group))];
  const filtered = words.filter(w =>
    w.word.includes(search.toLowerCase()) ||
    (w.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAskForWord = () => {
    console.log('Request word');
  };

  return (
    <SetupDrawer
      title="The words a message can use"
      summary={
        <>
          {words.length} words in {groups.length} groups
        </>
      }
      defaultOpen={false}
    >
      <div className="msg-words-hint">
        A word is a pointer to a field on a record, which is why it can fill itself in. The editor offers a message
        only the words it can supply. A word coming up empty holds the message back rather than sending it half-written.
        The last column counts the records short of each needed word and opens the list.
      </div>

      <div className="msg-words-caution">
        a needed word is often empty because the stage has not happened yet, and a tracking number empty on a piece
        that has not shipped is correct
      </div>

      <div className="msg-words-toolbar">
        <div className="msg-words-search">
          <input
            type="text"
            className="msg-words-search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="msg-words-count">{filtered.length} of {words.length}</span>
      </div>

      <div className="msg-words-table-wrapper">
        <table className="msg-words-table">
          <thead>
            <tr>
              <th style={{ width: '88px' }}>GROUP</th>
              <th style={{ width: '168px' }}>WORD</th>
              <th>FILLS IN WITH</th>
              <th style={{ width: '120px' }}>IF IT IS MISSING</th>
              <th style={{ width: '78px' }}>NEEDED?</th>
              <th style={{ width: '132px' }}>ANYTHING TO FIX</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => {
              const groupWords = words.filter(w => w.group === group);
              const section = GROUP_SECTIONS[group];

              return (
                <React.Fragment key={group}>
                  {groupIndex > 0 && <tr className="msg-words-group-spacer" />}
                  <tr className="msg-words-group-row">
                    <td colSpan={6}>
                      <span className="msg-words-group-label">{group}</span>
                      {section ? (
                        <>
                         {' '}kept in{' '}
                          <LiveLink to={section.section} section={section.section}>
                            {section.label}
                          </LiveLink>
                          {' · '}
                          <span className="msg-words-group-sub">
                            {section.section} holds the fields that fill these words
                          </span>
                        </>
                      ) : (
                        <>
                          {' '}kept in <span className="msg-words-group-sub">Built by the platform</span>
                        </>
                      )}
                    </td>
                  </tr>
                  {groupWords.map((word) => {
                    const isNeeded = word.needed;
                    const recordsShort = word.recordsShort || 0;

                    let fixState: React.ReactNode;
                    if (!isNeeded) {
                      fixState = <span className="msg-words-fix-empty">—</span>;
                    } else if (word.usedBy === 0) {
                      fixState = <span className="msg-words-fix-not-used">not used yet</span>;
                    } else if (recordsShort === 0) {
                      fixState = (
                        <Pill status="green" className="msg-words-fix-all">
                          All records have it
                        </Pill>
                      );
                    } else {
  fixState = (
    <span
      className="msg-words-fix-short-wrap"
      onClick={() => console.log('Open records short modal')}
    >
      <Pill status="amber" className="msg-words-fix-short">
        {recordsShort} record{recordsShort > 1 ? 's' : ''} short
      </Pill>
    </span>
  );
}

                    return (
                      <tr key={word.id} className="msg-words-row">
                        <td className="msg-words-group-name">{word.group}</td>
                        <td>
                          <span className="msg-words-variable">{'{{' + word.word + '}}'}</span>
                        </td>
                        <td>{word.description}</td>
                        <td>{word.standIn || 'nothing at all'}</td>
                        <td>
                          <Pill status={word.needed ? 'terracotta' : 'grey'}>
                            {word.needed ? 'Needed' : 'Optional'}
                          </Pill>
                        </td>
                        <td>{fixState}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="msg-words-request">
        <div className="msg-words-request-label">
          A word is a pointer to a field on a record
        </div>
        <div className="msg-words-request-reason">
          Typing a new word would not create the field it points at, so it would create a word that fills in as nothing on every send, for ever. What this block captures instead is enough for the build team to work from.
        </div>

        <div className="msg-words-request-grid">
          <div className="msg-words-request-field">
            <label className="msg-words-request-label-small">Word asked for</label>
            <input
              className="msg-words-request-input"
              placeholder="Plain words, no braces"
            />
            <div className="msg-words-request-hint">
              Plain words, no braces. Lowercased on submission, runs of non-alphanumeric characters become single underscores.
            </div>
          </div>
          <div className="msg-words-request-field">
            <label className="msg-words-request-label-small">Would be kept in</label>
            <select className="msg-words-request-select">
              <option>Customer</option>
              <option>Orders</option>
              <option>Products</option>
              <option>Rentals</option>
              <option>Shipping</option>
              <option>Deposits</option>
              <option>Payouts</option>
            </select>
          </div>
          <div className="msg-words-request-field">
            <label className="msg-words-request-label-small">What it should fill in with</label>
            <input className="msg-words-request-input" placeholder="Description" />
          </div>
          <div className="msg-words-request-field msg-words-request-field--full">
            <label className="msg-words-request-label-small">Why a message needs it</label>
            <input className="msg-words-request-input" placeholder="Explain why..." />
          </div>
        </div>

        <div className="msg-words-request-actions">
          <Button variant="secondary" size="small" onClick={handleAskForWord}>
            Ask for this word
          </Button>
          <div className="msg-words-request-hint-final">
            It cannot be used in a message until it exists on the record, because a word that points at nothing fills in as nothing on every send.
          </div>
        </div>
      </div>
    </SetupDrawer>
  );
};