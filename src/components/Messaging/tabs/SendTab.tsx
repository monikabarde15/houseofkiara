// tabs/SendTab.tsx (UPDATED)
import React, { useState } from 'react';
import { NoteBar } from '../components/NoteBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { MessageSelect } from '../send/MessageSelect';
import { QuickLists } from '../send/QuickLists';
import { PeopleList } from '../send/PeopleList';
import { SendCardItem } from '../send/SendCardItem';
import './styles/SendTab.css';

// Mock data - UPDATED with Dispatched message and 3 wordings
const MOCK_MESSAGES = [
  { id: '1', name: 'Welcome Email', group: 'Customer - Account', isOptional: false, hasWording: true },
  { id: '2', name: 'Order Confirmation', group: 'Customer - Orders', isOptional: false, hasWording: true },
  { id: '3', name: 'Return Initiated', group: 'Customer - Returns', isOptional: false, hasWording: true },
  { id: '4', name: 'Deposit Reminder', group: 'Customer - Deposits', isOptional: false, hasWording: true },
  { id: '5', name: 'Special Offer', group: 'Customer - Keeping in touch', isOptional: true, hasWording: true },
  // NEW: Dispatched message with 3 wordings
  { id: '6', name: 'Dispatched', group: 'Customer - Orders', isOptional: false, hasWording: true, wordings: ['Rental', 'Preloved', 'Buy New'] },
];

const MOCK_PEOPLE = [
  { id: '1', name: 'Priya Sharma', contact: 'priya@email.com', summary: 'Customer since 2024 · 3 orders', available: true, orderMode: 'rental' },
  { id: '2', name: 'Amit Patel', contact: '+91 98765 43210', summary: 'Customer since 2025 · 1 order', available: true, orderMode: 'preloved' },
  { id: '3', name: 'Neha Kulkarni', contact: 'neha@email.com', summary: 'Customer since 2023 · 5 orders', available: false, unavailableReason: 'Has not agreed to hear from us', orderMode: 'rental' },
  { id: '4', name: 'Rahul Singh', contact: '+91 87654 32109', summary: 'Customer since 2024 · 2 orders', available: true, orderMode: 'buynew' },
  { id: '5', name: 'Sneha Reddy', contact: 'sneha@email.com', summary: 'Customer since 2025 · 0 orders', available: true, orderMode: 'rental' },
];

// NEW: Wording mapping based on order mode
// Per addendum: Rental and Multi-item → Rental wording, Preloved → Preloved wording, Buy New → Buy New wording
const getWordingForMode = (mode: string): string => {
  switch (mode) {
    case 'rental':
    case 'multi-item':
      return 'Rental';
    case 'preloved':
      return 'Preloved';
    case 'buynew':
      return 'Buy New';
    default:
      return 'Rental';
  }
};

// NEW: Attachment rules based on order mode
// Buy New dispatch carries no document of ours
const getAttachmentsForMode = (mode: string): string[] => {
  switch (mode) {
    case 'buynew':
      return []; // Buy New carries no document
    case 'rental':
    case 'multi-item':
      return ['Rental Agreement', 'Care Card'];
    case 'preloved':
      return ['Care Card'];
    default:
      return ['Rental Agreement'];
  }
};

// NEW: Body text based on order mode
const getBodyForMode = (name: string, mode: string): string => {
  switch (mode) {
    case 'rental':
    case 'multi-item':
      return `Dear ${name},\n\nYour rental order is confirmed! Your item will be with you shortly.\n\nRental Period: 22 Mar 2026 - 29 Mar 2026\nDeposit: ₹15,000\n\nWith love,\nThe House of Kaira Team`;
    case 'preloved':
      return `Dear ${name},\n\nYour preloved item has been confirmed! It will be shipped to you shortly.\n\nItem: Rose Georgette Anarkali\nPrice: ₹2,500\n\nWith love,\nThe House of Kaira Team`;
    case 'buynew':
      return `Dear ${name},\n\nYour order has been confirmed! Your item will ship from the studio directly.\n\nItem: Rose Georgette Anarkali\nOrder: ORD-1234\n\nWith love,\nThe House of Kaira Team`;
    default:
      return `Dear ${name},\n\nThank you for choosing House of Kaira. We are delighted to have you with us.\n\nWith love,\nThe House of Kaira Team`;
  }
};

