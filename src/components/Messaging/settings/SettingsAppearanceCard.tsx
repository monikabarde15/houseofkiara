// settings/SettingsAppearanceCard.tsx
import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormField, Input, Textarea } from '../components/FormField';
import './styles/SettingsAppearanceCard.css';

export const SettingsAppearanceCard: React.FC = () => {
  return (
    <Card header="How they look">
      <FormField label="Logo">
        <div className="msg-settings-logo-hint">
          Reads the logo uploaded in <span className="msg-settings-link">Site Settings → Brand & Logo</span>.
          One upload, two places, nothing to keep in sync by hand.
        </div>
      </FormField>

      <div className="msg-settings-grid-2">
        <FormField label="Header Background">
          <div className="msg-settings-color-wrapper">
            <input type="color" className="msg-settings-color-input" value="#1A1612" />
            <span className="msg-settings-color-hex">#1A1612</span>
          </div>
        </FormField>
        <FormField label="Logo Colour">
          <div className="msg-settings-color-wrapper">
            <input type="color" className="msg-settings-color-input" value="#C9A96E" />
            <span className="msg-settings-color-hex">#C9A96E</span>
          </div>
        </FormField>
      </div>

      <FormField
        label="Sign-off"
        hint="Added to the end of every message to a customer or lister. Change it here and all of them change. Do not retype it inside a message."
      >
        <Textarea value="With love,\nThe House of Kaira Team" minHeight={52} />
      </FormField>

      <FormField label="Footer">
        <Textarea
          value="House of Kaira\n123 Luxury Lane, Mumbai\nGSTIN: 27AABCK1234D1Z5\nContact: +91 98765 43210"
          minHeight={62}
        />
      </FormField>

      <FormField
        label="Unsubscribe Line"
        hint="Shown only on the optional messages. Never on a booking or a refund, where an unsubscribe link would be misleading."
      >
        <Input value="You are receiving this because you opted in. Unsubscribe here." />
      </FormField>

      <div className="msg-settings-footer">
        <Button variant="primary" size="small" saved>Save</Button>
      </div>
    </Card>
  );
};