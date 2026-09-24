// editor/VariableChips.tsx
import React from 'react';
import { Chip } from '../components/Chip';
import './styles/VariableChips.css';

const VARIABLE_GROUPS = [
  {
    name: 'GLOBAL',
    variables: ['brand_name', 'support_email', 'support_whatsapp', 'instagram_handle', 'site_url', 'today'],
  },
  {
    name: 'CUSTOMER',
    variables: [
      'customer_name', 
      'customer_first_name', 
      'customer_email', 
      'customer_phone', 
      'customer_city', 
      'occasion', 
      'occasion_date', 
      'occasion_in_days', 
      'wishlist_piece', 
      'wishlist_designer', 
      'wishlist_count', 
      'bag_piece'
    ],
  },
  {
    name: 'AUTH',
    variables: ['verify_url', 'otp_code', 'otp_expiry_minutes', 'reset_url', 'reset_expiry_minutes'],
  },
];

interface VariableChipsProps {
  onInsert?: (variable: string) => void;
}

export const VariableChips: React.FC<VariableChipsProps> = ({ onInsert }) => {
  const handleClick = (variable: string) => {
    if (onInsert) {
      onInsert(variable);
    }
  };

  return (
    <div className="msg-variable-chips">
      <div className="msg-variable-chips-label">Drop in a word</div>
      <div className="msg-variable-chips-box">
        {VARIABLE_GROUPS.map((group, index) => (
          <div key={group.name}>
            {index > 0 && <div className="msg-variable-group-spacer" />}
            <div className="msg-variable-group-heading">{group.name}</div>
            <div className="msg-variable-group-chips">
              {group.variables.map((variable) => (
                <Chip
                  key={variable}
                  variant="variable"
                  onClick={() => handleClick(variable)}
                >
                  {`{{${variable}}}`}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="msg-variable-chips-hint">
        Click one to insert it wherever the cursor is.
      </div>
    </div>
  );
};