// utils/generators.ts

export const generators = {
  // Generate a unique ID
  generateId: (prefix: string = ''): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`;
  },

  // Generate SUB-ID (from LYP spec)
  generateSubId: (): string => {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SUB-${year}-${random}`;
  },

  // Generate SKU
  generateSku: (params: {
    designer?: string;
    category?: string;
    year?: string;
  }): string => {
    const { designer = 'HK', category = 'GEN', year = new Date().getFullYear().toString().slice(-2) } = params;
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${designer}-${category}-${year}-${random}`;
  },

  // Generate slug from name
  generateSlug: (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Generate WhatsApp link
  generateWhatsAppLink: (phone: string, message?: string): string => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = message ? encodeURIComponent(message) : '';
    return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  },

  // Generate random color
  generateRandomColor: (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },

  // Generate current timestamp
  generateTimestamp: (): string => {
    return new Date().toISOString();
  },

  // Generate human-readable timestamp
  generateHumanTimestamp: (date?: Date): string => {
    const d = date || new Date();
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${month} ${year}, ${time}`;
  },

  // Generate unique name for copy
  generateCopyName: (originalName: string, existingNames: string[]): string => {
    const baseName = `${originalName} (copy)`;
    if (!existingNames.includes(baseName)) {
      return baseName;
    }
    let counter = 2;
    while (existingNames.includes(`${originalName} (copy ${counter})`)) {
      counter++;
    }
    return `${originalName} (copy ${counter})`;
  },
};