export const SendTab: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState('1');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [recordKind, setRecordKind] = useState<'customer' | 'order' | 'offer' | 'payout' | 'piece' | 'submission' | 'lister' | 'latefee' | 'studioorder'>('customer');

  const handleTogglePerson = (id: string) => {
    setSelectedPeople(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleQuickList = (list: string) => {
    console.log('Quick list selected:', list);
  };

  const handleClear = () => {
    setSelectedPeople([]);
  };

  const selectedPeopleData = MOCK_PEOPLE.filter(p => selectedPeople.includes(p.id));

  // Check if Dispatched message is selected
  const isDispatched = selectedMessage === '6';

  return (
    <div className="msg-send-tab">
      <NoteBar heading="Choose the message, choose the people, read it back, send">
        Each person gets their own version. Her name, her saved pieces, her occasion, the code you picked. 
        You see the real thing for every single person before anything goes out, and anyone who has not agreed 
        to hear from us is set aside rather than quietly dropped.
      </NoteBar>

      <div className="msg-send-grid">
        <div className="msg-send-left">
          <Card header="1 - What to send">
            <FormField label="Message">
              <MessageSelect
                value={selectedMessage}
                onChange={setSelectedMessage}
                options={MOCK_MESSAGES}
                hint="Carried over from Welcome Email, the message you were on. Change it above if you meant something else."
              />
            </FormField>

            <FormField label="Attach a promotion">
              <select className="msg-select">
                <option>No promotion</option>
                <option>WELCOME10 - 10% off first order - until 31 Dec 2026</option>
                <option>FREESHIP - Free shipping - until 15 Jan 2027</option>
              </select>
            </FormField>

            <FormField label="Send on">
              <div className="msg-send-chips">
                <span className="msg-chip msg-chip--wordgroup msg-chip--selected">WhatsApp</span>
                <span className="msg-chip msg-chip--wordgroup">Email</span>
              </div>
            </FormField>
          </Card>

          <Card 
            header="2 - Who to send it to" 
            headerRight={`${selectedPeople.length} chosen`}
          >
            <FormField label="Start from a list">
              <QuickLists
                recordKind={recordKind}
                onSelect={handleQuickList}
                onClear={handleClear}
              />
            </FormField>

            <PeopleList
              people={MOCK_PEOPLE}
              selectedIds={selectedPeople}
              onToggle={handleTogglePerson}
            />
          </Card>
        </div>

        <div className="msg-send-right">
          <Card 
            header="3 - Read it back" 
            headerSubtitle="One per person, exactly as it will arrive"
          >
            {selectedPeopleData.length === 0 ? (
              <div className="msg-send-readback-empty">
                Choose the people on the left and their messages will appear here, 
                each one filled in with their own details.
              </div>
            ) : (
              <div className="msg-send-readback-list">
                {selectedPeopleData.map((person) => {
                  // NEW: Determine wording based on order mode
                  const mode = (person as any).orderMode || 'rental';
                  const wordingName = isDispatched ? getWordingForMode(mode) : undefined;
                  const attachments = isDispatched ? getAttachmentsForMode(mode) : ['Rental Agreement', 'GST Invoice'];
                  const body = isDispatched ? getBodyForMode(person.name, mode) : 
                    `Dear ${person.name},\n\nThank you for choosing House of Kaira. We are delighted to have you with us.\n\nYour order is being processed and will be with you shortly.\n\nWith love,\nThe House of Kaira Team`;

                  return (
                    <SendCardItem
                      key={person.id}
                      name={person.name}
                      contact={person.contact}
                      status="ready"
                      wordingName={wordingName}
                      body={body}
                      attachments={attachments}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};