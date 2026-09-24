// useShopperMessages Hook
/* ========================================
   Promotions Module - useShopperMessages Hook
   Message store CRUD
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 10
   ======================================== */

import { useState, useEffect, useCallback } from 'react';
import { ShopperMessages } from '../types/promotions.types';
import { DEFAULT_SHOPPER_MESSAGES } from '../utils/constants';

interface UseShopperMessagesReturn {
  messages: ShopperMessages;
  loading: boolean;
  error: string | null;
  updateMessages: (newMessages: Partial<ShopperMessages>) => Promise<boolean>;
  resetMessage: (key: keyof ShopperMessages) => void;
  resetAll: () => void;
  getCustomizedCount: () => number;
  refresh: () => void;
}

export const useShopperMessages = (): UseShopperMessagesReturn => {
  const [messages, setMessages] = useState<ShopperMessages>(DEFAULT_SHOPPER_MESSAGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // In production: await messagesService.getMessages()
      await new Promise(resolve => setTimeout(resolve, 300));
      setMessages(DEFAULT_SHOPPER_MESSAGES);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateMessages = useCallback(async (newMessages: Partial<ShopperMessages>): Promise<boolean> => {
    setError(null);
    try {
      // In production: await messagesService.updateMessages(newMessages)
      await new Promise(resolve => setTimeout(resolve, 300));
      setMessages(prev => ({ ...prev, ...newMessages }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update messages');
      return false;
    }
  }, []);

  const resetMessage = useCallback((key: keyof ShopperMessages) => {
    setMessages(prev => ({ ...prev, [key]: DEFAULT_SHOPPER_MESSAGES[key] }));
  }, []);

  const resetAll = useCallback(() => {
    setMessages(DEFAULT_SHOPPER_MESSAGES);
  }, []);

  const getCustomizedCount = useCallback((): number => {
    let count = 0;
    const keys = Object.keys(DEFAULT_SHOPPER_MESSAGES) as (keyof ShopperMessages)[];
    for (const key of keys) {
      if (messages[key] !== DEFAULT_SHOPPER_MESSAGES[key]) {
        count++;
      }
    }
    return count;
  }, [messages]);

  const refresh = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    updateMessages,
    resetMessage,
    resetAll,
    getCustomizedCount,
    refresh,
  };
};