// hooks/useMessageDetail.ts
import { useState, useEffect, useCallback } from 'react';

export interface MessageDetail {
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
  wordings: Array<{
    id: string;
    name: string;
    subject: string;
    previewLine: string;
    email: string;
    whatsapp: string;
  }>;
}

interface UseMessageDetailOptions {
  messageId: string | null;
}

export const useMessageDetail = ({ messageId }: UseMessageDetailOptions) => {
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = useCallback(async () => {
    if (!messageId) {
      setMessage(null);
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockMessage: MessageDetail = {
        id: messageId,
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
        wordings: [
          {
            id: 'w1',
            name: 'Default',
            subject: 'Welcome to House of Kaira',
            previewLine: 'Thank you for joining us',
            email: 'Dear {{customer_name}},\n\nThank you for creating an account.',
            whatsapp: 'Welcome to House of Kaira!',
          },
          {
            id: 'w2',
            name: 'Rental - deposit paid',
            subject: 'Your rental is confirmed',
            previewLine: 'Your deposit has been received',
            email: 'Dear {{customer_name}},\n\nYour deposit has been received.',
            whatsapp: 'Your rental deposit has been received.',
          },
        ],
      };
      setMessage(mockMessage);
      setError(null);
    } catch (err) {
      setError('Failed to load message details');
    } finally {
      setLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  const updateWording = useCallback(async (wordingId: string, data: Partial<MessageDetail['wordings'][0]>) => {
    if (!message) return;
    // Mock update
    await new Promise((resolve) => setTimeout(resolve, 300));
    setMessage({
      ...message,
      wordings: message.wordings.map(w =>
        w.id === wordingId ? { ...w, ...data } : w
      ),
    });
  }, [message]);

  return {
    message,
    loading,
    error,
    refetch: fetchMessage,
    updateWording,
  };
};