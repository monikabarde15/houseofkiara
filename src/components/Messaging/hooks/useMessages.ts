// hooks/useMessages.ts
import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  name: string;
  wordingCount: number;
  isYours: boolean;
  trigger: string;
  subject: string;
  audience: 'Customer' | 'Lister' | 'Designer' | 'You';
  class: 'Required' | 'Optional' | 'Marketing';
  channels: ('email' | 'whatsapp' | 'website')[];
  status: 'Live' | 'Paused' | 'Not written';
  lastEdited: string;
  editor: string;
}

interface UseMessagesOptions {
  search?: string;
  audience?: string;
  type?: string;
  status?: string;
}

export const useMessages = (options: UseMessagesOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      const response = await new Promise<Message[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              name: 'Welcome Email',
              wordingCount: 2,
              isYours: false,
              trigger: 'Sent when a customer creates an account',
              subject: 'Welcome to House of Kaira',
              audience: 'Customer',
              class: 'Required',
              channels: ['email', 'whatsapp', 'website'],
              status: 'Live',
              lastEdited: '22 Mar 2026',
              editor: 'Priya Sharma',
            },
            // ... more messages
          ]);
        }, 300);
      });
      setMessages(response);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = messages.filter((msg) => {
    if (options.search && !msg.name.toLowerCase().includes(options.search.toLowerCase())) {
      return false;
    }
    if (options.audience && options.audience !== 'Everyone' && msg.audience !== options.audience) {
      return false;
    }
    if (options.type && options.type !== 'Required and optional') {
      if (options.type === 'Required' && msg.class !== 'Required') return false;
      if (options.type === 'Marketing' && msg.class !== 'Marketing') return false;
    }
    if (options.status && options.status !== 'Any status' && msg.status !== options.status) {
      return false;
    }
    return true;
  });

  return {
    messages: filteredMessages,
    allMessages: messages,
    loading,
    error,
    refetch: fetchMessages,
  };
};