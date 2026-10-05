import React, { useState } from 'react';
import './AnnouncementRegion.css';
import { AnnouncementMessageItem, ScopeOption, MessageState } from '../../types/siteSettings.types';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { ReorderArrows } from '../../shared/ReorderArrows/ReorderArrows';
import { PointerPicker, POINTERS_INVENTORY } from '../../shared/PointerPicker/PointerPicker';

interface MessageBlockProps {
  index: number;
  message: AnnouncementMessageItem;
  onChange: (updated: AnnouncementMessageItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const MessageBlock: React.FC<MessageBlockProps> = ({
  index,
  message,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const [pointerTarget, setPointerTarget] = useState<HTMLElement | null>(null);

  // Compute live message state (Spec 10.1 & 16.1)
  const computeState = (): { state: MessageState; countdown?: string } => {
    if (!message.enabled) return { state: 'Off' };

    const today = new Date('2026-03-23T00:00:00'); // Spec reference date
    if (message.goLiveDate) {
      const goLive = new Date(message.goLiveDate);
      if (goLive > today) return { state: 'Scheduled' };
    }

    if (message.expiresDate) {
      const expires = new Date(message.expiresDate);
      if (expires < today) return { state: 'Expired' };

      const diffDays = Math.ceil((expires.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 14) {
        return { state: 'Live', countdown: `ends in ${diffDays}d` };
      }
    }

    return { state: 'Live' };
  };

  const { state: messageState, countdown } = computeState();

  // Evaluate pointers for live print line
  const evaluatePointers = (text: string) => {
    if (!text) return '';
    let result = text;
    POINTERS_INVENTORY.forEach((p) => {
      result = result.split(p.code).join(p.printsToday);
    });
    return result;
  };

  const printsLiveText = evaluatePointers(message.text);

  const handlePointerSelect = (code: string) => {
    const newText = message.text ? `${message.text} ${code}` : code;
    onChange({ ...message, text: newText });
  };

  const isSiteWide = message.showsOn === 'All pages';

  return (
    <div className="hok-msg-block" id={`ann-msg-block-${index + 1}`}>
      {/* Header Strip (Spec 10.1) */}
      <div className="hok-msg-header-strip">
        <span className="hok-msg-index">Message {index + 1}</span>

        {/* State Pill */}
        <span className={`hok-msg-state-pill state-${messageState.toLowerCase()}`}>
          {messageState}
        </span>

        {/* Expiry Countdown */}
        {countdown && <span className="hok-msg-countdown">{countdown}</span>}

        {/* Scope Badge */}
        <span className={`hok-msg-scope-badge ${isSiteWide ? 'scope-all' : 'scope-specific'}`}>
          {message.showsOn.toUpperCase()}
        </span>

        {/* Controls */}
        <div className="hok-msg-header-controls">
          <ReorderArrows
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            upHint="Show this message earlier in the run"
            downHint="Show this message later in the run"
          />

          <PillToggle
            checked={message.enabled}
            onChange={(checked) => onChange({ ...message, enabled: checked })}
            label=""
            hint=""
          />

          <button
            type="button"
            className="hok-btn-text-action is-destructive"
            onClick={onRemove}
            data-hint="Delete this message for good"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="hok-msg-body">
        {/* Text Input with Pointer Insertion */}
        <Field
          label="Text"
          hints={`Prints: ${printsLiveText} { }`}
          onPointerClick={(elem) => setPointerTarget(elem)}
          pointerHint="Insert a live value — it prints the current figure wherever this appears"
        >
          <input
            type="text"
            className="hok-field-input"
            value={message.text}
            onChange={(e) => onChange({ ...message, text: e.target.value })}
            placeholder="Type announcement message..."
          />
        </Field>

        {/* Italic Serif Toggle */}
        <PillToggle
          checked={message.italicSerif}
          onChange={(checked) => onChange({ ...message, italicSerif: checked })}
          label="Set in the italic serif, like the opening line"
          hint=""
        />

        {/* Two-Column: Shows on & Link */}
        <div className="hok-two-column-group">
          <Field
            label="Shows on"
            hints={
              message.showsOn === 'All pages'
                ? 'Every page carries it.'
                : `Only the ${message.showsOn} pages.`
            }
          >
            <select
              className="hok-field-select"
              value={message.showsOn}
              onChange={(e) => onChange({ ...message, showsOn: e.target.value as ScopeOption })}
            >
              <option value="All pages">All pages</option>
              <option value="Rent">Rent</option>
              <option value="Preloved">Preloved</option>
              <option value="Buy New">Buy New</option>
              <option value="List Your Piece">List Your Piece</option>
              <option value="Account">Account</option>
            </select>
          </Field>

          <Field label="Link" hints="Placeholder: /rent">
            <input
              type="text"
              className="hok-field-input"
              value={message.link}
              onChange={(e) => onChange({ ...message, link: e.target.value })}
              placeholder="/rent"
            />
          </Field>
        </div>

        {/* Two-Column: Go-live & Expires */}
        <div className="hok-two-column-group">
          <Field label="Go-live" hints="Blank means live now.">
            <input
              type="date"
              className="hok-field-input"
              value={message.goLiveDate}
              onChange={(e) => onChange({ ...message, goLiveDate: e.target.value })}
            />
          </Field>

          <Field label="Expires" hints="Blank means until switched off.">
            <input
              type="date"
              className="hok-field-input"
              value={message.expiresDate}
              onChange={(e) => onChange({ ...message, expiresDate: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {/* Pointer Picker Popover */}
      {pointerTarget && (
        <PointerPicker
          targetElement={pointerTarget}
          onSelect={handlePointerSelect}
          onClose={() => setPointerTarget(null)}
        />
      )}
    </div>
  );
};
