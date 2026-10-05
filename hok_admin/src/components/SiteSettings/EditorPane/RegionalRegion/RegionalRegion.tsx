import React from 'react';
import './RegionalRegion.css';
import { RegionalSettings, HealthIssue } from '../../types/siteSettings.types';
import { Card } from '../../shared/Card/Card';
import { Field } from '../../shared/Field/Field';
import { IssueStrip } from '../../shared/IssueStrip/IssueStrip';

interface RegionalRegionProps {
  settings: RegionalSettings;
  onChange: (updated: RegionalSettings) => void;
  issues: HealthIssue[];
  onNavigateToMasterData?: () => void;
}

export const RegionalRegion: React.FC<RegionalRegionProps> = ({
  settings,
  onChange,
  issues,
  onNavigateToMasterData
}) => {
  // Compute currency symbol
  const getCurrencySymbol = (curr: string) => {
    if (curr.includes('INR') || curr.includes('₹')) return '₹';
    if (curr.includes('USD') || curr.includes('$')) return '$';
    if (curr.includes('AED') || curr.includes('د.إ')) return 'AED ';
    if (curr.includes('GBP') || curr.includes('£')) return '£';
    return '₹';
  };

  const currSym = getCurrencySymbol(settings.currency);

  // Compute number sample
  const numberSample =
    settings.numberFormat.includes('Indian')
      ? `Prints: ${currSym}1,50,000 and ${currSym}1,25,00,000`
      : `Prints: ${currSym}150,000 and ${currSym}12,500,000`;

  return (
    <div className="hok-regional-region">
      {/* 8.1 Heading Row */}
      <div className="hok-editor-heading-row">
        <h2 className="hok-editor-title">Regional</h2>
        <span className="hok-editor-attribution">Priya (Ops) · 2 days ago</span>
      </div>
      <p className="hok-editor-description">
        Timezone, currency and the way dates and figures are written. Environment settings, set once at launch — the same class of thing as the site’s address, not a commercial rule like a payout split.
      </p>

      {/* 8.2 Issues for Regional */}
      {issues.map((issue) => (
        <IssueStrip
          key={issue.id}
          severity={issue.severity}
          message={issue.message}
          actionLabel={issue.actionLabel}
        />
      ))}

      {/* Card 1 — Regional */}
      <Card
        isFirst
        title="Regional"
        subtitle="Set once at launch. Changing any of these re-reads every stored timestamp and price, so it is not a running adjustment."
        id="regional-card"
      >
        {/* Timezone & Currency */}
        <div className="hok-two-column-group">
          <div id="regional-timezone">
            <Field
              label="Timezone"
              hints="Every timestamp in Orders, the rental calendar, Dispatch and the 08:00 notification digests."
            >
              <select
                className="hok-field-select"
                value={settings.timezone}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    timezone: e.target.value as 'Asia/Kolkata (IST)' | 'Asia/Dubai (GST)' | 'Europe/London (GMT)'
                  })
                }
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              </select>
            </Field>
          </div>

          <div id="regional-currency">
            <Field
              label="Currency"
              hints="Every price, invoice, payout statement and GST line."
            >
              <select
                className="hok-field-select"
                value={settings.currency}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    currency: e.target.value as 'INR ₹' | 'USD $' | 'AED د.إ' | 'GBP £'
                  })
                }
              >
                <option value="INR ₹">INR ₹</option>
                <option value="USD $">USD $</option>
                <option value="AED د.إ">AED د.إ</option>
                <option value="GBP £">GBP £</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Date Format & Number Format */}
        <div className="hok-two-column-group">
          <div id="regional-date-format">
            <Field
              label="Date format"
              hints={[
                'Prints: 23 Mar 2026',
                'How dates read in the panel and on order confirmations.'
              ]}
            >
              <select
                className="hok-field-select"
                value={settings.dateFormat}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    dateFormat: e.target.value as 'DD MMM YYYY' | 'DD/MM/YYYY' | 'MMM DD, YYYY' | 'YYYY-MM-DD'
                  })
                }
              >
                <option value="DD MMM YYYY">DD MMM YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </Field>
          </div>

          <div id="regional-number-format">
            <Field
              label="Number format"
              hints={[
                numberSample,
                'How a large figure is grouped wherever it is printed.'
              ]}
            >
              <select
                className="hok-field-select"
                value={settings.numberFormat}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    numberFormat: e.target.value as 'Indian — lakh and crore' | 'International — thousand and million'
                  })
                }
              >
                <option value="Indian — lakh and crore">Indian — lakh and crore</option>
                <option value="International — thousand and million">
                  International — thousand and million
                </option>
              </select>
            </Field>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.45 }}>
          These are configuration, the same class of thing as the site’s address and the registered entity — not a commercial rule like a payout split or a condition grade. That is why they sit in Site Settings and not in{' '}
          <button
            type="button"
            className="hok-btn-text-action"
            onClick={onNavigateToMasterData}
          >
            Master Data
          </button>
          , even though Orders, the rental calendar, Dispatch and Payouts all read them.
        </div>
      </Card>
    </div>
  );
};
