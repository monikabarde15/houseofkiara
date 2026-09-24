// editor/EditorMessageCard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { FormField, Input } from '../components/FormField';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { LiveLink } from '../components/LiveLink';
import { Message } from '../types/messaging.types';
import './styles/EditorMessageCard.css';

interface EditorMessageCardProps {
  message: Message;
  onBack: () => void;
}

export const EditorMessageCard: React.FC<EditorMessageCardProps> = ({ message, onBack }) => {
  const [name, setName] = useState(message.name);
  const [trigger, setTrigger] = useState(message.trigger);
  const [audience, setAudience] = useState(message.audience);
  const [msgClass, setMsgClass] = useState(message.class);
  const [notSendNote, setNotSendNote] = useState('');
  const [wordGroups, setWordGroups] = useState<string[]>(['GLOBAL', 'CUSTOMER', 'AUTH']);

  useEffect(() => {
    setName(message.name);
    setTrigger(message.trigger);
    setAudience(message.audience);
    setMsgClass(message.class);

    if (message.class === 'Required' && (message.name === 'Verify Email' || message.name === 'Mobile OTP')) {
      setNotSendNote('Always sends. The account cannot be used until this is acted on.');
    } else if (message.class === 'Required') {
      setNotSendNote('Always sends.');
    } else {
      setNotSendNote('Sent by hand, so nothing fires on its own.');
    }

    if (
      message.name === 'Verify Email' ||
      message.name === 'Mobile OTP' ||
      message.name === 'Password Reset' ||
      message.name === 'Password Changed' ||
      message.name === 'Welcome' ||
      message.name === 'Deletion Requested' ||
      message.name === 'Deletion Completed' ||
      message.name === 'Consent Receipt'
    ) {
      setWordGroups(['GLOBAL', 'CUSTOMER', 'AUTH']);
    } else if (
      message.name.includes('Order') ||
      message.name.includes('Dispatched') ||
      message.name.includes('Delivered')
    ) {
      setWordGroups(['GLOBAL', 'CUSTOMER', 'ORDER', 'ITEM']);
    } else if (message.name.includes('Deposit')) {
      setWordGroups(['GLOBAL', 'CUSTOMER', 'DEPOSIT']);
    } else if (message.name.includes('Return') || message.name.includes('Overdue')) {
      setWordGroups(['GLOBAL', 'CUSTOMER', 'RENTAL']);
    } else {
      setWordGroups(['GLOBAL', 'CUSTOMER']);
    }
  }, [message]);

  const groupOptions = [
    'GLOBAL', 'CUSTOMER', 'ORDER', 'ITEM', 'RENTAL', 'DEPOSIT',
    'SHIPPING', 'CUSTOMFIT', 'LISTER', 'PAYOUT', 'OFFER', 'AUTH',
    'RECEIVABLE', 'INTERNAL'
  ];

  const handleToggleGroup = (group: string) => {
    setWordGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  // NEW — drives the read-only "Attachment" summary field
  const attachmentSummary = 'Nothing travels with this message.';

  return (
    <>
      <div className="msg-editor-topbar">
        <Button variant="secondary" size="small" onClick={onBack}>
          ← Back to Messages
        </Button>
      </div>

      <Card
        header="What this message is"
        headerRight={
          <>
            <Pill status={message.status === 'Live' ? 'green' : message.status === 'Paused' ? 'amber' : 'grey'}>
              {message.status}
            </Pill>
            <Button variant="secondary" size="small">Remove</Button>
            <Button variant="secondary" size="small">Make a copy</Button>
          </>
        }
      >
        <div className="msg-editor-message-grid">
          <FormField
            label="Name"
            hint="What the team calls it. Change it freely."
            className="msg-editor-message-field"
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField
            label="When it goes out"
            hint="Sent by hand. Someone picks it from a customer or lister record."
            className="msg-editor-message-field"
          >
            <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} />
          </FormField>
        </div>

        <div className="msg-editor-message-grid msg-editor-message-grid--3">
          <FormField label="Goes to" className="msg-editor-message-field">
            <select className="msg-select" value={audience} onChange={(e) => setAudience(e.target.value as any)}>
              <option value="Customer">Customer</option>
              <option value="Lister">Lister</option>
              <option value="Designer">Designer</option>
              <option value="You">You</option>
            </select>
          </FormField>

          <FormField
            label="Required or optional"
            hint="Required covers money, deposits, security and anything the law asks for. Those cannot be switched off."
            className="msg-editor-message-field"
          >
            <select className="msg-select" value={msgClass} onChange={(e) => setMsgClass(e.target.value as any)}>
              <option value="Required">Required, always sends</option>
              <option value="Optional">Optional, needs her consent</option>
              <option value="Marketing">Marketing, promotional</option>
            </select>
          </FormField>

          <FormField
            label="Attachment"
            hint="Set below, from the rules. Nothing is typed here."
            className="msg-editor-message-field"
          >
            <div className="msg-editor-attachment-preview">
              {attachmentSummary}
            </div>
          </FormField>
        </div>

        <FormField label="Note on when it does not send">
          <Input value={notSendNote} onChange={(e) => setNotSendNote(e.target.value)} />
        </FormField>

        <div className="msg-travels-section">
          <label className="msg-field-label">TRAVELS WITH THIS MESSAGE</label>
          <div className="msg-travels-dashed-box">
            Nothing. This message goes out on its own.
          </div>
          <div className="msg-field-help">
            Worked out from the rules in{' '}
            <LiveLink to="Setup → Documents" section="Setup">Setup → Documents</LiveLink>
            , read against this record and this wording. Cross one off to stop it going with this message. Tax documents cannot be crossed off.
          </div>
          <div className="msg-travels-add-row">
            <select className="msg-select msg-travels-select" defaultValue="">
              <option value="" disabled>Also attach...</option>
              <option value="agreement">Rental Agreement</option>
              <option value="invoice">GST Invoice</option>
              <option value="cancellation">Cancellation Policy</option>
            </select>
            <Button variant="secondary" size="small">Add</Button>
          </div>
          <div className="msg-field-help">
            Chosen from the master, never typed, so the system knows what to attach. A document that does not exist yet is created in{' '}
            <LiveLink to="Setup → Documents" section="Setup">Setup → Documents</LiveLink> first.
          </div>
        </div>

        <div className="msg-word-groups-section">
          <label className="msg-field-label">WORD-GROUPS THIS MESSAGE MAY USE</label>
          <div className="msg-word-groups-grid">
            {groupOptions.map(group => {
              const isChecked = wordGroups.includes(group);
              return (
                <label key={group} className={`msg-word-group-checkbox ${isChecked ? 'is-checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleGroup(group)}
                    style={{ display: 'none' }}
                  />
                  <span className="msg-checkbox-box">{isChecked ? '✓' : ''}</span>
                  <span className="msg-checkbox-label">{group}</span>
                </label>
              );
            })}
          </div>
          <div className="msg-field-help">
            Tick a group and its words become available below. Untick one and any word from it has to come out of the wording first.
          </div>
        </div>
      </Card>
    </>
  );
};