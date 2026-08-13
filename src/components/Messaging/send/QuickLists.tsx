// send/QuickLists.tsx
import React from 'react';
import { Button } from '../components/Button';
import './styles/QuickLists.css';

interface QuickListsProps {
  recordKind: 'customer' | 'order' | 'offer' | 'payout' | 'piece' | 'submission' | 'lister' | 'latefee' | 'studioorder';
  onSelect: (list: string) => void;
  onClear: () => void;
}

const QUICK_LISTS: Record<string, string[]> = {
  customer: ['Saved a piece', 'Occasion within 60 days', 'Left something in the bag', 'Everyone who said yes'],
  order: ['Still open', 'Out with the customer', 'Return due soon', 'Overdue'],
  offer: ['Waiting on us', 'Countered', 'Accepted', 'All offers'],
  payout: ['Waiting to be paid', 'Already paid', 'Damage compensation', 'Everything'],
  piece: ['Live on the site', 'Not live yet', 'Paused', 'Everything'],
  submission: ['Still to decide', 'Approved', 'Declined', 'Everything'],
  lister: ['Has a piece live', 'Everyone'],
  latefee: ['Still owed', 'Everything'],
  studioorder: ['Waiting on the studio', 'Past its dispatch date', 'Everything'],
};

export const QuickLists: React.FC<QuickListsProps> = ({
  recordKind,
  onSelect,
  onClear,
}) => {
  const lists = QUICK_LISTS[recordKind] || [];

  return (
    <div className="msg-quicklists">
      {lists.map((list) => (
        <Button
          key={list}
          variant="secondary"
          size="small"
          onClick={() => onSelect(list)}
        >
          {list}
        </Button>
      ))}
      <Button
        variant="secondary"
        size="small"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
};