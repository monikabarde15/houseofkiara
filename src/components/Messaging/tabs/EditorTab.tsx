// tabs/EditorTab.tsx (UPDATED)
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { EditorHeader } from '../editor/EditorHeader';
import { EditorMessageCard } from '../editor/EditorMessageCard';
import { EditorWordingCard } from '../editor/EditorWordingCard';
import { useMessageActions } from '../hooks/useMessageActions';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ProblemBanner } from '../messages/ProblemBanner';
import { ALERTS } from '../utils/alerts';
import { Message } from '../types/messaging.types';
import './styles/EditorTab.css';

interface EditorTabProps {
  message: Message | null;
  onBack: () => void;
  onSelectMessage?: (id: string) => void;
  onNewMessageCreated?: (newMsg: Message) => void;
}

export const EditorTab: React.FC<EditorTabProps> = ({ 
  message, 
  onBack, 
  onSelectMessage, 
  onNewMessageCreated 
}) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showTestConfirm, setShowTestConfirm] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [wordingContent, setWordingContent] = useState('');

  const { loading, sendTest, createMessage } = useMessageActions({
    onSuccess: () => {
      setAlertMessage('Test sent successfully!');
      setTimeout(() => setAlertMessage(null), 3000);
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
    }
  };

  // K9 - Sending a test
  const handleSendTest = () => {
    const variables = ['customer_name', 'order_id', 'item_name'];
    const hasUnfilled = variables.some(v => !wordingContent.includes(`{{${v}}}`));
    
    if (hasUnfilled) {
      setAlertMessage(ALERTS.TEST_CANNOT_FILL('customer_name'));
      return;
    }
    
    setShowTestConfirm(true);
  };

  const handleConfirmTest = async () => {
    const variables = ['customer_name', 'order_id', 'item_name'];
    await sendTest(wordingContent, variables);
    setShowTestConfirm(false);
  };

  // Send This To Someone - opens Send tab
  const handleSendToSomeone = () => {
    // Navigate to Send tab with this message pre-selected
    // This would be handled by the parent component
    setAlertMessage('Opening Send tab...');
    setTimeout(() => setAlertMessage(null), 2000);
  };

  if (!message) {
    return (
      <div className="msg-editor-empty">
        <div className="msg-editor-empty-text">
          Pick a message from the list to change what it says.
        </div>
        <div className="msg-editor-empty-actions">
          <Button variant="secondary" size="small" onClick={onBack}>
            See all messages
          </Button>
          <Button variant="primary" size="small" onClick={handleNewMessage} disabled={loading}>
            + New Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-editor-tab">
      {alertMessage && (
        <ProblemBanner>
          <strong>{alertMessage.includes('Test sent') ? 'Success' : 'Alert'}</strong>
          <div>{alertMessage}</div>
          <button 
            className="msg-alert-dismiss"
            onClick={() => setAlertMessage(null)}
          >
            ×
          </button>
        </ProblemBanner>
      )}

      <EditorMessageCard message={message} />
      <EditorWordingCard 
        messageRequired={true}
        onSendTest={handleSendTest}
        onSendToSomeone={handleSendToSomeone}
        onWordingChange={setWordingContent}
      />

      <ConfirmModal
        isOpen={showTestConfirm}
        message="Send test email to the test address? The wording will be filled in against real seed data."
        confirmLabel="Send Test"
        cancelLabel="Cancel"
        onConfirm={handleConfirmTest}
        onCancel={() => setShowTestConfirm(false)}
      />

      <ConfirmModal
        isOpen={showSendConfirm}
        message="Send this message to the selected recipients?"
        confirmLabel="Send"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowSendConfirm(false);
          setAlertMessage('Message sent successfully!');
          setTimeout(() => setAlertMessage(null), 3000);
        }}
        onCancel={() => setShowSendConfirm(false)}
      />
    </div>
  );
};