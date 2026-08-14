// setup/SetupSenderDrawer.tsx
import React, { useState } from 'react';
import { SetupDrawer } from './SetupDrawer';
import { Button } from '../components/Button';
import { FormField, Input } from '../components/FormField';
import { LiveLink } from '../components/LiveLink';
import './styles/SetupSenderDrawer.css';

export const SetupSenderDrawer: React.FC = () => {
  const [fromName, setFromName] = useState('House of Kaira');
  const [fromAddress, setFromAddress] = useState('hello@houseofkaira.com');
  const [replyTo, setReplyTo] = useState('support@houseofkaira.com');
  const [quietCopy, setQuietCopy] = useState('operations@houseofkaira.com');
  const [yourDesk, setYourDesk] = useState('your@houseofkaira.com');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fromAddress.includes('@')) {
      newErrors.fromAddress = 'The from address is not an email address — it would fail at the gateway';
    }
    if (replyTo && !replyTo.includes('@')) {
      newErrors.replyTo = 'The reply-to is given and is not an email address';
    }
    if (quietCopy && !quietCopy.includes('@')) {
      newErrors.quietCopy = 'The quiet copy address is given and is not an email address';
    }
    if (!yourDesk) {
      newErrors.yourDesk = 'Your desk is empty — the messages addressed to the team would go nowhere';
    }
    if (yourDesk && !yourDesk.includes('@') && !yourDesk.includes(',')) {
      newErrors.yourDesk = 'A desk address is not an email address';
    }
    if (!whatsappNumber.replace(/[^0-9]/g, '')) {
      newErrors.whatsappNumber = 'The WhatsApp number contains no digits — it is quoted inside message wording';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      console.log('Saved!');
    }
  };

  return (
    <SetupDrawer
      title="Who messages come from"
      summary={
        <>
          {fromName} · {fromAddress} · WhatsApp {whatsappNumber}
        </>
      }
      defaultOpen={false}
      footer={
        <>
          <span className="msg-drawer-footer-hint">
            Wrong here means wrong on all seventy-three messages, so it is checked before it saves.
          </span>
          <Button variant="primary" size="small" onClick={handleSave} saved>
            Save
          </Button>
        </>
      }
    >
      <div className="msg-sender-grid">
        <FormField label="From Name">
          <Input value={fromName} onChange={(e) => setFromName(e.target.value)} />
        </FormField>
        <FormField label="From Address" error={errors.fromAddress}>
          <Input
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            className={errors.fromAddress ? 'msg-input--error' : ''}
          />
        </FormField>
      </div>

      <FormField
        label="Reply-To"
        hint="That it should be a real inbox rather than no-reply, and that replies will be rare next to WhatsApp but the ones that come will matter"
        error={errors.replyTo}
      >
        <Input
          value={replyTo}
          onChange={(e) => setReplyTo(e.target.value)}
          className={errors.replyTo ? 'msg-input--error' : ''}
        />
      </FormField>

      <FormField label="Quiet Copy To" error={errors.quietCopy}>
        <Input
          value={quietCopy}
          onChange={(e) => setQuietCopy(e.target.value)}
          className={errors.quietCopy ? 'msg-input--error' : ''}
        />
      </FormField>

      <FormField
        label="Your Desk"
        hint="That this is where the messages addressed to the team land, comma separated"
        error={errors.yourDesk}
      >
        <Input
          value={yourDesk}
          onChange={(e) => setYourDesk(e.target.value)}
          className={errors.yourDesk ? 'msg-input--error' : ''}
        />
      </FormField>

      <FormField
        label="WhatsApp Number"
        hint={
          <>
            That it is quoted inside message wording as the support number, and that it is kept in{' '}
            <LiveLink to="Site Settings" section="Site Settings">
              Site Settings
            </LiveLink>
          </>
        }
        error={errors.whatsappNumber}
      >
        <Input
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          className={errors.whatsappNumber ? 'msg-input--error' : ''}
        />
      </FormField>
    </SetupDrawer>
  );
};