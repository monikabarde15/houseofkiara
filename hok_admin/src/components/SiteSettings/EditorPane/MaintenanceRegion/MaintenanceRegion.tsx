import React from 'react';
import './MaintenanceRegion.css';
import { SiteStatusSettings, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { PillToggle } from '../../shared/PillToggle/PillToggle';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';

interface MaintenanceRegionProps {
  settings: SiteStatusSettings;
  onChange: (updated: SiteStatusSettings) => void;
  issues: HealthIssue[];
}

export const MaintenanceRegion: React.FC<MaintenanceRegionProps> = ({
  settings,
  onChange,
  issues
}) => {
  const handleUpdateMaintenance = (
    field: keyof typeof settings.maintenance,
    val: any
  ) => {
    onChange({
      ...settings,
      maintenance: {
        ...settings.maintenance,
        [field]: val
      }
    });
  };

  const handleUpdateNotFound = (
    field: keyof typeof settings.notFoundPage,
    val: string
  ) => {
    onChange({
      ...settings,
      notFoundPage: {
        ...settings.notFoundPage,
        [field]: val
      }
    });
  };

  return (
    <div className="hok-maintenance-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Site status</h2>
        <span className="hok-editor-attribution">Soumya · 12 days ago</span>
      </div>
      <p className="hok-editor-description">
        Maintenance mode takes the storefront down for everyone outside the allow list. It sits apart from the copy for that reason.
      </p>

      {/* 8.2 Issues for Maintenance */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — Maintenance Mode */}
      <Card isFirst title="Maintenance mode" id="status-maintenance-card">
        <div id="status-maintenance-toggle">
          <PillToggle
            checked={settings.maintenance.enabled}
            onChange={(checked) => handleUpdateMaintenance('enabled', checked)}
            label="Take the storefront down and show a holding page"
          />
        </div>

        <div className="hok-two-column-group" style={{ marginTop: '11px' }}>
          <Field label="Heading">
            <input
              type="text"
              className="hok-field-input"
              value={settings.maintenance.heading}
              onChange={(e) => handleUpdateMaintenance('heading', e.target.value)}
            />
          </Field>

          <div id="status-maintenance-expected">
            <Field
              label="Expected back"
              hints="Blank says nothing rather than guessing."
            >
              <input
                type="text"
                className="hok-field-input"
                value={settings.maintenance.expectedBack}
                placeholder="—"
                onChange={(e) =>
                  handleUpdateMaintenance('expectedBack', e.target.value)
                }
              />
            </Field>
          </div>
        </div>

        <Field label="Body">
          <textarea
            className="hok-field-textarea"
            value={settings.maintenance.body}
            onChange={(e) => handleUpdateMaintenance('body', e.target.value)}
          />
        </Field>

        <div id="status-maintenance-allow-list">
          <Field
            label="Allow list"
            hints="These accounts still see the live site."
          >
            <input
              type="text"
              className="hok-field-input"
              value={settings.maintenance.allowList}
              onChange={(e) => handleUpdateMaintenance('allowList', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      {/* Card 2 — 404 Page */}
      <Card title="404 page" id="status-404-page">
        <Field label="Heading">
          <input
            type="text"
            className="hok-field-input"
            value={settings.notFoundPage.heading}
            onChange={(e) => handleUpdateNotFound('heading', e.target.value)}
          />
        </Field>

        <Field label="Body">
          <textarea
            className="hok-field-textarea"
            value={settings.notFoundPage.body}
            onChange={(e) => handleUpdateNotFound('body', e.target.value)}
          />
        </Field>

        <Field
          label="Suggested links"
          hints="A sold preloved piece leaves a dead URL behind, so this page sees more traffic than it should."
        >
          <input
            type="text"
            className="hok-field-input"
            value={settings.notFoundPage.suggestedLinks}
            onChange={(e) =>
              handleUpdateNotFound('suggestedLinks', e.target.value)
            }
          />
        </Field>
      </Card>
    </div>
  );
};
