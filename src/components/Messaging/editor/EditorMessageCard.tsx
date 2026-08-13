// editor/EditorMessageCard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { FormField, Input } from '../components/FormField';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { Message } from '../types/messaging.types';
import './styles/EditorMessageCard.css';

interface EditorMessageCardProps {
  message: Message;
}

export const EditorMessageCard: React.FC<EditorMessageCardProps> = ({ message }) => {
  const [name, setName] = useState(message.name);
  const [trigger, setTrigger] = useState(message.trigger);
  const [audience, setAudience] = useState(message.audience);
  const [msgClass, setMsgClass] = useState(message.class);
  const [notSendNote, setNotSendNote] = useState('');
  const [wordGroups, setWordGroups] = useState<string[]>(['GLOBAL', 'CUSTOMER', 'AUTH']);

  // Sync state with selected message prop updates
  useEffect(() => {
    setName(message.name);
    setTrigger(message.trigger);
    setAudience(message.audience);
    setMsgClass(message.class);
    
    // Set appropriate note based on message
    if (message.class === 'Required' && (message.name === 'Verify Email' || message.name === 'Mobile OTP')) {
      setNotSendNote('Always sends. The account cannot be used until this is acted on.');
    } else if (message.class === 'Required') {
      setNotSendNote('Always sends.');
    } else {
      setNotSendNote('Sent by hand, so nothing fires on its own.');
    }

    // Set appropriate word groups based on message types
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

  return (
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
        <FormField label="Name" className="msg-editor-message-field">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="When it goes out" className="msg-editor-message-field">
          <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} />
        </FormField>
      </div>

      <div className="msg-editor-message-grid">
        <FormField label="Goes to" className="msg-editor-message-field">
          <select className="msg-select" value={audience} onChange={(e) => setAudience(e.target.value as any)}>
            <option value="Customer">Customer</option>
            <option value="Lister">Lister</option>
            <option value="Designer">Designer</option>
            <option value="You">You</option>
          </select>
        </FormField>
        <FormField label="Required or optional" className="msg-editor-message-field">
          <select className="msg-select" value={msgClass} onChange={(e) => setMsgClass(e.target.value as any)}>
            <option value="Required">Required, always sends</option>
            <option value="Optional">Optional, needs her consent</option>
            <option value="Marketing">Marketing, promotional</option>
          </select>
        </FormField>
      </div>

      <FormField label="Note on when it does not send">
        <Input value={notSendNote} onChange={(e) => setNotSendNote(e.target.value)} />
      </FormField>

      {/* Dashed attachment block */}
      <div className="msg-travels-section">
        <label className="msg-field-label">TRAVELS WITH THIS MESSAGE</label>
        <div className="msg-travels-dashed-box">
          Nothing. This message goes out on its own.
        </div>
        <div className="msg-field-help">
          Worked out from the rules in <span className="msg-help-link">Settings → What travels with what</span>, read against this record and this wording. Cross one off to stop it going with this message. Tax documents cannot be crossed off.
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
          Chosen from the master, never typed, so the system knows what to attach. A document that does not exist yet is created in <span className="msg-help-link">Settings → Documents we issue first</span>.
        </div>
      </div>

      {/* Styled tag-checkbox wordgroups block */}
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
  );
};