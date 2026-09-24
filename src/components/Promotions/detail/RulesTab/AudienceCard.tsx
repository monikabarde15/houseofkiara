/* ========================================
   Promotions Module - Audience Card
   Public/Private with customer assignments
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.9
   ======================================== */

import React, { useState } from 'react';
import './styles/AudienceCard.css';
import { Card, Button, Link } from '../../components/UI';
import { CustomerPicker } from '../../shared/CustomerPicker';
import { PromoCode } from '../../types/promotions.types';
import { AUDIENCE_OPTIONS } from '../../utils/constants';

interface AudienceCardProps {
  code: PromoCode;
  onSave: (data: Partial<PromoCode>) => void;
}

const mockCustomerNames: Record<string, string> = {
  cust_001: 'Priya Sharma',
  cust_002: 'Amit Patel',
  cust_003: 'Neha Singh',
  cust_004: 'Rahul Verma',
};

export const AudienceCard: React.FC<AudienceCardProps> = ({ code, onSave }) => {
  const [audience, setAudience] = useState<'public' | 'private'>(code.audience);
  const [customerIds, setCustomerIds] = useState<string[]>(code.customerIds);

  const handleAudienceChange = (newAudience: 'public' | 'private') => {
    if (newAudience === 'public') {
      if (audience === 'private') {
        if (window.confirm(`Make ${code.code} public?\n\nThe assigned-customer list will be cleared — anyone will be able to use the code.`)) {
          setAudience('public');
          setCustomerIds([]);
          onSave({ audience: 'public', customerIds: [] });
        }
      }
    } else {
      setAudience('private');
      onSave({ audience: 'private', customerIds });
    }
  };

  const handleCustomersChange = (newCustomerIds: string[]) => {
    if (newCustomerIds.length < customerIds.length) {
      // Customer was removed
      const removedId = customerIds.find(id => !newCustomerIds.includes(id));
      const name = removedId ? (mockCustomerNames[removedId] || removedId) : 'customer';
      if (!window.confirm(`Remove ${name} from ${code.code}?\n\nAny redemption already on an order stays on that order — only future eligibility changes.`)) {
        return; // Declined, restore original state
      }
    }
    setCustomerIds(newCustomerIds);
    onSave({ audience, customerIds: newCustomerIds });
  };

  const isPrivate = audience === 'private';

  return (
    <Card header={<span className="card__title">Audience</span>}>
      <div className="audience-card__radios">
        {AUDIENCE_OPTIONS.map(opt => (
          <label key={opt.value} className="audience-card__radio">
            <input
              type="radio"
              name="audience"
              value={opt.value}
              checked={audience === opt.value}
              onChange={() => handleAudienceChange(opt.value as any)}
            />
            {opt.value === 'public' ? 'Public — anyone' : 'Private — specific customers'}
          </label>
        ))}
      </div>

      {isPrivate && (
        <div className="audience-card__customers">
          <CustomerPicker
            customers={customerIds}
            onCustomersChange={handleCustomersChange}
          />
        </div>
      )}

      <div className="audience-card__hint">
        Private codes are validated against the signed-in account at checkout — anyone else entering the code sees "This code is linked to a different account." Assignments save immediately.
      </div>
    </Card>
  );
};