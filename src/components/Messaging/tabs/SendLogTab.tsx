// tabs/SendLogTab.tsx (UPDATED)
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Toolbar, SearchField, FilterSelect } from '../components/Toolbar';
import { Button } from '../components/Button';
import { Pill } from '../components/Pill';
import { useMessageActions } from '../hooks/useMessageActions';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ProblemBanner } from '../messages/ProblemBanner';
import './styles/SendLogTab.css';

interface LogEntry {
  id: string;
  when: string;
  message: string;
  wording: string;
  who: string;
  contact: string;
  channel: string;
  outcome: 'Delivered' | 'Opened' | 'Bounced' | 'Held' | 'Not sent';
  about: string;
  sentBy: string;
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    when: '22 Mar 2026, 15:04',
    message: 'Welcome Email',
    wording: 'Default',
    who: 'Priya Sharma',
    contact: 'priya@email.com',
    channel: 'Email',
    outcome: 'Delivered',
    about: 'Account created',
    sentBy: 'System',
  },
  {
    id: '2',
    when: '22 Mar 2026, 14:30',
    message: 'Order Confirmation',
    wording: 'Default',
    who: 'Amit Patel',
    contact: '+91 98765 43210',
    channel: 'WhatsApp',
    outcome: 'Opened',
    about: 'ORD-1234',
    sentBy: 'System',
  },
  {
    id: '3',
    when: '21 Mar 2026, 11:20',
    message: 'Return Initiated',
    wording: 'Default',
    who: 'Neha Kulkarni',
    contact: 'neha@email.com',
    channel: 'Email',
    outcome: 'Bounced',
    about: 'RET-5678',
    sentBy: 'You',
  },
];

const OUTCOME_PILL_MAP = {
  'Delivered': 'blue' as const,
  'Opened': 'green' as const,
  'Bounced': 'terracotta' as const,
  'Held': 'amber' as const,
  'Not sent': 'grey' as const,
};

export const SendLogTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('All channels');
  const [outcome, setOutcome] = useState('All outcomes');
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showHandLogPrompt, setShowHandLogPrompt] = useState(false);
  const [handLogStep, setHandLogStep] = useState(0);
  const [handLogData, setHandLogData] = useState({ name: '', channel: 'Instagram', about: '' });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { loading, logHandSent } = useMessageActions({
    onSuccess: () => {
      setAlertMessage(null);
      setShowHandLogPrompt(false);
      setHandLogStep(0);
      setHandLogData({ name: '', channel: 'Instagram', about: '' });
    },
    onError: (error) => {
      setAlertMessage(error);
    },
  });

  // K8 - Logging a message sent by hand
  const handleLogHandSent = () => {
    setShowHandLogPrompt(true);
    setHandLogStep(0);
    setHandLogData({ name: '', channel: 'Instagram', about: '' });
  };

  const handleHandLogNext = () => {
    if (handLogStep === 0 && !handLogData.name.trim()) {
      setAlertMessage('Please enter a name.');
      return;
    }
    if (handLogStep === 0) {
      setHandLogStep(1);
      return;
    }
    if (handLogStep === 1 && !handLogData.channel.trim()) {
      setAlertMessage('Please enter a channel.');
      return;
    }
    if (handLogStep === 1) {
      setHandLogStep(2);
      return;
    }
    if (handLogStep === 2 && !handLogData.about.trim()) {
      setAlertMessage('Please enter what it was about.');
      return;
    }
    if (handLogStep === 2) {
      // Submit
      logHandSent(handLogData);
      return;
    }
  };

  const handleHandLogCancel = () => {
    setShowHandLogPrompt(false);
    setHandLogStep(0);
    setHandLogData({ name: '', channel: 'Instagram', about: '' });
  };

  const renderHandLogPrompt = () => {
    const steps = [
      { label: 'Who did you speak to? Type their name.', field: 'name' as const, placeholder: 'Enter name' },
      { label: 'Which channel? Type one of: WhatsApp, Instagram, In Person, Email', field: 'channel' as const, placeholder: 'Instagram' },
      { label: 'What was it about? A short note, and an order number if there is one.', field: 'about' as const, placeholder: 'Enter details' },
    ];

    const step = steps[handLogStep];
    if (!step) return null;

    return (
      <div className="msg-handlog-prompt">
        <div className="msg-handlog-prompt-label">{step.label}</div>
        <input
          type="text"
          className="msg-handlog-prompt-input"
          placeholder={step.placeholder}
          value={handLogData[step.field]}
          onChange={(e) => setHandLogData({ ...handLogData, [step.field]: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleHandLogNext();
            }
            if (e.key === 'Escape') {
              handleHandLogCancel();
            }
          }}
          autoFocus
        />
        <div className="msg-handlog-prompt-actions">
          <Button variant="secondary" size="small" onClick={handleHandLogCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="small" onClick={handleHandLogNext}>
            {handLogStep === 2 ? 'Log' : 'Next'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="msg-sendlog-tab">
      {alertMessage && (
        <ProblemBanner>
          <strong>Alert</strong>
          <div>{alertMessage}</div>
          <button 
            className="msg-alert-dismiss"
            onClick={() => setAlertMessage(null)}
          >
            ×
          </button>
        </ProblemBanner>
      )}

      {showHandLogPrompt && (
        <div className="msg-handlog-overlay">
          <div className="msg-handlog-panel">
            {renderHandLogPrompt()}
          </div>
        </div>
      )}

      <Card>
        <Toolbar>
          <SearchField 
            placeholder="Search a name, message or order..." 
            value={search} 
            onChange={setSearch} 
          />
          <FilterSelect 
            options={['All channels', 'Email', 'WhatsApp', 'Instagram', 'In Person', 'Website']} 
            value={channel} 
            onChange={setChannel} 
          />
          <FilterSelect 
            options={['All outcomes', 'Delivered', 'Opened', 'Bounced', 'Held', 'Not sent']} 
            value={outcome} 
            onChange={setOutcome} 
          />
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleLogHandSent}
            disabled={loading}
          >
            + Log a message sent by hand
          </Button>
          <Button variant="secondary" size="small">Export CSV</Button>
        </Toolbar>

        <div className="msg-sendlog-table-wrapper">
          <table className="msg-table">
            <thead>
              <tr>
                <th>WHEN</th>
                <th>MESSAGE</th>
                <th>WHO</th>
                <th>CHANNEL</th>
                <th>OUTCOME</th>
                <th>ABOUT</th>
                <th>SENT BY</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="msg-sendlog-row">
                  <td>{log.when}</td>
                  <td>
                    <div className="msg-sendlog-message-name">{log.message}</div>
                    {log.wording !== 'Default' && (
                      <div className="msg-sendlog-wording">{log.wording}</div>
                    )}
                  </td>
                  <td>
                    <div className="msg-sendlog-who">{log.who}</div>
                    <div className="msg-sendlog-contact">{log.contact}</div>
                  </td>
                  <td>{log.channel}</td>
                  <td>
                    <Pill status={OUTCOME_PILL_MAP[log.outcome]}>
                      {log.outcome}
                    </Pill>
                  </td>
                  <td>{log.about}</td>
                  <td>{log.sentBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="msg-footer">
          <span className="msg-footer-count">{logs.length} of {logs.length} sends</span>
          <span className="msg-footer-hint">
            Every send also appears on that person's own record, so the customer and lister pages stay the one place to read a relationship.
          </span>
        </div>
      </Card>
    </div>
  );
};