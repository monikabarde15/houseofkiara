// send/SendPeopleCard.tsx
import React from 'react';
import { Card } from '../components/Card';
import { FormField } from '../components/FormField';
import { QuickLists } from './QuickLists';
import { PeopleList } from './PeopleList';
import './styles/SendPeopleCard.css';

interface Person {
  id: string;
  name: string;
  contact: string;
  summary: string;
  available: boolean;
  unavailableReason?: string;
}

interface SendPeopleCardProps {
  recordKind: 'customer' | 'order' | 'offer' | 'payout' | 'piece' | 'submission' | 'lister' | 'latefee' | 'studioorder';
  onRecordKindChange?: (kind: SendPeopleCardProps['recordKind']) => void;
  people: Person[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onQuickList: (list: string) => void;
  onClear: () => void;
  selectedCount: number;
}

const HEADINGS: Record<string, string> = {
  customer: '2 - Which customer',
  order: '2 - Which order',
  offer: '2 - Which offer',
  payout: '2 - Which piece and payout',
  piece: '2 - Which piece',
  submission: '2 - Which submission',
  lister: '2 - Which lister',
  latefee: '2 - Which late fee',
  studioorder: '2 - Which studio order',
};

export const SendPeopleCard: React.FC<SendPeopleCardProps> = ({
  recordKind,
  people,
  selectedIds,
  onToggle,
  onQuickList,
  onClear,
  selectedCount,
}) => {
  return (
    <Card
      header={HEADINGS[recordKind] || '2 - Who to send it to'}
      headerRight={`${selectedCount} chosen`}
    >
      <FormField label="Start from a list">
        <QuickLists
          recordKind={recordKind}
          onSelect={onQuickList}
          onClear={onClear}
        />
      </FormField>

      <PeopleList
        people={people}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    </Card>
  );
};