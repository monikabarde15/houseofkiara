// hooks/useMessageActions.ts
import { useState, useCallback } from 'react';
import { ALERTS } from '../utils/alerts';
import { Message } from '../types/messaging.types';

interface UseMessageActionsOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useMessageActions = (options: UseMessageActionsOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // K3 - Creating a new message
  const createMessage = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        name: 'New message',
        wordingCount: 1,
        isYours: true,
        trigger: 'Sent by hand, so nothing fires on its own.',
        subject: '',
        audience: 'Customer' as const,
        class: 'Required' as const,
        channels: ['email'],
        status: 'Not written',
        lastEdited: new Date().toLocaleDateString(),
        editor: 'You',
        sentCount: 0,
      };
      options.onSuccess?.();
      return newMessage;
    } catch (err) {
      const msg = 'Failed to create message';
      setError(msg);
      options.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // K4 - Copying a message
  const copyMessage = useCallback(async (message: Message) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const copiedMessage: Message = {
        ...message,
        id: `msg_${Date.now()}`,
        name: `${message.name} (copy)`,
        isYours: true,
        trigger: 'Sent by hand, so nothing fires on its own.',
        status: 'Not written',
        lastEdited: new Date().toLocaleDateString(),
        editor: 'You',
        sentCount: 0,
      };
      options.onSuccess?.();
      return copiedMessage;
    } catch (err) {
      const msg = 'Failed to copy message';
      setError(msg);
      options.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // K5 - Removing a message
  const removeMessage = useCallback(async (message: Message) => {
    setLoading(true);
    try {
      // Check if message has been sent
      if (message.sentCount && message.sentCount > 0) {
        const alertMsg = ALERTS.REMOVE_SENT_MESSAGE(message.sentCount);
        options.onError?.(alertMsg);
        return false;
      }

      // Check if built-in message
      if (!message.isYours) {
        options.onError?.(ALERTS.REMOVE_BUILTIN_MESSAGE);
        return false;
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      options.onSuccess?.();
      return true;
    } catch (err) {
      const msg = 'Failed to remove message';
      setError(msg);
      options.onError?.(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // K8 - Logging a message sent by hand
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

  // K9 - Sending a test
  const sendTest = useCallback(async (wording: string, variables: string[]) => {
    setLoading(true);
    try {
      // Check for unfilled variables
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