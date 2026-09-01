// services/sendService.ts

export interface SendRequest {
  messageId: string;
  promotionId?: string | null;
  wordingId?: string | null;
  channel: 'whatsapp' | 'email';
  personIds: string[];
}

export interface SendResponse {
  success: boolean;
  sentCount: number;
  heldCount: number;
  messages: Array<{
    personId: string;
    status: 'sent' | 'held';
    reason?: string;
  }>;
}

export const sendService = {
  // Send a message to selected people
  send: async (request: SendRequest): Promise<SendResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock response
    return {
      success: true,
      sentCount: request.personIds.length,
      heldCount: 0,
      messages: request.personIds.map(id => ({
        personId: id,
        status: 'sent',
      })),
    };
  },

  // Send a test message
  sendTest: async (wordingId: string, channel: 'whatsapp' | 'email'): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  },

  // Get available people for sending
  getAvailablePeople: async (params: {
    messageId: string;
    recordKind: string;
    list?: string;
    search?: string;
  }): Promise<Array<{
    id: string;
    name: string;
    contact: string;
    summary: string;
    available: boolean;
    unavailableReason?: string;
  }>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { id: '1', name: 'Priya Sharma', contact: 'priya@email.com', summary: 'Customer since 2024', available: true },
      { id: '2', name: 'Amit Patel', contact: '+91 98765 43210', summary: 'Customer since 2025', available: true },
      { id: '3', name: 'Neha Kulkarni', contact: 'neha@email.com', summary: 'Customer since 2023', available: false, unavailableReason: 'Has not agreed to hear from us' },
    ];
  },

  // Log a hand-sent message
  logHandSent: async (data: {
    name: string;
    channel: string;
    about: string;
  }): Promise<{
    id: string;
    when: string;
    message: string;
    wording: string;
    who: string;
    contact: string;
    channel: string;
    outcome: 'Delivered';
    about: string;
    sentBy: string;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: `log_${Date.now()}`,
      when: new Date().toLocaleString(),
      message: 'Hand-sent message',
      wording: 'Default',
      who: data.name,
      contact: '—',
      channel: data.channel,
      outcome: 'Delivered',
      about: data.about,
      sentBy: 'You',
    };
  },
};