// tabs/MessagesTab.tsx (UPDATED)
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { MessagesToolbar } from '../messages/MessagesToolbar';
import { MessagesTable } from '../messages/MessagesTable';
import { MessagesFooter } from '../messages/MessagesFooter';
import { ProblemBanner } from '../messages/ProblemBanner';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ALERTS } from '../utils/alerts';
import { Message } from '../types/messaging.types';
import { useMessages } from '../hooks/useMessages';
import { useMessageActions } from '../hooks/useMessageActions';
import './styles/MessagesTab.css';

interface MessagesTabProps {
  messages?: Message[];
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
  onOpenEditor: (messageId: string) => void;
  onNewMessageCreated?: (newMsg: Message) => void;
  onSelectMessage?: (id: string) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ 
  messages: propMessages,
  setMessages: propSetMessages,
  onOpenEditor, 
  onNewMessageCreated,
  onSelectMessage 
}) => {
  const [search, setSearch] = useState('');
  const [audience, setAudience] = useState('Everyone');
  const [type, setType] = useState('Required and optional');
  const [status, setStatus] = useState('Any status');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { messages, loading, refetch } = useMessages({
    search,
    audience,
    type,
    status,
  });

  React.useEffect(() => {
    if (propSetMessages) {
      propSetMessages(messages);
    }
  }, [messages, propSetMessages]);

  const { createMessage, copyMessage, removeMessage } = useMessageActions({
    onSuccess: () => {
      setAlertMessage(null);
      refetch();
    },
    onError: (error) => {
      setAlertMessage(error);
    },
  });

  const handleNewMessage = async () => {
    const newMsg = await createMessage();
    if (newMsg) {
      if (onNewMessageCreated) {
        onNewMessageCreated(newMsg);
      }
      if (onSelectMessage) {
        onSelectMessage(newMsg.id);
      }
      onOpenEditor(newMsg.id);
    }
  };

  const handleCopyMessage = async (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      const copied = await copyMessage(msg);
      if (copied) {
        refetch();
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
        refetch();
      }
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleExport = () => {
    // Export CSV logic
    console.log('Exporting messages...');
  };

  // UPDATED: Problem banner with Setup reference
  const hasProblems = false;
  const problems = [
    // UPDATED: Now references Setup instead of Settings
    'Care Card has no file, so it would arrive empty. Upload it in Setup.',
  ];

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
        <MessagesToolbar
          search={search}
          onSearchChange={setSearch}
          audience={audience}
          onAudienceChange={setAudience}
          type={type}
          onTypeChange={setType}
          status={status}
          onStatusChange={setStatus}
          onExport={handleExport}
          onNewMessage={handleNewMessage}
          loading={loading}
        />

        <MessagesTable 
          messages={messages} 
          onRowClick={onOpenEditor}
          onCopy={handleCopyMessage}
          onRemove={handleRemoveMessage}
        />
        <MessagesFooter count={messages.length} total={messages.length} />
      </Card>

      <ConfirmModal
        isOpen={showConfirm}
        message={confirmMessage}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={() => {
          setConfirmAction();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        isDestructive
      />
    </div>
  );
};