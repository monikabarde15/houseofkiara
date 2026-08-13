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

// Mock data
const MOCK_MESSAGES = [
  { id: '1', name: 'Welcome Email', group: 'Customer - Account', isOptional: false, hasWording: true },
  { id: '2', name: 'Order Confirmation', group: 'Customer - Orders', isOptional: false, hasWording: true },
  { id: '3', name: 'Return Initiated', group: 'Customer - Returns', isOptional: false, hasWording: true },
  { id: '4', name: 'Deposit Reminder', group: 'Customer - Deposits', isOptional: false, hasWording: true },
  { id: '5', name: 'Special Offer', group: 'Customer - Keeping in touch', isOptional: true, hasWording: true },
];

const MOCK_PEOPLE = [
  { id: '1', name: 'Priya Sharma', contact: 'priya@email.com', summary: 'Customer since 2024 · 3 orders', available: true },
  { id: '2', name: 'Amit Patel', contact: '+91 98765 43210', summary: 'Customer since 2025 · 1 order', available: true },
  { id: '3', name: 'Neha Kulkarni', contact: 'neha@email.com', summary: 'Customer since 2023 · 5 orders', available: false, unavailableReason: 'Has not agreed to hear from us' },
  { id: '4', name: 'Rahul Singh', contact: '+91 87654 32109', summary: 'Customer since 2024 · 2 orders', available: true },
  { id: '5', name: 'Sneha Reddy', contact: 'sneha@email.com', summary: 'Customer since 2025 · 0 orders', available: true },
];

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
    // Filter people based on list
    console.log('Quick list selected:', list);
  };

  const handleClear = () => {
    setSelectedPeople([]);
  };

  const selectedPeopleData = MOCK_PEOPLE.filter(p => selectedPeople.includes(p.id));

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
                {selectedPeopleData.map((person) => (
                  <SendCardItem
                    key={person.id}
                    name={person.name}
                    contact={person.contact}
                    status="ready"
                    body={`Dear ${person.name},\n\nThank you for choosing House of Kaira. We are delighted to have you with us.\n\nYour order is being processed and will be with you shortly.\n\nWith love,\nThe House of Kaira Team`}
                    attachments={['Rental Agreement', 'GST Invoice']}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};