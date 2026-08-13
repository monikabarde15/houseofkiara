// utils/validators.ts

export const validators = {
  // Validate email
  isEmail: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate phone number (Indian)
  isPhone: (phone: string): boolean => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone.replace(/[^0-9]/g, ''));
  },

  // Validate PIN code (Indian)
  isPin: (pin: string): boolean => {
    const regex = /^[1-9][0-9]{5}$/;
    return regex.test(pin);
  },

  // Validate PAN (Indian)
  isPan: (pan: string): boolean => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  },

  // Validate GSTIN (Indian)
  isGstin: (gstin: string): boolean => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstin);
  },

  // Validate required field
  isRequired: (value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  // Validate length
  isMinLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  isMaxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  // Validate URL
  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};