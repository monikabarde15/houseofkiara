// utils/formatter.ts

export const formatter = {
  // Format date
  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  },

  // Format date and time
  formatDateTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const dateStr = formatter.formatDate(d);
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${dateStr}, ${time}`;
  },

  // Format money (Indian format)
  formatMoney: (amount: number): string => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  },

  // Format money with decimals
  formatMoneyWithDecimals: (amount: number): string => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  },

  // Format percentage
  formatPercentage: (value: number): string => {
    return `${Math.round(value)}%`;
  },

  // Pluralize
  pluralize: (count: number, singular: string, plural: string): string => {
    return count === 1 ? singular : plural;
  },

  // Format count
  formatCount: (count: number, total: number, label: string): string => {
    return `${count} of ${total} ${label}`;
  },

  // Format hours
  formatHours: (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    if (hours === 1) {
      return '1 hour';
    }
    return `${Math.round(hours)} hours`;
  },

  // Format ID with padding
  formatId: (id: number, prefix: string, padding: number = 4): string => {
    return `${prefix}${String(id).padStart(padding, '0')}`;
  },

  // Truncate text
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  // Capitalize first letter
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  // Title case
  titleCase: (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Get status pill color
  getStatusPill: (status: string): 'green' | 'amber' | 'grey' | 'blue' | 'terracotta' => {
    const map: Record<string, 'green' | 'amber' | 'grey' | 'blue' | 'terracotta'> = {
      'Live': 'green',
      'Opened': 'green',
      'Delivered': 'blue',
      'Paused': 'amber',
      'Held': 'amber',
      'Not written': 'grey',
      'Not sent': 'grey',
      'Bounced': 'terracotta',
      'Required': 'green',
      'Optional': 'amber',
      'Marketing': 'grey',
    };
    return map[status] || 'grey';
  },

  // Format phone number (Indian)
  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  // Format email for display
  formatEmail: (email: string): string => {
    if (email.length > 30) {
      const [local, domain] = email.split('@');
      const truncatedLocal = local.slice(0, 15) + '...';
      return `${truncatedLocal}@${domain}`;
    }
    return email;
  },

  // Format order number
  formatOrderNumber: (orderId: string): string => {
    return `#${orderId.toUpperCase()}`;
  },
};

// Export individual functions for convenience
export const {
  formatDate,
  formatDateTime,
  formatMoney,
  formatMoneyWithDecimals,
  formatPercentage,
  pluralize,
  formatCount,
  formatHours,
  formatId,
  truncate,
  capitalize,
  titleCase,
  getStatusPill,
  formatPhone,
  formatEmail,
  formatOrderNumber,
} = formatter;