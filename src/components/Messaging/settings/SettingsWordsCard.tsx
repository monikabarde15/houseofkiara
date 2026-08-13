// settings/SettingsWordsCard.tsx
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Pill } from '../components/Pill';
import './styles/SettingsWordsCard.css';

interface Word {
  id: string;
  group: string;
  word: string;
  description: string;
  standIn: string;
  needed: boolean;
}

export const SettingsWordsCard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [words] = useState<Word[]>([
    { id: '1', group: 'customer', word: 'customer_name', description: 'Full name of the customer', standIn: 'Customer', needed: true },
    { id: '2', group: 'customer', word: 'customer_email', description: 'Email address of the customer', standIn: 'customer@email.com', needed: false },
    { id: '3', group: 'order', word: 'order_id', description: 'Unique order identifier', standIn: 'ORD-1234', needed: true },
    { id: '4', group: 'item', word: 'item_name', description: 'Name of the piece', standIn: 'Rose Georgette Anarkali', needed: true },
    { id: '5', group: 'rental', word: 'rental_start', description: 'Start date of rental', standIn: '22 Mar 2026', needed: false },
    { id: '6', group: 'rental', word: 'rental_end', description: 'End date of rental', standIn: '29 Mar 2026', needed: false },
  ]);

  const groups = [...new Set(words.map(w => w.group))];
  const filtered = words.filter(w =>
    w.word.includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card
      header="Words you can drop into a message"
      headerSubtitle="Read-only, like Master Data. One vocabulary everywhere."
    >
      <div className="msg-settings-words-toolbar">
        <div className="msg-settings-words-search">
          <input
            type="text"
            className="msg-settings-words-search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="msg-settings-words-count">{filtered.length} of {words.length}</span>
      </div>

      <div className="msg-settings-table-wrapper">
        <table className="msg-table">
          <thead>
            <tr>
              <th>GROUP</th>
              <th>WORD</th>
              <th>FILLS IN WITH</th>
              <th>IF IT IS MISSING</th>
              <th>NEEDED?</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => (
              <React.Fragment key={group}>
                {groupIndex > 0 && <tr className="msg-settings-word-group-spacer" />}
                <tr className="msg-settings-word-group">
                  <td colSpan={5} className="msg-settings-word-group-label">{group}</td>
                </tr>
                {words.filter(w => w.group === group && filtered.includes(w)).map((word) => (
                  <tr key={word.id} className="msg-settings-word-row">
                    <td className="msg-settings-word-group-name">{word.group}</td>
                    <td>
                      <span className="msg-settings-word-variable">{'{{' + word.word + '}}'}</span>
                    </td>
                    <td>{word.description}</td>
                    <td>{word.standIn || 'nothing at all'}</td>
                    <td>
                      <Pill status={word.needed ? 'terracotta' : 'grey'}>
                        {word.needed ? 'Needed' : 'Optional'}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="msg-settings-words-footer">
        <span className="msg-settings-words-footer-hint">
          If something marked Needed comes up empty, the message is held back and lands on your desk rather than going out half-written.
        </span>
      </div>
    </Card>
  );
};