// editor/EmailPreview.tsx (UPDATED)
import React from 'react';
import { LiveLink } from '../components/LiveLink';
import './styles/EmailPreview.css';

interface EmailPreviewProps {
  subject: string;
  previewLine: string;
  body: string;
  isRequired?: boolean;
  fromName?: string;
  fromAddress?: string;
  toAddress?: string;
  signOff?: string;
  footer?: string;
  unsubscribeLine?: string;
  // NEW: Source sections for "Filled in from" links
  sourceSections?: Array<{ label: string; section: string; to: string }>;
}

const MOCK_VARIABLES: Record<string, string> = {
  brand_name: 'House of Kaira',
  support_email: 'hello@houseofkaira.com',
  support_whatsapp: '+91 98765 43210',
  instagram_handle: '@house_of_kaira',
  site_url: 'houseofkaira.com',
  today: '11 Aug 2026',
  customer_name: 'Divya',
  customer_first_name: 'Divya',
  customer_email: 'divya.n@gmail.com',
  customer_phone: '+91 99999 88888',
  customer_city: 'Indore',
  occasion: 'Wedding',
  occasion_date: '18 Mar 2026',
  occasion_in_days: '7',
  wishlist_piece: 'Rose Georgette Anarkali',
  wishlist_designer: 'House of Kaira',
  wishlist_count: '3',
  bag_piece: 'Rose Georgette Anarkali',
  verify_url: 'houseofkaira.com/verify/9f2a',
  otp_code: '482019',
  otp_expiry_minutes: '30',
  reset_url: 'houseofkaira.com/reset/a7f3',
  reset_expiry_minutes: '30',
};

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  subject,
  previewLine,
  body,
  isRequired = true,
  fromName = 'House of Kaira',
  fromAddress = 'hello@houseofkaira.com',
  toAddress = 'divya.n@gmail.com',
  signOff = 'With warmth,\nHouse of Kaira',
  footer = 'House of Kaira, Indore, Madhya Pradesh, India\nGSTIN 23XXXXXXXXXXZX\nhello@houseofkaira.com · @house_of_kaira',
  unsubscribeLine = 'No unsubscribe line, because this one is Required and an opt-out link on a refund would be misleading.',
  sourceSections = [
    { label: 'Orders → Customer Details', section: 'Orders', to: 'Orders → Customer Details' },
    { label: 'Orders → Rental Agreement', section: 'Orders', to: 'Orders → Rental Agreement' },
  ],
}) => {
  const hasPreview = previewLine.trim().length > 0;

  const fillVariablesInString = (text: string) => {
    let result = text;
    Object.entries(MOCK_VARIABLES).forEach(([key, val]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    });
    return result;
  };

  const renderLineWithVariables = (line: string, index: number) => {
    const parts = line.split(/(\{\{[^}]+\}\})/g);
    return (
      <div key={index} className="msg-email-body-line">
        {parts.map((part, i) => {
          if (part.startsWith('{{') && part.endsWith('}}')) {
            const varName = part.substring(2, part.length - 2).trim();
            const mockValue = MOCK_VARIABLES[varName];
            if (mockValue !== undefined) {
              return (
                <span key={i} className="msg-email-standin">
                  {mockValue}
                </span>
              );
            } else {
              return (
                <span key={i} className="msg-email-unfilled">
                  {part}
                </span>
              );
            }
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  // Render body with word highlighting
  const renderBody = () => {
    const lines = body.split('\n');
    return lines.map((line, index) => {
      return renderLineWithVariables(line, index);
    });
  };

  return (
    <div className="msg-email-preview">
      <div className="msg-email-preview-frame">
        <div className="msg-email-preview-header">
          <span className="msg-email-preview-wordmark">House of Kaira</span>
        </div>
        <div className="msg-email-preview-meta">
          <div><span className="msg-email-preview-meta-label">From</span> {fromName} &lt;{fromAddress}&gt;</div>
          <div><span className="msg-email-preview-meta-label">To</span> {toAddress}</div>
          <div><span className="msg-email-preview-meta-label">Subject</span> {fillVariablesInString(subject) || '(No subject)'}</div>
          {hasPreview && (
            <div><span className="msg-email-preview-meta-label">Preview</span> {fillVariablesInString(previewLine)}</div>
          )}
        </div>
        <div className="msg-email-preview-body">
          {body.trim() ? (
            <>
              {renderBody()}
              {signOff && (
                <>
                  <div className="msg-email-signoff-spacer" />
                  <div className="msg-email-signoff">
                    {signOff.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="msg-email-empty">
              Nothing written yet. This message stays on the list so it does not get forgotten, but nothing would go out.
            </div>
          )}
        </div>
        <div className="msg-email-preview-footer">
          {footer.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* NEW: "Filled in from" section with LiveLinks */}
      <div className="msg-email-preview-source">
        <span className="msg-email-preview-source-label">Filled in from</span>
        {' '}
        {sourceSections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 && ' · '}
            <LiveLink to={section.to} section={section.section}>
              {section.label}
            </LiveLink>
          </React.Fragment>
        ))}
      </div>

      {isRequired && (
        <div className="msg-email-preview-hint">
          No unsubscribe line, because this one is Required and an opt-out link on a refund would be misleading.
        </div>
      )}
      <div className="msg-email-preview-legend">
        Gold means a stand-in filled a gap. Terracotta means a word could not be filled in at all, and a message in that state is held back rather than going out broken.
      </div>
    </div>
  );
};