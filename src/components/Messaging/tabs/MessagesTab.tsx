// tabs/MessagesTab.tsx (UPDATED)
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Toolbar, SearchField, FilterSelect } from '../components/Toolbar';
import { Button } from '../components/Button';
import { MessagesTable } from '../messages/MessagesTable';
import { MessagesFooter } from '../messages/MessagesFooter';
import { ProblemBanner } from '../messages/ProblemBanner';
import { useMessageActions } from '../hooks/useMessageActions';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ALERTS } from '../utils/alerts';
import { Message } from '../types/messaging.types';
import { mockMessages } from '../data/mockMessages';
import './styles/MessagesTab.css';

interface MessagesTabProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onOpenEditor: (messageId: string) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ 
  messages, 
  setMessages, 
  onOpenEditor 
}) => {
  const [search, setSearch] = useState('');
  const [audience, setAudience] = useState('Everyone');
  const [type, setType] = useState('Required and optional');
  const [status, setStatus] = useState('Any status');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { loading, createMessage, copyMessage, removeMessage } = useMessageActions({
    onSuccess: () => {
      setAlertMessage(null);
    },
    onError: (error) => {
      setAlertMessage(error);
    },
  });

  const handleNewMessage = async () => {
    const newMsg = await createMessage();
    if (newMsg) {
      setMessages([newMsg, ...messages]);
      // Open the new message in editor
      onOpenEditor(newMsg.id);
    }
  };

  const handleCopyMessage = async (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      const copied = await copyMessage(msg);
      if (copied) {
        setMessages([copied, ...messages]);
        onOpenEditor(copied.id);
      }
    }
  };

  const handleRemoveMessage = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    if (msg.sentCount && msg.sentCount > 0) {
      setAlertMessage(ALERTS.REMOVE_SENT_MESSAGE(msg.sentCount));
      return;
    }

    if (!msg.isYours) {
      setAlertMessage(ALERTS.REMOVE_BUILTIN_MESSAGE);
      return;
    }

    setConfirmMessage(`Remove "${msg.name}"? It has never been sent, so nothing is lost.`);
    setConfirmAction(() => async () => {
      const success = await removeMessage(msg);
      if (success) {
        setMessages(messages.filter(m => m.id !== messageId));
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const hasProblems = false;
  const problems = [
    'Welcome Email is switched on for WhatsApp that has no wording, so it would go out blank',
  ];

  const filteredMessages = messages.filter((msg) => {
    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const nameMatch = msg.name.toLowerCase().includes(q);
      const subjectMatch = msg.subject?.toLowerCase().includes(q) || false;
      const triggerMatch = msg.trigger.toLowerCase().includes(q);
      if (!nameMatch && !subjectMatch && !triggerMatch) {
        return false;
      }
    }
    // 2. Audience filter
    if (audience !== 'Everyone') {
      if (msg.audience !== audience) {
        return false;
      }
    }
    // 3. Type filter
    if (type !== 'Required and optional') {
      if (type === 'Required' && msg.class !== 'Required') {
        return false;
      }
      if (type === 'Marketing' && msg.class !== 'Marketing') {
        return false;
      }
    }
    // 4. Status filter
    if (status !== 'Any status') {
      if (msg.status !== status) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="msg-messages-tab">
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

      {hasProblems && (
        <ProblemBanner>
          <strong>{problems.length} message{problems.length > 1 ? 's' : ''} would not send properly</strong>
          {problems.slice(0, 6).map((problem, i) => (
            <div key={i}>· {problem}</div>
          ))}
        </ProblemBanner>
      )}

      <Card>
        <Toolbar>
          <SearchField 
            placeholder="Search a message, or something it says..." 
            value={search} 
            onChange={setSearch} 
          />
          <FilterSelect 
            options={['Everyone', 'Customer', 'Lister', 'You']} 
            value={audience} 
            onChange={setAudience} 
          />
          <FilterSelect 
            options={['Required and optional', 'Required', 'Marketing']} 
            value={type} 
            onChange={setType} 
          />
          <FilterSelect 
            options={['Any status', 'Live', 'Paused', 'Not written']} 
            value={status} 
            onChange={setStatus} 
          />
          <Button variant="secondary" size="small">Export CSV</Button>
          <Button 
            variant="primary" 
            size="small" 
            onClick={handleNewMessage}
            disabled={loading}
          >
            + New Message
          </Button>
        </Toolbar>

        <MessagesTable 
          messages={filteredMessages} 
          onRowClick={onOpenEditor}
          onCopy={handleCopyMessage}
          onRemove={handleRemoveMessage}
        />
        <MessagesFooter count={filteredMessages.length} total={messages.length} />
      </Card>

      <ConfirmModal
        isOpen={showConfirm}
        message={confirmMessage}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={() => {
          confirmAction();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        isDestructive
      />
    </div>
  );
};