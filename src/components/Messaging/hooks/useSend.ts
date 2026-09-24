// hooks/useSend.ts
import { useState, useCallback } from 'react';

export interface Person {
  id: string;
  name: string;
  contact: string;
  summary: string;
  available: boolean;
  unavailableReason?: string;
}

export interface SendState {
  messageId: string;
  promotionId: string | null;
  wordingId: string | null;
  channel: 'whatsapp' | 'email';
  selectedPeople: string[];
}

export const useSend = () => {
  const [state, setState] = useState<SendState>({
    messageId: '',
    promotionId: null,
    wordingId: null,
    channel: 'whatsapp',
    selectedPeople: [],
  });

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  const selectMessage = useCallback((messageId: string) => {
    setState((prev) => ({ ...prev, messageId }));
  }, []);

  const selectPromotion = useCallback((promotionId: string | null) => {
    setState((prev) => ({ ...prev, promotionId }));
  }, []);

  const selectWording = useCallback((wordingId: string | null) => {
    setState((prev) => ({ ...prev, wordingId }));
  }, []);

  const selectChannel = useCallback((channel: 'whatsapp' | 'email') => {
    setState((prev) => ({ ...prev, channel }));
  }, []);

  const togglePerson = useCallback((personId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPeople: prev.selectedPeople.includes(personId)
        ? prev.selectedPeople.filter((id) => id !== personId)
        : [...prev.selectedPeople, personId],
    }));
  }, []);

  const clearPeople = useCallback(() => {
    setState((prev) => ({ ...prev, selectedPeople: [] }));
  }, []);

  const loadPeople = useCallback(async (kind: string, list?: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockPeople: Person[] = [
        { id: '1', name: 'Priya Sharma', contact: 'priya@email.com', summary: 'Customer since 2024', available: true },
        { id: '2', name: 'Amit Patel', contact: '+91 98765 43210', summary: 'Customer since 2025', available: true },
        { id: '3', name: 'Neha Kulkarni', contact: 'neha@email.com', summary: 'Customer since 2023', available: false, unavailableReason: 'Has not agreed to hear from us' },
      ];
      setPeople(mockPeople);
    } finally {
      setLoading(false);
    }
  }, []);

  const send = useCallback(async () => {
    if (state.selectedPeople.length === 0) {
      throw new Error('Choose who it is going to first.');
    }
    // Mock send
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, count: state.selectedPeople.length };
  }, [state.selectedPeople]);

  return {
    state,
    people,
    loading,
    selectMessage,
    selectPromotion,
    selectWording,
    selectChannel,
    togglePerson,
    clearPeople,
    loadPeople,
    send,
  };
};