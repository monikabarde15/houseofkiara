// hooks/useMessages.ts
import { useState, useEffect, useCallback } from 'react';
import { messageService } from '../services/messageService';
import { Message } from '../types/messaging.types';

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
      const data = await messageService.getMessages(options);
      setMessages(data);
      setError(null);
    } catch (err: any) {
      console.error('Error in useMessages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [options.search, options.audience, options.type, options.status]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    allMessages: messages,
    loading,
    error,
    refetch: fetchMessages,
  };
};