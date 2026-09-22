// src/components/LYP/record/MoreInfoComposer.tsx

import React, { useState } from 'react';
import { Submission } from '../types/submission.types';
import { getFirstName } from '../utils/formatter';
import { generateWhatsAppLink } from '../utils/generators';
import './styles/MoreInfoComposer.css';

interface MoreInfoComposerProps {
  submission: Submission;
  onSuccess: () => void;
  onCancel: () => void;
}

const PRESET_MESSAGES = {
  daylight: "Hi {first}! To finish reviewing your {piece}, could you share 2-3 photos in natural daylight - full front, back, and a close-up of the work?",
  purchase: "Hi {first}! For a {designer} piece we do a quick authenticity check - could you share the purchase invoice or any proof of purchase?",
  care: "Hi {first}! Quick one on the {piece} - has it been dry-cleaned, altered, or repaired anywhere? Helps us grade it fairly.",
  fullset: "Hi {first}! Could you share one photo with every component of the {piece} laid out together - so nothing gets missed at pickup?",
};

export const MoreInfoComposer: React.FC<MoreInfoComposerProps> = ({
  submission,
  onSuccess,
  onCancel,
}) => {
  const [preset, setPreset] = useState<string>('write');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const firstName = getFirstName(submission.listerID);
  const designer = submission.designer || 'designer';

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value === 'write') {
      setMessage('');
      return;
    }
    const template = PRESET_MESSAGES[value as keyof typeof PRESET_MESSAGES];
    if (template) {
      setMessage(template
        .replace(/{first}/g, firstName)
        .replace(/{piece}/g, submission.piece)
        .replace(/{designer}/g, designer)
      );
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    
    // In production, this would send via WhatsApp API
    const link = generateWhatsAppLink('', message);
    if (link) {
      window.open(link, '_blank');
    }
    
    try {
      const { submissionService } = await import('../services/submissionService');
      const { toast } = await import('react-hot-toast');
      await submissionService.requestMoreInfo(submission.subid, message);
      toast.success('Requested more info!');
      onSuccess();
    } catch (err: any) {
      import('react-hot-toast').then(({ toast }) => toast.error(err.message || 'Failed to request info'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="more-info-composer">
      <div className="more-info-grid g2">
        <div className="fld">
          <label className="fld-label">What to ask for</label>
          <select
            className="fld-input"
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            <option value="write">Write my own...</option>
            <option value="daylight">More photos in daylight</option>
            <option value="purchase">Purchase proof / invoice</option>
            <option value="care">Care & cleaning history</option>
            <option value="fullset">Full-set photo - every component</option>
          </select>
        </div>
        <div className="fld">
          {/* Empty balance column */}
        </div>
      </div>

      <div className="fld">
        <label className="fld-label">WhatsApp message</label>
        <textarea
          className="fld-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do we need from the lister?"
          rows={3}
        />
      </div>

      <div className="more-info-actions">
        <button 
          className="btn btn-gold btn-sm" 
          onClick={handleSend}
          disabled={!message.trim() || loading}
        >
          {loading ? 'Sending...' : 'Send & mark Awaiting Reply'}
        </button>
        <button 
          className="btn btn-sec btn-sm" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};