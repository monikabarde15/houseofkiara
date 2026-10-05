/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · TOKENS (Spec 11)
========================================================= */

import React, { useRef, useEffect } from 'react';
import './TokenPicker.css';

export interface TokenDefinition {
  code: string;
  printsToday: string;
  owner: string;
}

export const LIVE_HOMEPAGE_TOKENS: TokenDefinition[] = [
  { code: '{{site_name}}', printsToday: 'House of Kaira', owner: 'Site Settings' },
  { code: '{{tagline}}', printsToday: 'Circular Luxury Fashion', owner: 'Site Settings' },
  { code: '{{sep}}', printsToday: '—', owner: 'Site Settings' },
  { code: '{{cart_label}}', printsToday: 'Cart', owner: 'Site Settings' },
  { code: '{{year}}', printsToday: '2026', owner: 'Site Settings' },
  { code: '{{support_email}}', printsToday: 'hello@houseofkaira.com', owner: 'Site Settings' },
  { code: '{{support_whatsapp}}', printsToday: '+91 98765 43210', owner: 'Site Settings' },
  { code: '{{support_hours}}', printsToday: '10 AM – 8 PM IST', owner: 'Site Settings' },
  { code: '{{support_days}}', printsToday: '7 days a week', owner: 'Site Settings' },
  { code: '{{support_sla}}', printsToday: '2 hours', owner: 'Site Settings' },
  { code: '{{instagram_handle}}', printsToday: '@house_of_kaira', owner: 'Site Settings' },
  { code: '{{free_delivery_min}}', printsToday: '₹2,999', owner: 'Master Data' },
  { code: '{{free_delivery_min_rental}}', printsToday: '—', owner: 'Master Data' },
  { code: '{{payout_cycle}}', printsToday: 'T+3 working days', owner: 'Master Data' },
  { code: '{{deposit_refund_window}}', printsToday: '3–5 business days', owner: 'Master Data' }
];

export const resolveHomepageTokens = (text?: string): string => {
  if (!text) return '';
  let result = text;
  LIVE_HOMEPAGE_TOKENS.forEach((token) => {
    if (result.includes(token.code)) {
      result = result.split(token.code).join(token.printsToday);
    }
  });
  return result;
};

interface TokenPickerProps {
  onSelectToken: (tokenCode: string) => void;
  onClose: () => void;
  targetRef: React.RefObject<HTMLElement>;
}

export const TokenPicker: React.FC<TokenPickerProps> = ({
  onSelectToken,
  onClose,
  targetRef
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        targetRef.current &&
        !targetRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose, targetRef]);

  return (
    <div className="hok-token-popover" ref={popoverRef}>
      <div className="hok-token-popover-header">Insert Live Token (15 available)</div>
      {LIVE_HOMEPAGE_TOKENS.map((token) => (
        <div
          key={token.code}
          className="hok-token-item"
          onClick={() => {
            onSelectToken(token.code);
            onClose();
          }}
        >
          <span className="hok-token-code">{token.code}</span>
          <div className="hok-token-meta">
            <span className="hok-token-prints">{token.printsToday}</span>
            <span className="hok-token-owner">{token.owner}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
