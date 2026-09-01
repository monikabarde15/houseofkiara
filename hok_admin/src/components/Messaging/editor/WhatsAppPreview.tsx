// editor/WhatsAppPreview.tsx
import React from 'react';
import './styles/WhatsAppPreview.css';

interface WhatsAppPreviewProps {
  content: string;
  isOn: boolean;
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

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ content, isOn }) => {
  const charCount = content.length;

  const renderContent = () => {
    if (!isOn) {
      return (
        <div className="msg-whatsapp-empty">
          WhatsApp is off for this one.
        </div>
      );
    }

    if (!content.trim()) {
      return (
        <div className="msg-whatsapp-empty">
          WhatsApp is switched on with nothing written for it. Worth fixing.
        </div>
      );
    }

    // Render with word highlighting
    const lines = content.split('\n');
    return (
      <>
        {lines.map((line, index) => {
          const parts = line.split(/(\{\{[^}]+\}\})/g);
          return (
            <div key={index} className="msg-whatsapp-line">
              {parts.map((part, i) => {
                if (part.startsWith('{{') && part.endsWith('}}')) {
                  const varName = part.substring(2, part.length - 2).trim();
                  const mockValue = MOCK_VARIABLES[varName];
                  if (mockValue !== undefined) {
                    return (
                      <span key={i} className="msg-whatsapp-standin">
                        {mockValue}
                      </span>
                    );
                  } else {
                    return (
                      <span key={i} className="msg-whatsapp-unfilled">
                        {part}
                      </span>
                    );
                  }
                }
                return <span key={i}>{part}</span>;
              })}
            </div>
          );
        })}
        {charCount > 0 && (
          <div className="msg-whatsapp-char-count">
            {charCount} characters. WhatsApp shortens the preview past roughly 120.
          </div>
        )}
      </>
    );
  };

  return (
    <div className="msg-whatsapp-preview">
      <div className={`msg-whatsapp-preview-body ${!isOn || !content.trim() ? 'msg-whatsapp-preview-body--empty' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};