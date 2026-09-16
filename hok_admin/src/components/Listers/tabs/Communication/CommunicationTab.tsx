// src/components/Listers/tabs/Communication/CommunicationTab.tsx

import React, { useState } from 'react';
import { CommunicationEntry } from '../../types/lister.types';
import { CHANNELS } from '../../utils/constants';
import { formatLogTimestamp } from '../../utils/formatter';
import toast from 'react-hot-toast';
import './styles/CommunicationTab.css';

interface CommunicationTabProps {
  communications: CommunicationEntry[];
  listerId: string;
  onUpdate: () => void;
  isCreateMode?: boolean;
}

const CHANNEL_CHIP_MAP: Record<string, { bg: string; text: string }> = {
  'WhatsApp': { bg: 'rgba(107,126,90,0.16)', text: '#3E4A34' },
  'Instagram': { bg: 'rgba(184,92,56,0.14)', text: '#7A2E1D' },
  'Walk-in': { bg: 'rgba(201,169,110,0.22)', text: '#6B5730' },
  'Email': { bg: '#F7F4EF', text: '#8A7E72' },
};

export const CommunicationTab: React.FC<CommunicationTabProps> = ({
  communications,
  listerId,
  onUpdate,
  isCreateMode = false,
}) => {
  const [channel, setChannel] = useState<string>('WhatsApp');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLog = async () => {
    if (!message.trim() || isCreateMode) return;
    setLoading(true);
    try {
      const { listerService } = await import('../../services/listerService');
      await listerService.logCommunication(listerId, channel, message);
      toast.success('Communication logged successfully');
      setMessage('');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to log communication:', error);
      toast.error('Failed to log communication: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="communication-tab">
      <div className="communication-card card">
        <div className="card-hd">
          <div>
            <span className="card-title">Communication Log</span>
            <div className="card-sub">
              Statements, payout confirmations, recall decisions and approvals log here automatically — add anything discussed off-platform by hand.
            </div>
          </div>
        </div>

        <div className="card-bd">
          <div className="communication-composer">
            <select
              className="comm-channel-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {CHANNELS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              className="comm-message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="One line — e.g. agreed 45% on the next couture rental"
            />
            <button 
              className="btn btn-gold btn-sm"
              onClick={handleLog}
              disabled={!message.trim() || loading || isCreateMode}
            >
              Log
            </button>
          </div>

          <div className="communication-list">
            {isCreateMode ? (
              <div className="comm-empty">
                The log starts once the record exists.
              </div>
            ) : communications.length === 0 ? (
              <div className="comm-empty">
                No interactions logged yet — statements, payout confirmations and decisions land here automatically.
              </div>
            ) : (
              communications.map((comm) => {
                const chipStyle = CHANNEL_CHIP_MAP[comm.channel] || CHANNEL_CHIP_MAP['Email'];
                return (
                  <div key={comm.id} className="comm-item">
                    <div className="comm-content">
                      <div className="comm-text">{comm.text}</div>
                      <div className="comm-time">{formatLogTimestamp(comm.timestamp)}</div>
                    </div>
                    <span 
                      className="comm-channel-chip"
                      style={{ 
                        background: chipStyle.bg, 
                        color: chipStyle.text 
                      }}
                    >
                      {comm.channel}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTab;