// hooks/useMessageActions.ts
import { useState, useCallback } from 'react';
import { ALERTS } from '../utils/alerts';
import { Message } from '../types/messaging.types';
import { messageService } from '../services/messageService';

interface UseMessageActionsOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useMessageActions = (options: UseMessageActionsOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Creating a new message via DB API
  const createMessage = useCallback(async () => {
    setLoading(true);
    try {
      const newMessage = await messageService.createMessage();
      options.onSuccess?.();
      return newMessage;
    } catch (err: any) {
      const msg = err.message || 'Failed to create message';
      setError(msg);
      options.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Copying a message via DB API
  const copyMessage = useCallback(async (message: Message) => {
    setLoading(true);
    try {
      const copiedMessage = await messageService.copyMessage(message.id);
      options.onSuccess?.();
      return copiedMessage;
    } catch (err: any) {
      const msg = err.message || 'Failed to copy message';
      setError(msg);
      options.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Removing a message via DB API
  const removeMessage = useCallback(async (message: Message) => {
    setLoading(true);
    try {
      if (message.sentCount && message.sentCount > 0) {
        const alertMsg = ALERTS.REMOVE_SENT_MESSAGE(message.sentCount);
        options.onError?.(alertMsg);
        return false;
      }

      if (!message.isYours) {
        options.onError?.(ALERTS.REMOVE_BUILTIN_MESSAGE);
        return false;
      }

      await messageService.deleteMessage(message.id);
      options.onSuccess?.();
      return true;
    } catch (err: any) {
      const msg = err.message || 'Failed to remove message';
      setError(msg);
      options.onError?.(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Logging a message sent by hand
  const logHandSent = useCallback(async (data: { name: string; channel: string; about: string }) => {
    setLoading(true);
    try {
      if (!data.name || !data.channel || !data.about) {
        options.onError?.('All fields are required.');
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      const logEntry = {
        id: `log_${Date.now()}`,
        when: new Date().toLocaleString(),
        message: 'Hand-sent message',
        wording: 'Default',
        who: data.name,
        contact: '—',
        channel: data.channel,
        outcome: 'Delivered' as const,
        about: data.about,
        sentBy: 'You',
      };
      options.onSuccess?.();
      return logEntry;
    } catch (err) {
      const msg = 'Failed to log hand-sent message';
      setError(msg);
      options.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Sending a test
  const sendTest = useCallback(async (wording: string, variables: string[]) => {
    setLoading(true);
    try {
      const unfilled = variables.filter(v => !wording.includes(`{{${v}}}`));
      if (unfilled.length > 0) {
        const alertMsg = ALERTS.TEST_CANNOT_FILL(unfilled[0]);
        options.onError?.(alertMsg);
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      options.onSuccess?.();
      return true;
    } catch (err) {
      const msg = 'Failed to send test';
      setError(msg);
      options.onError?.(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    loading,
    error,
    createMessage,
    copyMessage,
    removeMessage,
    logHandSent,
    sendTest,
  };
};