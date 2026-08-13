// settings/SettingsSenderCard.tsx
import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FormField, Input, Textarea } from '../components/FormField';
import './styles/SettingsSenderCard.css';

export const SettingsSenderCard: React.FC = () => {
  return (
    <Card header="Who messages come from">
      <div className="msg-settings-grid-2">
        <FormField label="From Name">
          <Input value="House of Kaira" />
        </FormField>
        <FormField label="From Address">
          <Input value="hello@houseofkaira.com" />
        </FormField>
      </div>

      <FormField
        label="Reply-To"
        hint="A real inbox, not no-reply. Replies will be rare next to WhatsApp, but the ones that come will matter."
      >
        <Input value="support@houseofkaira.com" />
      </FormField>

      <FormField label="Quiet Copy To">
        <Input value="operations@houseofkaira.com" />
      </FormField>

      <FormField
        label="Your Desk"
        hint="Where the messages addressed to you land. Comma separated."
      >
        <Input value="your@houseofkaira.com" />
      </FormField>

      <FormField
        label="WhatsApp Number"
        hint="Reads from Site Settings. This is the number quoted inside message wording as {{support_whatsapp}}."
      >
        <Input value="+91 98765 43210" />
      </FormField>

      <div className="msg-settings-footer">
        <Button variant="primary" size="small" saved>Save</Button>
      </div>
    </Card>
  );
};