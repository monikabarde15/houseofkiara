import React, { useState } from 'react';
import './FooterRegion.css';
import { FooterSettings, FooterLinkColumn, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { QuietField } from '../../shared/QuietField/QuietField';
import { DeleteCross } from '../../shared/DeleteCross/DeleteCross';
import { AddControl } from '../../shared/AddControl/AddControl';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';
import { PointerPicker, POINTERS_INVENTORY } from '../../shared/PointerPicker/PointerPicker';
import { FooterColumnCard } from './FooterColumnCard';
import { PaymentMethodChips } from './PaymentMethodChips';

interface FooterRegionProps {
  settings: FooterSettings;
  onChange: (updated: FooterSettings) => void;
  issues: HealthIssue[];
  onNavigateModule?: (moduleName: string) => void;
}

export const FooterRegion: React.FC<FooterRegionProps> = ({
  settings,
  onChange,
  issues,
  onNavigateModule
}) => {
  const [pointerTarget, setPointerTarget] = useState<{ element: HTMLElement; fieldKey: 'blurb' | 'copyright' } | null>(null);

  // Helper to evaluate pointers in text
  const evaluatePointers = (text: string) => {
    if (!text) return '';
    let result = text;
    POINTERS_INVENTORY.forEach((p) => {
      result = result.split(p.code).join(p.printsToday);
    });
    return result;
  };

  const handlePointerSelect = (code: string) => {
    if (!pointerTarget) return;
    if (pointerTarget.fieldKey === 'blurb') {
      const newText = settings.blurbUnderWordmark ? `${settings.blurbUnderWordmark} ${code}` : code;
      onChange({ ...settings, blurbUnderWordmark: newText });
    } else if (pointerTarget.fieldKey === 'copyright') {
      const newText = settings.copyrightLine ? `${settings.copyrightLine} ${code}` : code;
      onChange({ ...settings, copyrightLine: newText });
    }
  };

  const handleUpdateColumn = (index: number, updatedCol: FooterLinkColumn) => {
    const updated = [...settings.linkColumns];
    updated[index] = updatedCol;
    onChange({ ...settings, linkColumns: updated });
  };

  const handleUpdateLegalLink = (
    index: number,
    field: 'label' | 'path',
    val: string
  ) => {
    const updated = [...settings.legalRow];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...settings, legalRow: updated });
  };

  const handleDeleteLegalLink = (index: number) => {
    const updated = settings.legalRow.filter((_, i) => i !== index);
    onChange({ ...settings, legalRow: updated });
  };

  const handleAddLegalLink = () => {
    const newLink = {
      id: `leg-${Date.now()}`,
      label: 'New Policy',
      path: '/policy'
    };
    onChange({ ...settings, legalRow: [...settings.legalRow, newLink] });
  };

  const blurbPrints = evaluatePointers(settings.blurbUnderWordmark);
  const copyrightPrints = evaluatePointers(settings.copyrightLine);

  return (
    <div className="hok-footer-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Footer</h2>
        <span className="hok-editor-attribution">Priya (Ops) · 2 days ago</span>
      </div>
      <p className="hok-editor-description">
        Link columns, the legal row, payment methods and the copyright line.
      </p>

      {/* 8.2 Issues for Footer */}
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

      {/* Card 1 — Link Columns (2x2 Grid) */}
      <Card
        isFirst
        title="Link columns"
        subtitle="Four columns in a two-by-two grid. Each is a bordered card with a heading quiet field and a list of label-and-path rows, each with a delete cross on hover, plus an add control."
        id="footer-link-columns"
      >
        <div className="hok-footer-columns-grid">
          {settings.linkColumns.map((col, idx) => (
            <FooterColumnCard
              key={col.id}
              column={col}
              onChange={(updatedCol) => handleUpdateColumn(idx, updatedCol)}
            />
          ))}
        </div>
      </Card>

      {/* Card 2 — Legal Row */}
      <Card
        title="Legal row"
        subtitle={
          <span>
            Each needs a published document.{' '}
            <button
              type="button"
              className="hok-btn-text-action"
              onClick={() => onNavigateModule && onNavigateModule('platform-legal')}
            >
              Platform & Legal
            </button>
          </span>
        }
        id="footer-legal-row"
      >
        <div className="hok-footer-legal-list">
          {settings.legalRow.map((link, idx) => (
            <div key={link.id} className="hok-footer-legal-row hok-interactive-row">
              <div style={{ flex: 1.5, minWidth: 0 }}>
                <QuietField
                  value={link.label}
                  placeholder="Policy name"
                  onChange={(e) => handleUpdateLegalLink(idx, 'label', e.target.value)}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <QuietField
                  variant="secondary"
                  value={link.path}
                  placeholder="/terms"
                  onChange={(e) => handleUpdateLegalLink(idx, 'path', e.target.value)}
                />
              </div>
              <DeleteCross
                onDelete={() => handleDeleteLegalLink(idx)}
                hint="Remove this policy link from the legal row"
              />
            </div>
          ))}
        </div>

        <AddControl label="+ Legal link" onClick={handleAddLegalLink} />
      </Card>

      {/* Card 3 — Copy & Badges */}
      <Card title="Copy & badges" id="footer-copy-badges-card">
        {/* Blurb under the wordmark */}
        <div id="footer-blurb">
          <Field
            label="Blurb under the wordmark"
            hints={`Prints: ${blurbPrints} { }`}
            onPointerClick={(elem) => setPointerTarget({ element: elem, fieldKey: 'blurb' })}
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.blurbUnderWordmark}
              onChange={(e) =>
                onChange({ ...settings, blurbUnderWordmark: e.target.value })
              }
            />
          </Field>
        </div>

        {/* Copyright line */}
        <div id="footer-copyright">
          <Field
            label="Copyright line"
            hints={[
              `Prints: ${copyrightPrints} { }`,
              'The prototype screens carry 2024, 2025 and 2026. A pointer never needs an annual edit.'
            ]}
            onPointerClick={(elem) => setPointerTarget({ element: elem, fieldKey: 'copyright' })}
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.copyrightLine}
              onChange={(e) =>
                onChange({ ...settings, copyrightLine: e.target.value })
              }
            />
          </Field>
        </div>

        {/* Trust badges */}
        <div id="footer-trust-badges">
          <Field label="Trust badges" hints="Comma separated.">
            <input
              type="text"
              className="hok-field-input"
              value={settings.trustBadges}
              onChange={(e) =>
                onChange({ ...settings, trustBadges: e.target.value })
              }
            />
          </Field>
        </div>

        {/* Payment Methods */}
        <PaymentMethodChips
          paymentMethods={settings.paymentMethods}
          onChange={(updatedMethods) =>
            onChange({ ...settings, paymentMethods: updatedMethods })
          }
        />
        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '-6px', marginBottom: '11px' }}>
          Switched on uses the panel's live pill; off is the muted pill. Only advertise what checkout accepts.
        </div>
      </Card>

      {/* Card 4 — Newsletter */}
      <Card title="Newsletter" id="footer-newsletter">
        <PillToggle
          checked={settings.newsletter.show}
          onChange={(checked) =>
            onChange({
              ...settings,
              newsletter: { ...settings.newsletter, show: checked }
            })
          }
          label="Show the newsletter block"
          hint={!settings.newsletter.show ? 'Only the checkout page offers signup today.' : undefined}
        />

        {settings.newsletter.show && (
          <div className="hok-newsletter-expanded-fields" style={{ marginTop: '11px' }}>
            <div className="hok-two-column-group">
              <Field label="Heading">
                <input
                  type="text"
                  className="hok-field-input"
                  value={settings.newsletter.heading || ''}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      newsletter: { ...settings.newsletter, heading: e.target.value }
                    })
                  }
                />
              </Field>

              <Field label="Button label">
                <input
                  type="text"
                  className="hok-field-input"
                  value={settings.newsletter.buttonLabel || ''}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      newsletter: { ...settings.newsletter, buttonLabel: e.target.value }
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Body">
              <textarea
                className="hok-field-textarea"
                value={settings.newsletter.body || ''}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    newsletter: { ...settings.newsletter, body: e.target.value }
                  })
                }
              />
            </Field>

            <Field label="Consent line">
              <input
                type="text"
                className="hok-field-input"
                value={settings.newsletter.consentLine || ''}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    newsletter: { ...settings.newsletter, consentLine: e.target.value }
                  })
                }
              />
            </Field>
          </div>
        )}
      </Card>

      {/* Pointer Picker Popover */}
      {pointerTarget && (
        <PointerPicker
          targetElement={pointerTarget.element}
          onSelect={handlePointerSelect}
          onClose={() => setPointerTarget(null)}
        />
      )}
    </div>
  );
};
