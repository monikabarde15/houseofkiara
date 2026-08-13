// settings/SettingsTypeCard.tsx
import React from 'react';
import { Card } from '../components/Card';
import { FormField, Input } from '../components/FormField';
import './styles/SettingsTypeCard.css';

export const SettingsTypeCard: React.FC = () => {
  return (
    <Card header="Type & Rendering">
      <div className="msg-settings-grid-3">
        <FormField label="Display Face">
          <Input value="Cormorant Garamond" readOnly />
        </FormField>
        <FormField label="Body Face">
          <Input value="DM Sans" readOnly />
        </FormField>
        <FormField label="Minimum Body Size">
          <Input value="16px" readOnly />
        </FormField>
      </div>
      <div className="msg-settings-type-hint">
        Display face: Cormorant Garamond, then Georgia, then serif. Body face: DM Sans, then Inter, then system UI.
        Minimum body size ensures readability on all devices.
      </div>
    </Card>
  );
};