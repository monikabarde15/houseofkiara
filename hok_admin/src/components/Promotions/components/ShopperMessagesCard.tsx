/* ========================================
   Promotions Module - Shopper Messages Card
   All 15 refusal messages with editing
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.4
   ======================================== */

import React, { useState } from 'react';
import './styles/ShopperMessagesCard.css';
import { Card, StatusBadge, Button, Link, FormField } from './UI';
import { ShopperMessages } from '../types/promotions.types';
import { DEFAULT_SHOPPER_MESSAGES } from '../utils/constants';

interface ShopperMessagesCardProps {
  messages: ShopperMessages;
  onSave: (messages: Partial<ShopperMessages>) => void;
  onReset: (key: keyof ShopperMessages) => void;
  getCustomizedCount: () => number;
  loading: boolean;
}

const messageLabels: { key: keyof ShopperMessages; label: string }[] = [
  { key: 'exists', label: 'Step 1 — Code doesn\'t exist' },
  { key: 'notlive', label: 'Step 2 — Not yet live' },
  { key: 'expired', label: 'Step 3 — Expired' },
  { key: 'paused', label: 'Step 4 — Paused' },
  { key: 'capitol', label: 'Step 5 — Fully redeemed' },
  { key: 'privatemis', label: 'Step 6 — Private code, different account' },
  { key: 'firstorder', label: 'Step 7 — First-order-only, returning customer' },
  { key: 'mode', label: 'Step 8 — Mode not covered' },
  { key: 'scope', label: 'Step 9 — Nothing in the bag qualifies' },
  { key: 'offerline', label: 'Step 10 — Line came from an accepted offer' },
  { key: 'minimum', label: 'Step 11 — Under the minimum' },
  { key: 'percust', label: 'Step 12 — Per-customer cap reached' },
  { key: 'apolicyone', label: 'Step 13a — Policy is one code per order' },
  { key: 'nolinks', label: 'Step 13b — Code has no links' },
  { key: 'cpartial', label: 'Step 13c — Linked with some, not all' },
];

const placeholders = ['{date}', '{modes}', '{scope}', '{piece}', '{code}', '{x}', '{other}', '{unlinked code}'];

export const ShopperMessagesCard: React.FC<ShopperMessagesCardProps> = ({
  messages,
  onSave,
  onReset,
  getCustomizedCount,
  loading,
}) => {
  const [editing, setEditing] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);

  const customizedCount = getCustomizedCount();

  const handleSave = () => {
    onSave(localMessages);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalMessages(messages);
    setEditing(false);
  };

  const handleReset = (key: keyof ShopperMessages) => {
    onReset(key);
    setLocalMessages(prev => ({ ...prev, [key]: DEFAULT_SHOPPER_MESSAGES[key] }));
  };

  const getPlaceholderStatus = (text: string) => {
    const missing = placeholders.filter(p => text.includes(p) && !text.includes(p));
    if (missing.length === 0) {
      return { type: 'satisfied', message: 'No live values in this one.' };
    }
    const list = missing.map(p => p.replace(/[{}]/g, ''));
    return {
      type: 'warning',
      message: `Missing ${list.join(' and ')} — the shopper won't see that live value.`
    };
  };

  return (
    <Card
      header={
        <>
          <span className="card__title">Shopper Messages</span>
          <div className="card__header-actions">
            <StatusBadge status={customizedCount === 0 ? 'All default' : `${customizedCount} customised`} />
            {!editing && (
              <Link onClick={() => setEditing(true)}>Edit</Link>
            )}
          </div>
        </>
      }
      footer={
        editing ? (
          <>
            <Button variant="secondary" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Messages'}
            </Button>
          </>
        ) : null
      }
    >
      {editing ? (
        <>
          <div className="shopper-messages__intro">
            The italic line under each field is that message with sample values filled in — what a shopper actually reads. These are the exact sentences a shopper sees when a code is refused at checkout — the same ones printed on every code's validation card. Curly placeholders like {"{date}"} are filled in live at checkout; a message still works without its placeholder, the shopper just loses that detail. An emptied message quietly returns to its default on Save.
          </div>

          {messageLabels.map(({ key, label }) => {
            const text = localMessages[key];
            const placeholderStatus = getPlaceholderStatus(text);
            const defaultText = DEFAULT_SHOPPER_MESSAGES[key];
            
            // Fill in sample values for preview
            let preview = text
              .replace(/{date}/g, '23 Mar 2026')
              .replace(/{modes}/g, 'Rental')
              .replace(/{scope}/g, 'Sabyasachi bridal lehengas')
              .replace(/{piece}/g, 'Champagne Tissue Sharara')
              .replace(/{code}/g, 'KAIRA10')
              .replace(/{x}/g, '₹500')
              .replace(/{other}/g, 'FIRST25')
              .replace(/{unlinked code}/g, 'BRIDAL500');

            return (
              <div key={key} className="shopper-messages__field">
                <div className="shopper-messages__field-header">
                  <span className="shopper-messages__field-label">{label}</span>
                  <Link onClick={() => handleReset(key)}>Reset to default</Link>
                </div>

                <textarea
                  className="shopper-messages__field-input"
                  value={text}
                  onChange={(e) => setLocalMessages({ ...localMessages, [key]: e.target.value })}
                  rows={2}
                />

                <div className={`shopper-messages__field-placeholder ${placeholderStatus.type === 'warning' ? 'warning' : ''}`}>
                  {placeholderStatus.message}
                </div>

                <div className="shopper-messages__field-preview">
                  “{preview}”
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </Card>
  );
};