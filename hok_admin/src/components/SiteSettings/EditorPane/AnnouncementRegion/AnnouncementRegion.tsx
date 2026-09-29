import React from 'react';
import './AnnouncementRegion.css';
import { AnnouncementSettings, AnnouncementMessageItem, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { AddControl } from '../../shared/AddControl/AddControl';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { MessageBlock } from './MessageBlock';

interface AnnouncementRegionProps {
  settings: AnnouncementSettings;
  onChange: (updated: AnnouncementSettings) => void;
  issues: HealthIssue[];
  onNavigateModule?: (moduleName: string) => void;
}

export const AnnouncementRegion: React.FC<AnnouncementRegionProps> = ({
  settings,
  onChange,
  issues,
  onNavigateModule
}) => {
  const handleUpdateMessage = (index: number, updated: AnnouncementMessageItem) => {
    const newMessages = [...settings.messages];
    newMessages[index] = updated;
    onChange({ ...settings, messages: newMessages });
  };

  const handleRemoveMessage = (index: number) => {
    const newMessages = settings.messages.filter((_, i) => i !== index);
    onChange({ ...settings, messages: newMessages });
  };

  const handleMoveMessage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= settings.messages.length) return;
    const newMessages = [...settings.messages];
    const [moved] = newMessages.splice(fromIndex, 1);
    newMessages.splice(toIndex, 0, moved);
    onChange({ ...settings, messages: newMessages });
  };

  const handleAddMessage = () => {
    const newMsg: AnnouncementMessageItem = {
      id: `msg-${Date.now()}`,
      text: 'New announcement phrase',
      italicSerif: false,
      showsOn: 'All pages',
      link: '',
      goLiveDate: '',
      expiresDate: '',
      enabled: true
    };
    onChange({ ...settings, messages: [...settings.messages, newMsg] });
  };

  const liveAllPagesCount = settings.messages.filter(
    (m) => m.enabled && m.showsOn === 'All pages'
  ).length;

  return (
    <div className="hok-announcement-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Announcement bar</h2>
        <span className="hok-editor-attribution">Priya (Ops) · 2 days ago</span>
      </div>
      <p className="hok-editor-description">
        The strip above the header. Each message carries its own schedule, so a sale ends without anyone remembering to switch it off.
      </p>

      {/* 8.2 Issues belonging to Announcement */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
          onAction={
            issue.actionModule && onNavigateModule
              ? () => onNavigateModule(issue.actionModule!)
              : undefined
          }
        />
      ))}

      {/* Card 1 — The bar itself (Spec 10.1 & 16.1) */}
      <Card isFirst id="ann-card-bar">
        {/* Show across site master toggle */}
        <div id="ann-show-across-site">
          <PillToggle
            checked={settings.showAcrossSite}
            onChange={(checked) => onChange({ ...settings, showAcrossSite: checked })}
            label="Show the bar across the site"
          />
        </div>

        {/* Movement and loop time */}
        <div className="hok-two-column-group">
          <div id="ann-how-it-moves">
            <Field
              label="How it moves"
              hints="The storefront carries both today: the app screens scroll continuously, the page files show one static row."
            >
              <select
                className="hok-field-select"
                value={settings.howItMoves}
                onChange={(e) =>
                  onChange({ ...settings, howItMoves: e.target.value as 'Scrolling loop' | 'Static row' })
                }
              >
                <option value="Scrolling loop">Scrolling loop</option>
                <option value="Static row">Static row</option>
              </select>
            </Field>
          </div>

          <div id="ann-loop-time">
            <Field label="Loop time (seconds)" hints="One full pass. 28 on the current build.">
              <input
                type="number"
                className="hok-field-input"
                value={settings.loopTimeSeconds}
                onChange={(e) =>
                  onChange({ ...settings, loopTimeSeconds: Number(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
        </div>

        {/* Pause on hover */}
        <div id="ann-pause-on-hover">
          <PillToggle
            checked={settings.pauseOnHover}
            onChange={(checked) => onChange({ ...settings, pauseOnHover: checked })}
            label="Pause when the cursor is over it"
          />
        </div>

        {/* Reference line */}
        <div className="hok-ann-ref-line">
          Reference date Mon Mar 23 2026. {liveAllPagesCount} of {settings.messages.length} messages show on All pages.
        </div>
      </Card>

      {/* Card 2 — Messages (Spec 10.1 & 16.1) */}
      <Card
        title="Messages"
        subtitle="Point at {{free_delivery_min}} rather than typing the figure."
        id="ann-messages-card"
      >
        {settings.messages.map((msg, index) => (
          <MessageBlock
            key={msg.id}
            index={index}
            message={msg}
            onChange={(updated) => handleUpdateMessage(index, updated)}
            onRemove={() => handleRemoveMessage(index)}
            onMoveUp={() => handleMoveMessage(index, index - 1)}
            onMoveDown={() => handleMoveMessage(index, index + 1)}
            canMoveUp={index > 0}
            canMoveDown={index < settings.messages.length - 1}
          />
        ))}

        <AddControl
          label="+ Add message"
          onClick={handleAddMessage}
        />
      </Card>

      {/* Card 3 — Appearance (Spec 10.1 & 16.1) */}
      <Card
        title="Appearance"
        subtitle="The opening line is set in a different colour and face from the rest."
        id="ann-appearance-card"
      >
        <div className="hok-three-column-group">
          {/* Background */}
          <div id="ann-bg-color">
            <Field label="Background">
              <div className="hok-color-picker-cell">
                <input
                  type="color"
                  className="hok-color-swatch-input"
                  value={settings.backgroundColor}
                  onChange={(e) => onChange({ ...settings, backgroundColor: e.target.value })}
                />
                <input
                  type="text"
                  className="hok-color-text-input"
                  value={settings.backgroundColor}
                  onChange={(e) => onChange({ ...settings, backgroundColor: e.target.value })}
                />
              </div>
            </Field>
          </div>

          {/* Text colour */}
          <div id="ann-text-color">
            <Field label="Text colour">
              <div className="hok-color-picker-cell">
                <input
                  type="color"
                  className="hok-color-swatch-input"
                  value={settings.textColor}
                  onChange={(e) => onChange({ ...settings, textColor: e.target.value })}
                />
                <input
                  type="text"
                  className="hok-color-text-input"
                  value={settings.textColor}
                  onChange={(e) => onChange({ ...settings, textColor: e.target.value })}
                />
              </div>
            </Field>
          </div>

          {/* Italic line colour */}
          <div id="ann-italic-color">
            <Field label="Italic line colour">
              <div className="hok-color-picker-cell">
                <input
                  type="color"
                  className="hok-color-swatch-input"
                  value={settings.italicLineColor}
                  onChange={(e) => onChange({ ...settings, italicLineColor: e.target.value })}
                />
                <input
                  type="text"
                  className="hok-color-text-input"
                  value={settings.italicLineColor}
                  onChange={(e) => onChange({ ...settings, italicLineColor: e.target.value })}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Separator */}
        <div id="ann-separator">
          <Field label="Separator">
            <select
              className="hok-field-select"
              value={settings.separator}
              onChange={(e) =>
                onChange({
                  ...settings,
                  separator: e.target.value as 'Dot' | 'Middle dot' | 'Slash' | 'None'
                })
              }
            >
              <option value="Dot">Dot</option>
              <option value="Middle dot">Middle dot</option>
              <option value="Slash">Slash</option>
              <option value="None">None</option>
            </select>
          </Field>
        </div>
      </Card>
    </div>
  );
};
