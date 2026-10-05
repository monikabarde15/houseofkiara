import React from 'react';
import './ContactRegion.css';
import { ContactSettings, ReturnsAddress, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { ReturnsAddressCard } from './ReturnsAddressCard';

interface ContactRegionProps {
  settings: ContactSettings;
  onChange: (updated: ContactSettings) => void;
  issues: HealthIssue[];
}

export const ContactRegion: React.FC<ContactRegionProps> = ({ settings, onChange, issues }) => {
  const handleUpdateAddress = (updatedAddress: ReturnsAddress) => {
    onChange({ ...settings, returnsAddress: updatedAddress });
  };

  return (
    <div className="hok-contact-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Contact & social</h2>
        <span className="hok-editor-attribution">Soumya · 3 days ago</span>
      </div>
      <p className="hok-editor-description">
        What the site promises about reaching you. These print inside order confirmations, so a change here changes a promise.
      </p>

      {/* 8.2 Issues for Contact */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — Reaching Us (Spec 10.6 & 16.6) */}
      <Card
        isFirst
        title="Reaching us"
        subtitle="These print inside order confirmations through {{support_hours}} and {{support_whatsapp}}."
        id="contact-reaching-card"
      >
        {/* Support Email, Phone, WhatsApp */}
        <div className="hok-three-column-group">
          <div id="contact-support-email">
            <Field label="Support email">
              <input
                type="email"
                className="hok-field-input"
                value={settings.supportEmail}
                onChange={(e) => onChange({ ...settings, supportEmail: e.target.value })}
              />
            </Field>
          </div>

          <div id="contact-support-phone">
            <Field label="Phone">
              <input
                type="text"
                className="hok-field-input"
                value={settings.phone}
                onChange={(e) => onChange({ ...settings, phone: e.target.value })}
              />
            </Field>
          </div>

          <div id="contact-support-whatsapp">
            <Field label="WhatsApp">
              <input
                type="text"
                className="hok-field-input"
                value={settings.whatsApp}
                onChange={(e) => onChange({ ...settings, whatsApp: e.target.value })}
              />
            </Field>
          </div>
        </div>

        {/* Days open, Hours, Reply within (hrs) */}
        <div className="hok-three-column-group">
          <div id="contact-days-open">
            <Field label="Days open">
              <input
                type="text"
                className="hok-field-input"
                value={settings.daysOpen}
                onChange={(e) => onChange({ ...settings, daysOpen: e.target.value })}
              />
            </Field>
          </div>

          <div id="contact-hours">
            <Field label="Hours">
              <input
                type="text"
                className="hok-field-input"
                value={settings.hours}
                onChange={(e) => onChange({ ...settings, hours: e.target.value })}
              />
            </Field>
          </div>

          <div id="contact-reply-within">
            <Field label="Reply within (hrs)">
              <input
                type="number"
                className="hok-field-input"
                value={settings.replyWithinHrs}
                onChange={(e) =>
                  onChange({ ...settings, replyWithinHrs: Number(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Card 2 — Returns Address */}
      <ReturnsAddressCard
        address={settings.returnsAddress}
        onChange={handleUpdateAddress}
      />

      {/* Card 3 — WhatsApp Button */}
      <Card title="WhatsApp button" id="contact-whatsapp-button">
        <PillToggle
          checked={settings.whatsAppButton.show}
          onChange={(checked) =>
            onChange({
              ...settings,
              whatsAppButton: { ...settings.whatsAppButton, show: checked }
            })
          }
          label="Show the floating button"
        />

        <div className="hok-two-column-group" style={{ marginTop: '11px' }}>
          <Field label="Tooltip">
            <input
              type="text"
              className="hok-field-input"
              value={settings.whatsAppButton.tooltip}
              onChange={(e) =>
                onChange({
                  ...settings,
                  whatsAppButton: { ...settings.whatsAppButton, tooltip: e.target.value }
                })
              }
            />
          </Field>

          <Field label="Pre-filled message">
            <input
              type="text"
              className="hok-field-input"
              value={settings.whatsAppButton.preFilledMessage}
              onChange={(e) =>
                onChange({
                  ...settings,
                  whatsAppButton: {
                    ...settings.whatsAppButton,
                    preFilledMessage: e.target.value
                  }
                })
              }
            />
          </Field>
        </div>
      </Card>

      {/* Card 4 — Social */}
      <Card
        title="Social"
        subtitle="Blank channels are hidden rather than linked to an empty profile."
        id="contact-social-card"
      >
        <div className="hok-two-column-group">
          <div id="contact-instagram">
            <Field
              label="Instagram"
              hints="The homepage prototype shows @houseofkaira; the live handle is @house_of_kaira."
            >
              <input
                type="text"
                className="hok-field-input"
                value={settings.social.instagram}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    social: { ...settings.social, instagram: e.target.value }
                  })
                }
              />
            </Field>
          </div>

          <Field label="Follow label">
            <input
              type="text"
              className="hok-field-input"
              value={settings.social.followLabel}
              onChange={(e) =>
                onChange({
                  ...settings,
                  social: { ...settings.social, followLabel: e.target.value }
                })
              }
            />
          </Field>
        </div>

        <div className="hok-two-column-group" id="contact-social-channels">
          <Field label="Facebook">
            <input
              type="text"
              className="hok-field-input"
              value={settings.social.facebook}
              placeholder="—"
              onChange={(e) =>
                onChange({
                  ...settings,
                  social: { ...settings.social, facebook: e.target.value }
                })
              }
            />
          </Field>

          <Field label="Pinterest">
            <input
              type="text"
              className="hok-field-input"
              value={settings.social.pinterest}
              placeholder="—"
              onChange={(e) =>
                onChange({
                  ...settings,
                  social: { ...settings.social, pinterest: e.target.value }
                })
              }
            />
          </Field>
        </div>

        <div className="hok-two-column-group">
          <Field label="YouTube">
            <input
              type="text"
              className="hok-field-input"
              value={settings.social.youTube}
              placeholder="—"
              onChange={(e) =>
                onChange({
                  ...settings,
                  social: { ...settings.social, youTube: e.target.value }
                })
              }
            />
          </Field>

          <Field label="LinkedIn">
            <input
              type="text"
              className="hok-field-input"
              value={settings.social.linkedIn}
              placeholder="—"
              onChange={(e) =>
                onChange({
                  ...settings,
                  social: { ...settings.social, linkedIn: e.target.value }
                })
              }
            />
          </Field>
        </div>
      </Card>
    </div>
  );
};
