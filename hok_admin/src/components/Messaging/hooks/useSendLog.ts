// hooks/useSendLog.ts
import { useState, useEffect, useCallback } from 'react';

export interface SendLogEntry {
  id: string;
  when: string;
  message: string;
  wording: string;
  who: string;
  contact: string;
  channel: string;
  outcome: 'Delivered' | 'Opened' | 'Bounced' | 'Held' | 'Not sent';
  about: string;
  sentBy: string;
}

interface UseSendLogOptions {
  initialLogs?: SendLogEntry[];
}

export const useSendLog = (options: UseSendLogOptions = {}) => {
  const [logs, setLogs] = useState<SendLogEntry[]>(options.initialLogs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockLogs: SendLogEntry[] = [
        {
          id: '1',
          when: '22 Mar 2026, 15:04',
          message: 'Welcome Email',
          wording: 'Default',
          who: 'Priya Sharma',
          contact: 'priya@email.com',
          channel: 'Email',
          outcome: 'Delivered',
          about: 'Account created',
          sentBy: 'System',
        },
        {
          id: '2',
          when: '22 Mar 2026, 14:30',
          message: 'Order Confirmation',
          wording: 'Default',
          who: 'Amit Patel',
          contact: '+91 98765 43210',
          channel: 'WhatsApp',
          outcome: 'Opened',
          about: 'ORD-1234',
          sentBy: 'System',
        },
        {
          id: '3',
          when: '21 Mar 2026, 11:20',
          message: 'Return Initiated',
          wording: 'Default',
          who: 'Neha Kulkarni',
          contact: 'neha@email.com',
          channel: 'Email',
          outcome: 'Bounced',
          about: 'RET-5678',
          sentBy: 'You',
        },
      ];
      setLogs(mockLogs);
      setError(null);
    } catch (err) {
      setError('Failed to load send log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLogEntry = useCallback((entry: Omit<SendLogEntry, 'id' | 'when'>) => {
    const newEntry: SendLogEntry = {
      ...entry,
      id: `log_${Date.now()}`,
      when: new Date().toLocaleString(),
    };
    setLogs(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const filterLogs = useCallback((filters: {
    search?: string;
    channel?: string;
    outcome?: string;
  }) => {
    return logs.filter(log => {
      if (filters.search) {
        const searchLower = (filters.search || '').toLowerCase();
        const matches = (log.message || '').toLowerCase().includes(searchLower) ||
          (log.who || '').toLowerCase().includes(searchLower) ||
          (log.about || '').toLowerCase().includes(searchLower);
        if (!matches) return false;
      }
      if (filters.channel && filters.channel !== 'All channels' && log.channel !== filters.channel) {
        return false;
      }
      if (filters.outcome && filters.outcome !== 'All outcomes' && log.outcome !== filters.outcome) {
        return false;
      }
      return true;
    });
  }, [logs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
    addLogEntry,
    filterLogs,
  };
};