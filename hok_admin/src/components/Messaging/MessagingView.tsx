// MessagingView.tsx (UPDATED)
import React, { useState } from 'react';
import { MessagingHeader } from './components/MessagingHeader';
import { StatTiles } from './components/StatTiles';
import { TabBar } from './components/TabBar';
import { MessagesTab } from './tabs/MessagesTab';
import { EditorTab } from './tabs/EditorTab';
import { SendTab } from './tabs/SendTab';
import { SendLogTab } from './tabs/SendLogTab';
import { SetupTab } from './tabs/SetupTab';  // ✅ Changed from SettingsTab to SetupTab
import { mockMessages } from './data/mockMessages';
import { Message } from './types/messaging.types';
import './MessagingView.css';
import './styles/variables.css';

const TABS = [
  { id: 'messages', label: 'Messages' },
  { id: 'editor', label: 'Editor' },
  { id: 'send', label: 'Send' },
  { id: 'sendlog', label: 'Send Log' },
  { id: 'setup', label: 'Setup' },  // ✅ Changed from 'settings' to 'setup'
];

const STAT_TILES = [
  { 
    label: 'Messages', 
    number: 73, 
    numberColor: 'charcoal' as const,
    caption: 'to customers, listers and your own desk'
  },
  { 
    label: 'Live', 
    number: 73, 
    numberColor: 'sage' as const,
    caption: 'written and switched on'
  },
  { 
    label: 'Not Written Yet', 
    number: 0, 
    numberColor: 'gold' as const,
    caption: 'every message has wording'
  },
  { 
    label: 'Sent', 
    number: 18, 
    numberColor: 'charcoal' as const,
    caption: '1 held back — 1 bounced'
  },
];

interface MessagingViewProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  selectedMessageId?: string | null;
  setSelectedMessageId?: (id: string | null) => void;
  messages?: Message[];
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  selectedMessageId: propSelectedMessageId,
  setSelectedMessageId: propSetSelectedMessageId,
  messages: propMessages,
  setMessages: propSetMessages,
}) => {
  const [localActiveTab, localSetActiveTab] = useState('messages');
  const [localSelectedMessageId, localSetSelectedMessageId] = useState<string | null>(null);
  const [localMessages, localSetMessages] = useState<Message[]>(mockMessages);

  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : localSetActiveTab;
  const selectedMessageId = propSelectedMessageId !== undefined ? propSelectedMessageId : localSelectedMessageId;
  const setSelectedMessageId = propSetSelectedMessageId !== undefined ? propSetSelectedMessageId : localSetSelectedMessageId;
  const messages = propMessages !== undefined ? propMessages : localMessages;
  const setMessages = propSetMessages !== undefined ? propSetMessages : localSetMessages;

  const handleOpenEditor = (messageId: string) => {
    setSelectedMessageId(messageId);
    setActiveTab('editor');
  };

  const handleBackToMessages = () => {
    setSelectedMessageId(null);
    setActiveTab('messages');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <MessagesTab 
            messages={messages}
            setMessages={setMessages}
            onOpenEditor={handleOpenEditor} 
          />
        );
      case 'editor': {
        const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;
        return (
          <EditorTab 
            message={selectedMessage} 
            onBack={handleBackToMessages} 
            onSelectMessage={handleOpenEditor}
            onNewMessageCreated={(newMsg) => {
              setMessages(prev => [newMsg, ...prev]);
            }}
          />
        );
      }
      case 'send':
        return <SendTab />;
      case 'sendlog':
        return <SendLogTab />;
      case 'setup':  // ✅ Changed from 'settings' to 'setup'
        return <SetupTab />;
      default:
        return null;
    }
  };

  return (
    <div className="msg-view">
      <MessagingHeader />
      <StatTiles tiles={STAT_TILES} />
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="msg-view-content">
        {renderTabContent()}
      </div>
    </div>
  );
};