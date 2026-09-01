// setup/SetupAppearanceDrawer.tsx
import React, { useState } from 'react';
import { SetupDrawer } from './SetupDrawer';
import { Button } from '../components/Button';
import { FormField, Input, Textarea } from '../components/FormField';
import { LiveLink } from '../components/LiveLink';
import './styles/SetupAppearanceDrawer.css';

export const SetupAppearanceDrawer: React.FC = () => {
  const [headerBg, setHeaderBg] = useState('#1A1612');
  const [logoColor, setLogoColor] = useState('#C9A96E');
  const [signOff, setSignOff] = useState('With love,\nThe House of Kaira Team');
  const [footer, setFooter] = useState(
    'House of Kaira\n123 Luxury Lane, Mumbai\nGSTIN: 27AABCK1234D1Z5\nContact: +91 98765 43210'
  );
  const [unsubscribe, setUnsubscribe] = useState(
    'You are receiving this because you opted in. Unsubscribe here.'
  );

  // NEW — tracks whether the "Saved ✓" chip should be showing right now
  const [justSaved, setJustSaved] = useState(false);

  // NEW — this drawer had no save handler at all before; it just always showed "Saved ✓"
  const handleSave = () => {
    console.log('Saved!');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <SetupDrawer
      title="How messages look"
      summary={
        <>
          Signed off “{signOff.split('\n')[0]}” · logo from{' '}
          <LiveLink to="Site Settings → Brand & Logo" section="Site Settings">
            Site Settings
          </LiveLink>
        </>
      }
      defaultOpen={false}
      // CHANGED — wired to handleSave, and saved is now driven by state
      footer={
        <Button variant="primary" size="small" onClick={handleSave} saved={justSaved}>
          Save
        </Button>
      }
    >
      <FormField label="Logo">
        <div className="msg-appearance-logo-hint">
          Reads the logo uploaded in{' '}
          <LiveLink to="Site Settings → Brand & Logo" section="Site Settings">
            Site Settings, Brand & Logo
          </LiveLink>
          . One upload, two places, nothing to keep in sync by hand.
        </div>
      </FormField>

      <div className="msg-appearance-grid">
       <FormField label="Header Background">
          <input
            type="color"
            className="msg-appearance-color-input"
            value={headerBg}
            onChange={(e) => setHeaderBg(e.target.value)}
          />
        </FormField>
        <FormField label="Logo Colour">
          <input
            type="color"
            className="msg-appearance-color-input"
            value={logoColor}
            onChange={(e) => setLogoColor(e.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Sign-off"
        hint="That it is added to the end of every message to a customer or lister, that changing it here changes all of them, and that it must not be retyped inside a message."
      >
        <Textarea
          value={signOff}
          onChange={(e) => setSignOff(e.target.value)}
          minHeight={52}
        />
      </FormField>

      <FormField label="Footer">
        <Textarea
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          minHeight={62}
        />
      </FormField>

      <FormField
        label="Unsubscribe Line"
        hint="That it is shown only on the optional messages, and never on a booking or a refund, where an unsubscribe link would be misleading."
      >
        <Input
          value={unsubscribe}
          onChange={(e) => setUnsubscribe(e.target.value)}
        />
      </FormField>

      <div className="msg-appearance-type">
        <div className="msg-appearance-type-label">Type</div>
        <div className="msg-appearance-type-text">
          Display: Cormorant Garamond, then Georgia, then serif. Body: DM Sans, then Inter, then system UI.
          Webfonts are not relied on. Body held at 16px so mobile clients do not shrink it.
        </div>
      </div>
    </SetupDrawer>
  );
};