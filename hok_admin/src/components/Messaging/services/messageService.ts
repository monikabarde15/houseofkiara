// services/messageService.ts

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

export interface MessageDetail extends Message {
  wordings: Array<{
    id: string;
    name: string;
    subject: string;
    previewLine: string;
    email: string;
    whatsapp: string;
  }>;
}

const API_BASE = '/api/messages';

export const messageService = {
  // Get all messages
  getMessages: async (params?: {
    search?: string;
    audience?: string;
    type?: string;
    status?: string;
  }): Promise<Message[]> => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
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
      {
        id: '2',
        name: 'Order Confirmation',
        wordingCount: 1,
        isYours: false,
        trigger: 'Sent when an order is placed',
        subject: 'Your order is confirmed',
        audience: 'Customer',
        class: 'Required',
        channels: ['email', 'whatsapp'],
        status: 'Live',
        lastEdited: '21 Mar 2026',
        editor: 'Amit Patel',
      },
    ];
  },

  // Get a single message by ID
  getMessage: async (id: string): Promise<MessageDetail> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
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
  },

  // Create a new message
  createMessage: async (data: Partial<Message>): Promise<Message> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: `msg_${Date.now()}`,
      name: data.name || 'New message',
      wordingCount: 1,
      isYours: true,
      trigger: data.trigger || 'Sent by hand, so nothing fires on its own.',
      subject: data.subject || '',
      audience: data.audience || 'Customer',
      class: data.class || 'Required',
      channels: data.channels || ['email'],
      status: 'Not written',
      lastEdited: new Date().toLocaleDateString(),
      editor: 'You',
    };
  },

  // Copy a message
  copyMessage: async (id: string): Promise<Message> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const original = await messageService.getMessage(id);
    return {
      ...original,
      id: `msg_${Date.now()}`,
      name: `${original.name} (copy)`,
      isYours: true,
      status: 'Not written',
      lastEdited: new Date().toLocaleDateString(),
      editor: 'You',
    };
  },

  // Delete a message
  deleteMessage: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock delete
  },

  // Update a message
  updateMessage: async (id: string, data: Partial<Message>): Promise<Message> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Message',
      wordingCount: 1,
      isYours: true,
      trigger: data.trigger || 'Updated trigger',
      subject: data.subject || '',
      audience: data.audience || 'Customer',
      class: data.class || 'Required',
      channels: data.channels || ['email'],
      status: data.status || 'Not written',
      lastEdited: new Date().toLocaleDateString(),
      editor: 'You',
    };
  },
};