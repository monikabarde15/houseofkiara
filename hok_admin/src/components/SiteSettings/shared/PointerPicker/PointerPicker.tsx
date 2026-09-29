import React, { useEffect, useRef } from 'react';
import './PointerPicker.css';

export interface PointerItem {
  code: string;
  printsToday: string;
  owner: string;
}

export const POINTERS_INVENTORY: PointerItem[] = [
  { code: '{{site_name}}', printsToday: 'House of Kaira', owner: 'This section' },
  { code: '{{tagline}}', printsToday: 'Circular Luxury Fashion', owner: 'This section' },
  { code: '{{sep}}', printsToday: '—', owner: 'This section' },
  { code: '{{cart_label}}', printsToday: 'Cart', owner: 'This section' },
  { code: '{{year}}', printsToday: '2026', owner: 'This section' },
  { code: '{{support_email}}', printsToday: 'hello@houseofkaira.com', owner: 'This section' },
  { code: '{{support_whatsapp}}', printsToday: '+91 98765 43210', owner: 'This section' },
  { code: '{{support_hours}}', printsToday: '10 AM – 8 PM IST', owner: 'This section' },
  { code: '{{support_days}}', printsToday: '7 days a week', owner: 'This section' },
  { code: '{{support_sla}}', printsToday: '2 hours', owner: 'This section' },
  { code: '{{instagram_handle}}', printsToday: '@house_of_kaira', owner: 'This section' },
  { code: '{{free_delivery_min}}', printsToday: '₹2,999', owner: 'Master Data' },
  { code: '{{free_delivery_min_rental}}', printsToday: '—', owner: 'Master Data' },
  { code: '{{payout_cycle}}', printsToday: 'T+3 working days', owner: 'Master Data' },
  { code: '{{deposit_refund_window}}', printsToday: '3–5 business days', owner: 'Master Data' }
];

export const LIVE_POINTERS = POINTERS_INVENTORY;

interface PointerPickerProps {
  targetElement: HTMLElement | null;
  onSelect: (pointerCode: string) => void;
  onClose: () => void;
}

export const PointerPicker: React.FC<PointerPickerProps> = ({
  targetElement,
  onSelect,
  onClose
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        targetElement &&
        !targetElement.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose, targetElement]);

  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const pickerWidth = 310;
  const pickerHeight = 290;

  // Position: Fixed, 5px below the button, clamped to stay on screen (Spec 11.3)
  let top = rect.bottom + 5;
  let left = rect.left;

  if (left + pickerWidth > window.innerWidth - 10) {
    left = window.innerWidth - pickerWidth - 10;
  }
  if (left < 10) left = 10;

  if (top + pickerHeight > window.innerHeight - 10) {
    top = Math.max(10, rect.top - pickerHeight - 5);
  }

  return (
    <div
      ref={pickerRef}
      className="hok-pointer-picker"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <div className="hok-pointer-picker-heading">Insert a word</div>
      <div className="hok-pointer-picker-list">
        {POINTERS_INVENTORY.map((item) => (
          <div
            key={item.code}
            className="hok-pointer-picker-row"
            onClick={() => {
              onSelect(item.code);
              onClose();
            }}
          >
            <div className="hok-pointer-picker-topline">
              <span className="hok-pointer-picker-name">{item.code}</span>
              <span className="hok-pointer-picker-owner">{item.owner}</span>
            </div>
            <div className="hok-pointer-picker-preview">{item.printsToday}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
